import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const studentDir = path.join(root, "notebooks", "student");
const solutionDir = path.join(root, "notebooks", "solutions");
fs.mkdirSync(studentDir, { recursive: true });
fs.mkdirSync(solutionDir, { recursive: true });

let cellCounter = 0;
const nextId = () => `cell-${String(++cellCounter).padStart(4, "0")}`;
const md = (source) => ({ cell_type: "markdown", id: nextId(), metadata: {}, source: source.split(/(?<=\n)/) });
const code = (source, tags = []) => ({
  cell_type: "code", id: nextId(), execution_count: null, metadata: tags.length ? { tags } : {},
  outputs: [], source: source.split(/(?<=\n)/),
});
const notebook = (cells) => ({
  cells,
  metadata: {
    kernelspec: { display_name: "Python 3", language: "python", name: "python3" },
    language_info: { name: "python", version: "3.12" },
  },
  nbformat: 4, nbformat_minor: 5,
});
const setup = code(`from pathlib import Path\nimport sys\nROOT = next(p for p in [Path.cwd(), *Path.cwd().parents] if (p / "src").exists())\nsys.path.insert(0, str(ROOT / "src"))\nDATA = ROOT / "data" / "raw"\nRANDOM_STATE = 42\n`);

const labs = [
  {
    file: "01_frame_split_baseline.ipynb",
    cells: [
      md(`# اليوم 1، المعمل 1: صياغة المشكلة والتقسيم وخط الأساس\n\n**الهدف:** تحويل طلب «نريد منع التسرب» إلى مهمة تصنيف محددة وقابلة للقياس.\n\nقبل الكود، اكتب: ما الذي يمثله الصف؟ متى يحدث التنبؤ؟ ومن سيستخدم النتيجة؟`),
      setup,
      code(`import pandas as pd\nfrom sklearn.dummy import DummyClassifier\nfrom sklearn.metrics import average_precision_score\nfrom manafeth.data import load_customers, split_customers\nfrom manafeth.features import FEATURE_COLUMNS, LEAKAGE_COLUMNS\n\ndf = load_customers(DATA)\nprint("shape:", df.shape)\ndisplay(df.head(3))\ndisplay(df.isna().mean().sort_values(ascending=False).head(6).rename("missing_rate"))\nprint("churn rate:", df.churned_30d.mean().round(3))\n`),
      md(`## تسرب البيانات\n\nطبّق اختبار الزمن: هل كانت القيمة موجودة في 2025-11-01 لحظة التنبؤ؟ الأعمدة التالية ممنوعة: معرف العميل، استرداد صدر لاحقًا، تذكرة بعد اللقطة، وعدد طلبات الشهر التالي.`),
      code(`print("excluded:", LEAKAGE_COLUMNS)\nassert not set(FEATURE_COLUMNS) & set(LEAKAGE_COLUMNS)\nX_train, X_test, y_train, y_test = split_customers(df, RANDOM_STATE)\nprint(X_train.shape, X_test.shape)\nprint("train/test prevalence:", y_train.mean().round(3), y_test.mean().round(3))\n`),
      md(`## مهمتك\n\nأنشئ DummyClassifier من نوع prior. درّبه على train، ثم احسب PR-AUC على train فقط. لا تستخدم test حتى اليوم الرابع.`),
      code(`# TODO: أنشئ dummy ثم استخرج احتمالات الفئة 1\n# dummy = ...\n# train_probability = ...\n# print("Dummy PR-AUC:", average_precision_score(y_train, train_probability))\n`),
      md(`### فكر أولًا\n\nلماذا يجب أن تكون نتيجة الخط الأساسي قريبة من نسبة المتسربين 14%؟ ما الذي يعنيه نموذج نتيجته 0.20؟\n\n**ناتج التسليم:** انسخ templates/FRAMING.md، أكمله، وسجّل حجم التقسيم وDummy PR-AUC.`),
    ],
    solution: `dummy = DummyClassifier(strategy="prior")\ndummy.fit(X_train, y_train)\ntrain_probability = dummy.predict_proba(X_train)[:, 1]\nprint("Dummy PR-AUC:", round(average_precision_score(y_train, train_probability), 3))\n`,
  },
  {
    file: "02_regression.ipynb",
    cells: [
      md(`# اليوم 1، المعمل 2A: أول نموذج انحدار\n\n**السؤال:** هل نستطيع تقدير متوسط قيمة سلة العميل بالريال؟ سنقارن Linear Regression مع توقع ثابت بسيط.`),
      setup,
      code(`import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn.dummy import DummyRegressor\nfrom sklearn.linear_model import LinearRegression, Ridge\nfrom sklearn.metrics import mean_absolute_error\nfrom sklearn.model_selection import train_test_split\n\ndf = pd.read_parquet(DATA / "manafeth_customers.parquet")\nfeatures = ["tenure_months", "orders_per_month", "days_since_last_order", "distinct_categories", "promo_usage_rate"]\nclean = df[features + ["avg_basket_sar"]].dropna()\nX_train, X_valid, y_train, y_valid = train_test_split(clean[features], clean.avg_basket_sar, test_size=.2, random_state=RANDOM_STATE)\n`),
      md(`## مهمتك\n\nدرّب DummyRegressor ثم LinearRegression. احسب MAE للاثنين بالريال. النموذج الجيد يجب أن يخفض الخطأ مقارنة بتوقع الوسيط.`),
      code(`# TODO: fit baseline and linear model, then calculate MAE\n`),
      md(`## بقايا النموذج\n\nارسم residual = actual - prediction. إذا اتسع شكل النقاط مع ارتفاع التوقع، جرّب تدريب الهدف بعد ` + "`np.log1p`" + ` ثم أعده بالـ ` + "`np.expm1`" + `.`),
      code(`# TODO: residual scatter plot\n`),
      md(`**ناتج التسليم:** جدول صغير يحتوي النموذج وMAE بالريال، وفقرة تشرح أين يخطئ النموذج أكثر.`),
    ],
    solution: `baseline = DummyRegressor(strategy="median").fit(X_train, y_train)\nlinear = LinearRegression().fit(X_train, y_train)\nbase_pred = baseline.predict(X_valid)\nlinear_pred = linear.predict(X_valid)\nprint("Dummy MAE SAR:", round(mean_absolute_error(y_valid, base_pred), 2))\nprint("Linear MAE SAR:", round(mean_absolute_error(y_valid, linear_pred), 2))\n\nresiduals = y_valid - linear_pred\nplt.scatter(linear_pred, residuals, alpha=.2)\nplt.axhline(0, color="black")\nplt.xlabel("Predicted basket (SAR)")\nplt.ylabel("Residual (SAR)")\nplt.title("Residuals reveal where the linear model struggles")\nplt.show()\n`,
  },
  {
    file: "03_classification_overfitting.ipynb",
    cells: [
      md(`# اليوم 2، المعمل 2B: التصنيف وفرط التعلّم\n\nالتصنيف يعيد احتمالًا أولًا. تحويل الاحتمال إلى 0 أو 1 يحتاج عتبة مرتبطة بالقرار.`),
      setup,
      code(`import pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import average_precision_score\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import OneHotEncoder, StandardScaler\nfrom sklearn.tree import DecisionTreeClassifier\nfrom manafeth.data import load_customers, split_customers\nfrom manafeth.features import FEATURE_COLUMNS, build_preprocessor\n\ndf = load_customers(DATA)\nX_train, X_test, y_train, y_test = split_customers(df)\nX_fit, X_valid, y_fit, y_valid = __import__('sklearn').model_selection.train_test_split(X_train, y_train, test_size=.25, stratify=y_train, random_state=RANDOM_STATE)\n`),
      md(`## Logistic Regression\n\nابن Pipeline يجمع التجهيز والنموذج. احسب PR-AUC من الاحتمالات، وليس من 0/1.`),
      code(`# TODO: Pipeline(build_preprocessor(), LogisticRegression(...))\n`),
      md(`## تجربة عمق الشجرة\n\nغيّر ` + "`max_depth`" + ` من 1 إلى 20. سجّل train وvalidation PR-AUC. ابحث عن الفجوة التي تكبر بعد أن تتحسن نتيجة التدريب وحدها.`),
      code(`# TODO: depth sweep and plot both curves\n`),
      md(`**سؤال التسليم:** اختر عمقًا وادعمه بدليل من validation، لا من train.`),
    ],
    solution: `logit = Pipeline([("prep", build_preprocessor()), ("model", LogisticRegression(max_iter=1000, class_weight="balanced"))])\nlogit.fit(X_fit, y_fit)\nvalid_prob = logit.predict_proba(X_valid)[:, 1]\nprint("Logistic validation PR-AUC:", round(average_precision_score(y_valid, valid_prob), 3))\n\ntrain_scores, valid_scores = [], []\nfor depth in range(1, 21):\n    tree = Pipeline([("prep", build_preprocessor(scale_numeric=False)), ("model", DecisionTreeClassifier(max_depth=depth, min_samples_leaf=20, random_state=RANDOM_STATE))])\n    tree.fit(X_fit, y_fit)\n    train_scores.append(average_precision_score(y_fit, tree.predict_proba(X_fit)[:, 1]))\n    valid_scores.append(average_precision_score(y_valid, tree.predict_proba(X_valid)[:, 1]))\nplt.plot(range(1, 21), train_scores, label="train")\nplt.plot(range(1, 21), valid_scores, label="validation")\nplt.xlabel("max_depth"); plt.ylabel("PR-AUC"); plt.legend(); plt.show()\nprint("best depth:", int(pd.Series(valid_scores, index=range(1, 21)).idxmax()))\n`,
  },
  {
    file: "04_pipelines_leakage.ipynb",
    cells: [
      md(`# اليوم 2، المعمل 3: Pipeline وصيد التسرب\n\nيبني هذا المعمل كائنًا واحدًا يستقبل الصف الخام ويعيد احتمالًا. كل قيمة يتعلمها imputer أو scaler تأتي من بيانات التدريب فقط.`),
      setup,
      code(`import pandas as pd\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import average_precision_score\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.utils import shuffle\nfrom manafeth.data import load_customers, split_customers\nfrom manafeth.features import build_preprocessor, LEAKAGE_COLUMNS\n\ndf = load_customers(DATA)\nX_train, X_test, y_train, y_test = split_customers(df)\n`),
      md(`## مهمتك الأولى\n\nكوّن Pipeline من ` + "`build_preprocessor()`" + ` وLogisticRegression. نفّذ 75/25 validation داخل train.`),
      code(`# TODO: split X_train again, fit pipeline, calculate validation PR-AUC\n`),
      md(`## اختبار الملصقات العشوائية\n\nإذا خلطنا y يجب أن يهبط PR-AUC قرب 0.14. نتيجة مرتفعة تعني أن مسارًا ما يكشف الإجابة.`),
      code(`# TODO: shuffle y_fit, refit a fresh pipeline, score on y_valid\n`),
      md(`## تحدي التسرب\n\nجرّب مؤقتًا إضافة ` + "`next_month_orders`" + ` من dataframe قبل التقسيم. لاحظ القفزة، ثم احذف العمود واشرح لماذا لا يمثل إنجازًا.`),
      code(`# لا تضع العمود المسرّب في النسخة النهائية. اكتب تفسيرك هنا.\n`),
      md(`**ناتج التسليم:** Pipeline نظيف، نتيجة صحيحة، وشرح زمني لكل عمود مستبعد.`),
    ],
    solution: `from sklearn.model_selection import train_test_split\nX_fit, X_valid, y_fit, y_valid = train_test_split(X_train, y_train, test_size=.25, stratify=y_train, random_state=RANDOM_STATE)\npipe = Pipeline([("prep", build_preprocessor()), ("model", LogisticRegression(max_iter=1000, class_weight="balanced"))])\npipe.fit(X_fit, y_fit)\nprint("honest PR-AUC:", round(average_precision_score(y_valid, pipe.predict_proba(X_valid)[:, 1]), 3))\n\ny_shuffled = shuffle(y_fit, random_state=RANDOM_STATE).to_numpy()\nnull_pipe = Pipeline([("prep", build_preprocessor()), ("model", LogisticRegression(max_iter=1000))])\nnull_pipe.fit(X_fit, y_shuffled)\nprint("shuffled-label PR-AUC:", round(average_precision_score(y_valid, null_pipe.predict_proba(X_valid)[:, 1]), 3))\n`,
  },
  {
    file: "05_evaluation_thresholds.ipynb",
    cells: [
      md(`# اليوم 3، المعمل 4: التقييم والعتبة\n\nلأن 14% فقط من العملاء يتوقفون، نستخدم PR-AUC للمقارنة. ثم نختار عتبة تسمح بالتواصل مع 20% من العملاء فقط.`),
      setup,
      code(`import pandas as pd\nfrom sklearn.dummy import DummyClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.model_selection import train_test_split\nfrom manafeth.data import load_customers, split_customers\nfrom manafeth.features import build_preprocessor\nfrom manafeth.evaluation import evaluate_classifier, recall_at_fraction, threshold_for_fraction\n\ndf = load_customers(DATA)\nX_train, X_test, y_train, y_test = split_customers(df)\nmodel = Pipeline([("prep", build_preprocessor()), ("model", LogisticRegression(max_iter=1000, class_weight="balanced"))])\n`),
      md(`## Cross-Validation موحد\n\nقيّم Dummy والنموذج بنفس الطيات. اذكر المتوسط والانحراف المعياري.`),
      code(`# TODO: call evaluate_classifier for both models and display a comparison table\n`),
      md(`## عتبة الميزانية\n\nأنشئ validation داخل train. درّب النموذج، استخرج الاحتمالات، ثم احسب threshold وrecall عندما نختار أعلى 20%.`),
      code(`# TODO: choose the top-20% operating point without touching test\n`),
      md(`## تحليل الشرائح\n\nقارن recall بين المدن وبين العملاء الجدد والقدامى. لا يعني الفرق وحده وجود ظلم، لكنه إشارة تحتاج تفسيرًا وبيانات إضافية.`),
      code(`# TODO: create a table of recall by city at the chosen threshold\n`),
      md(`**ناتج التسليم:** جدول CV، جملة قرار مثل «عند التواصل مع 20% نسترجع ...% من المتسربين»، وجدول شرائح.`),
    ],
    solution: `dummy = Pipeline([("prep", build_preprocessor()), ("model", DummyClassifier(strategy="prior"))])\ncomparison = pd.DataFrame({"dummy": evaluate_classifier(dummy, X_train, y_train), "logistic": evaluate_classifier(model, X_train, y_train)}).T\ndisplay(comparison)\n\nX_fit, X_valid, y_fit, y_valid = train_test_split(X_train, y_train, test_size=.25, stratify=y_train, random_state=RANDOM_STATE)\nmodel.fit(X_fit, y_fit)\nprob = model.predict_proba(X_valid)[:, 1]\nthreshold = threshold_for_fraction(prob, .20)\nprint("threshold:", round(threshold, 3), "recall@20%:", round(recall_at_fraction(y_valid, prob, .20), 3))\n\nrows = []\nfor city, idx in X_valid.groupby("city").groups.items():\n    pred = prob[X_valid.index.get_indexer(idx)] >= threshold\n    truth = y_valid.loc[idx].to_numpy()\n    rows.append({"city": city, "recall": truth[pred].sum() / max(1, truth.sum()), "churners": int(truth.sum())})\ndisplay(pd.DataFrame(rows).set_index("city"))\n`,
  },
  {
    file: "06_ensembles.ipynb",
    cells: [
      md(`# اليوم 3، المعمل 5: الأشجار التجميعية\n\nنقارن Random Forest مع النموذج الخطي تحت نفس بروتوكول التقييم. النموذج الأقوى لا يفوز إلا إذا كان التحسن ثابتًا وله تكلفة مقبولة.`),
      setup,
      code(`import pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier\nfrom sklearn.inspection import permutation_importance\nfrom sklearn.pipeline import Pipeline\nfrom manafeth.data import load_customers, split_customers\nfrom manafeth.features import build_preprocessor\nfrom manafeth.evaluation import evaluate_classifier\n\ndf = load_customers(DATA)\nX_train, X_test, y_train, y_test = split_customers(df)\nforest = Pipeline([("prep", build_preprocessor(scale_numeric=False)), ("model", RandomForestClassifier(n_estimators=250, max_depth=10, min_samples_leaf=15, class_weight="balanced", n_jobs=-1, random_state=RANDOM_STATE))])\n`),
      md(`## مهمتك\n\nقيّم forest باستخدام الدالة المشتركة. قارن PR-AUC ووقت التدريب بالنموذج الخطي من المعمل السابق.`),
      code(`# TODO: evaluate forest and write one evidence-based champion/challenger sentence\n`),
      md(`## Permutation Importance\n\nدرّب على جزء train واحسب الأهمية على validation الخام. هذا الاختبار يسأل: كم تنخفض النتيجة عندما نفسد عمودًا واحدًا؟`),
      code(`# TODO: permutation_importance(forest, X_valid, y_valid, scoring="average_precision")\n`),
      md(`**ناتج التسليم:** ` + "`CHAMPION.md`" + ` يحتوي جدول النماذج وسبب الاختيار وسبب الاحتفاظ بالمنافس.`),
    ],
    solution: `score = evaluate_classifier(forest, X_train, y_train)\ndisplay(score.to_frame("random_forest").T)\n\nfrom sklearn.model_selection import train_test_split\nX_fit, X_valid, y_fit, y_valid = train_test_split(X_train, y_train, test_size=.20, stratify=y_train, random_state=RANDOM_STATE)\nforest.fit(X_fit, y_fit)\nimportance = permutation_importance(forest, X_valid, y_valid, scoring="average_precision", n_repeats=5, random_state=RANDOM_STATE, n_jobs=-1)\nimp = pd.Series(importance.importances_mean, index=X_valid.columns).sort_values(ascending=False).head(10)\nimp.sort_values().plot.barh(title="Permutation importance on validation data")\nplt.xlabel("Decrease in PR-AUC"); plt.show()\n`,
  },
  {
    file: "07_clustering_pca.ipynb",
    cells: [
      md(`# اليوم 4، المعمل 6: تقسيم العملاء دون ملصقات\n\nK-Means يعيد مجموعات حتى للضوضاء. لذلك نحتاج قياسًا، ملفات تعريف قابلة للتسمية، واختبار فائدة خارجي.`),
      setup,
      code(`import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn.cluster import KMeans\nfrom sklearn.decomposition import PCA\nfrom sklearn.metrics import silhouette_score\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom manafeth.data import load_customers\n\ndf = load_customers(DATA)\nfeatures = ["orders_per_month", "avg_basket_sar", "days_since_last_order", "distinct_categories", "promo_usage_rate"]\nX = df[features].fillna(df[features].median()).copy()\nX[["orders_per_month", "avg_basket_sar", "days_since_last_order"]] = np.log1p(X[["orders_per_month", "avg_basket_sar", "days_since_last_order"]])\nscaled = StandardScaler().fit_transform(X)\n`),
      md(`## اختيار k\n\nجرّب k من 2 إلى 8 على عينة 10,000 صف لتسريع silhouette. لا تختَر أعلى رقم آليًا. افحص سهولة تسمية المجموعات.`),
      code(`# TODO: calculate inertia and silhouette for k=2..8\n`),
      md(`## الملف التعريفي والخريطة\n\nدرّب KMeans بالقيمة المختارة. اعرض متوسطات الخصائص والحجم ومعدل churn لكل مجموعة، ثم استخدم PCA للرسم فقط.`),
      code(`# TODO: fit, profile clusters, project with PCA, scatter plot\n`),
      md(`**ناتج التسليم:** جدول مجموعات بأسماء عربية عملية. الاسم يصف السلوك ولا يحكم على الشخص.`),
    ],
    solution: `sample = scaled[:10000]\nrows = []\nfor k in range(2, 9):\n    labels = KMeans(n_clusters=k, n_init=10, random_state=RANDOM_STATE).fit_predict(sample)\n    rows.append({"k": k, "silhouette": silhouette_score(sample, labels, sample_size=3000, random_state=RANDOM_STATE)})\ndisplay(pd.DataFrame(rows))\n\nk = int(pd.DataFrame(rows).sort_values("silhouette", ascending=False).iloc[0].k)\nkmeans = KMeans(n_clusters=k, n_init=20, random_state=RANDOM_STATE)\nlabels = kmeans.fit_predict(scaled)\nprofile = df.assign(cluster=labels).groupby("cluster").agg(size=("customer_id", "size"), orders_pm=("orders_per_month", "mean"), basket=("avg_basket_sar", "mean"), recency=("days_since_last_order", "mean"), churn_rate=("churned_30d", "mean"))\ndisplay(profile.round(2))\npoints = PCA(n_components=2, random_state=RANDOM_STATE).fit_transform(scaled)\nplt.scatter(points[::10, 0], points[::10, 1], c=labels[::10], s=6, alpha=.4, cmap="tab10")\nplt.xlabel("PC1"); plt.ylabel("PC2"); plt.title("Customer segments in a 2D PCA view"); plt.show()\n`,
  },
  {
    file: "08_tuning_model_card.ipynb",
    cells: [
      md(`# اليوم 4، المعمل 7: الضبط وإغلاق الحلقة\n\nنضبط النموذج داخل train باستخدام طيات. بعد تثبيت كل قرار، نفتح test مرة واحدة ونكتب بطاقة النموذج.`),
      setup,
      code(`import pandas as pd\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import average_precision_score, precision_score, recall_score\nfrom sklearn.model_selection import RandomizedSearchCV, StratifiedKFold\nfrom sklearn.pipeline import Pipeline\nfrom scipy.stats import randint, loguniform\nfrom manafeth.data import load_customers, split_customers\nfrom manafeth.features import build_preprocessor\nfrom manafeth.evaluation import threshold_for_fraction\n\ndf = load_customers(DATA)\nX_train, X_test, y_train, y_test = split_customers(df)\npipe = Pipeline([("prep", build_preprocessor(scale_numeric=False)), ("model", RandomForestClassifier(class_weight="balanced", n_jobs=-1, random_state=RANDOM_STATE))])\n`),
      md(`## بحث محدود\n\nاستخدم 12 تجربة فقط. البحث ليس مسابقة استهلاك حوسبة. دوّن مساحة البحث والميزانية قبل التشغيل.`),
      code(`# TODO: RandomizedSearchCV over n_estimators, max_depth, min_samples_leaf, max_features\n`),
      md(`## الاختبار النهائي\n\nبعد اختيار الإعدادات، استخدم best_estimator_ على test مرة واحدة. احسب PR-AUC وحدد عتبة أعلى 20% ثم Precision وRecall.`),
      code(`# TODO: exactly one predict_proba(X_test) call in the final workflow\n`),
      md(`## بطاقة النموذج\n\nانسخ ` + "`templates/MODEL_CARD.md`" + ` إلى ` + "`artifacts/MODEL_CARD.md`" + `. سجّل intended use، البيانات، CV، test، الشرائح الضعيفة، وحدود الاستخدام.\n\n**ناتج التسليم:** أفضل إعدادات، نتائج CV وtest، عتبة القرار، وبطاقة نموذج مكتملة.`),
    ],
    solution: `cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=RANDOM_STATE)\nparams = {\n    "model__n_estimators": randint(150, 450),\n    "model__max_depth": randint(5, 16),\n    "model__min_samples_leaf": randint(5, 35),\n    "model__max_features": ["sqrt", .6, .9],\n}\nsearch = RandomizedSearchCV(pipe, params, n_iter=12, scoring="average_precision", cv=cv, n_jobs=-1, random_state=RANDOM_STATE, refit=True, verbose=1)\nsearch.fit(X_train, y_train)\nprint("best CV PR-AUC:", round(search.best_score_, 3))\nprint(search.best_params_)\n\n# The test set is opened once, after the full protocol is frozen.\ntest_probability = search.best_estimator_.predict_proba(X_test)[:, 1]\nthreshold = threshold_for_fraction(test_probability, .20)\ntest_prediction = test_probability >= threshold\nprint("test PR-AUC:", round(average_precision_score(y_test, test_probability), 3))\nprint("threshold:", round(threshold, 3))\nprint("precision:", round(precision_score(y_test, test_prediction), 3))\nprint("recall:", round(recall_score(y_test, test_prediction), 3))\n`,
  },
  {
    file: "09_capstone_project.ipynb",
    cells: [
      md(`# اليوم 5: مشروعكم على Dataset جديدة\n\nاستخدم Dataset أحضرها فريقك واعتمدها المدرب في نهاية اليوم الرابع. الهدف هو نقل ما تعلمته في Labs «منافذ» إلى مشكلة جديدة. استخدم هذا الدفتر كسرد واضح لقراراتك، وليس كساحة تجارب عشوائية.\n\n**التسليم:** FRAMING.md، هذا الدفتر بعد إعادة تشغيله، MODEL_CARD.md، وعرض من 5 إلى 7 دقائق.`),
      setup,
      md(`## C1: اعتماد البيانات والمشكلة والتقسيم\n\nسجّل مصدر Dataset وترخيصها، ثم اكتب: قرار العمل، ما يمثله الصف، الهدف، زمن التنبؤ، المقياس، ونوع التقسيم. إذا لم تعتمد بيانات فريقك، استخدم الملف الاحتياطي الذي يحدده المدرب.`),
      code(`# TODO: load one capstone dataset and display shape, dtypes, target balance or summary\n`),
      code(`# TODO: create the correct random, temporal, or grouped split and explain why\n`),
      md(`## C2: خط الأساس وPipeline\n\nسجّل Dummy baseline وقاعدة مجال بسيطة قبل أول نموذج. اجمع تجهيز الأرقام والفئات داخل Pipeline.`),
      code(`# TODO: baseline, preprocessor, and first honest model\n`),
      md(`## C3: التقييم والتحسين\n\nقارن نموذجين على الطيات نفسها. حلل الأخطاء على شريحتين مهمتين، ثم نفّذ تحسينًا واحدًا له سبب واضح.`),
      code(`# TODO: one comparison table with mean and standard deviation\n`),
      code(`# TODO: slice-based error analysis and one justified improvement\n`),
      md(`## C4: الاختبار النهائي وبطاقة النموذج\n\nجمّد كل القرارات، ثم افتح test مرة واحدة. انقل النتائج والحدود إلى templates/MODEL_CARD.md.`),
      code(`# TODO: final test evaluation exactly once\n`),
      md(`## C5: قصة العرض والتقييم\n\n1. مصدر البيانات والمشكلة والقرار في 60 ثانية.\n2. خط الأساس والنتيجة تحت CV.\n3. أهم خطأ أو شريحة ضعيفة.\n4. التحسين الذي نفذته.\n5. متى يستخدم النموذج ومتى لا يستخدم.\n6. أسئلة المقيمين.`),
    ],
    solution: `# لا يوجد حل واحد للمشروع الختامي. راجع Rubric في course/capstone.md.\n`,
  },
];

for (const lab of labs) {
  fs.writeFileSync(path.join(studentDir, lab.file), JSON.stringify(notebook(lab.cells), null, 1));
  let solutionInserted = false;
  const solutionCells = lab.cells.map((cell) => {
    if (cell.cell_type !== "code") return cell;
    const source = cell.source.join("");
    if (!source.includes("TODO")) return cell;
    if (solutionInserted) return code("# أُنجزت خطوات هذا القسم في خلية الحل السابقة.\n");
    solutionInserted = true;
    return code(lab.solution);
  });
  fs.writeFileSync(path.join(solutionDir, lab.file.replace(".ipynb", "_solution.ipynb")), JSON.stringify(notebook(solutionCells), null, 1));
}

console.log(`Generated ${labs.length} student notebooks and ${labs.length} solutions.`);
