# مواصفات المختبرات اليومية باستخدام حزمة بيانات «منافذ»

**الغرض من هذه الوثيقة:** تحل هذه المواصفات محل أسماء البيانات والأمثلة الافتراضية الواردة في أقسام المختبرات ضمن مخطط السلايدات الموسّع. يستخدم Codex هذا المستند مع مخطط الـ196 شريحة لتنفيذ المختبرات على حزمة البيانات الفعلية التي قدمها المستخدم.

**قاعدة التنفيذ:** ينتهي كل يوم بمختبر إلزامي ينفذه الطالب بنفسه. لا ينتقل الطالب إلى مختبر اليوم التالي قبل حفظ دفتره وإكمال مخرج اليوم الحالي.

## إعداد موحّد للملفات

توضع ملفات الحزمة داخل مجلد واحد باسم `manafeth_data_package`. يستخدم الطلاب ملفات **Parquet** للجدولين الرئيسيين لأن أنواع التواريخ تُحفظ بصورة سليمة. يستخدمون ملف CSV الخاص بالمركبات في مختبر الانحدار لأنه الملف المتاح لهذا السيناريو.

```python
from pathlib import Path

DATA_DIR = Path("manafeth_data_package")
CUSTOMERS_PATH = DATA_DIR / "manafeth_customers.parquet"
ORDERS_PATH = DATA_DIR / "manafeth_orders.parquet"
VEHICLES_PATH = DATA_DIR / "markabat_listings_sample.csv"
SHIFTED_PATH = DATA_DIR / "shifted_month.parquet"
```

| اليوم | الملف أو الملفات | مهمة المختبر | مخرج إلزامي | الزمن المقترح |
|---:|---|---|---|---:|
| 1 | `manafeth_customers.parquet` | كشف التسريب وصياغة مسألة مغادرة العميل | بطاقة مشكلة + قائمة أعمدة آمنة ومستبعدة | 35 دقيقة |
| 2 | `manafeth_customers.parquet` | تجهيز خصائص العملاء في خط معالجة | `preprocessor` يعمل وفحص للنقص | 60 دقيقة |
| 3 | `manafeth_customers.parquet` و`markabat_listings_sample.csv` | تصنيف المغادرة وانحدار سعر مركبة | توقعات فئوية ورقمية مع فحص حالة | 75 دقيقة |
| 4 | `manafeth_customers.parquet` | مقارنة نماذج وتحليل أخطاء | جدول مقارنة، منحنى دقة–استدعاء، وملاحظة خطأ | 90 دقيقة |
| 5 | `manafeth_customers.parquet` و`shifted_month.parquet` | مشروع منافذ متكامل وفحص تغير التشغـيل | دفتر مشروع وعرض قصير وفحص نسبة التنبيهات | 150 دقيقة |

---

# مختبر اليوم الأول — كشف التسريب وصياغة مشكلة مغادرة العملاء

## هدف المختبر

يستكشف الطالب جدول العملاء الفعلي ويحوّل طلب العمل إلى مسألة تصنيف محددة: **هل سيتوقف العميل عن إجراء طلبات مكتملة خلال الثلاثين يومًا التالية لتاريخ اللقطة؟** كما يتعلم قاعدة الوقت التي تمنع إدخال معلومات من المستقبل إلى النموذج.

## السيناريو والبيانات

يحتوي `manafeth_customers.parquet` على **48,000 صف**؛ كل صف يمثل **عميلًا واحدًا عند تاريخ لقطة شهري**. الهدف هو `churned_30d`. القيمة `1` تعني أن العميل لم يجرِ طلبًا مكتملًا في الثلاثين يومًا التالية، والقيمة `0` تعني أنه استمر في الطلب.

| نوع العمود | أعمدة واقعية من الملف | قرار المختبر |
|---|---|---|
| هدف | `churned_30d` | يبقى في `y` فقط |
| معرّف | `customer_id` | يحتفظ به للتتبع والعرض، ويُستبعد من الخصائص |
| خصائص آمنة مبدئيًا | `city`، `city_tier`، `device`، `payment_method`، `tenure_months`، `orders_per_month`، `avg_basket_sar`، `days_since_last_order`، `distinct_categories`، `promo_usage_rate`، `avg_rating`، `last_promo_used` | مرشحة لتدخل `X` بعد الفحص |
| تسريب معلومات | `refund_issued`، `support_ticket_after_snapshot`، `next_month_orders` | تستبعد قطعًا لأنها تحدث بعد اللقطة أو تكشف المستقبل |
| تواريخ | `signup_date`، `snapshot_date` | لا تستخدم في أول مختبر؛ يناقش معناها وتوفرها فقط |

## خطوات التنفيذ بالتسلسل

1. افتح `lab01_manafeth_framing.ipynb` واقرأ جدول العملاء باستخدام `pd.read_parquet`.
2. اعرض أول خمسة صفوف، وأسماء الأعمدة، وأنواعها، وعدد القيم الناقصة.
3. اكتب في خلية نصية: «الصف يمثل …، والهدف هو …، والقرار الذي يساعده النموذج هو …».
4. صنّف الأعمدة في أربع مجموعات: هدف، خصائص آمنة، معرّفات، ومعلومات من المستقبل.
5. اختبر كل عمود مشكوك فيه بالسؤال: «هل كانت هذه القيمة موجودة عند تاريخ اللقطة قبل بدء الثلاثين يومًا التالية؟».
6. أنشئ قائمتي `safe_features` و`leak_columns`، ثم اطبعها أمام المدرب أو زميل المراجعة.

## ما يكتبه أو يشغله الطالب

```python
import pandas as pd

customers = pd.read_parquet(CUSTOMERS_PATH)
customers.head()
customers.info()
customers.isna().sum().sort_values(ascending=False)
customers["churned_30d"].value_counts(normalize=True)

safe_features = [
    "city", "city_tier", "device", "payment_method",
    "tenure_months", "orders_per_month", "avg_basket_sar",
    "days_since_last_order", "distinct_categories", "promo_usage_rate",
    "avg_rating", "last_promo_used"
]

leak_columns = [
    "refund_issued",
    "support_ticket_after_snapshot",
    "next_month_orders"
]
```

## النتيجة المتوقعة

يظهر للطالب أن `avg_rating` و`last_promo_used` يحتويان على قيم ناقصة، وأن فئة المغادرة أقل من فئة الاستمرار. الأهم أن يسجل قرارًا واضحًا باستبعاد الأعمدة الثلاثة المسرّبة، لا أن يكتفي بقول إنها «أعمدة غير مناسبة».

## المهارات التي يراجعها الطالب

يصوغ الطالب مشكلة عمل، ويحدد وحدة التحليل والهدف والخصائص، ويقرأ جدول Parquet في Jupyter، ويفحص أنواع الأعمدة والنقص، ويطبق اختبار الوقت لاكتشاف تسريب البيانات.

## شرط التسليم قبل مغادرة اليوم

يسلم الطالب خلية نصية تحتوي صياغة المشكلة، وجدولًا أو قائمتين يوضحان الخصائص الآمنة والأعمدة المستبعدة مع سبب الاستبعاد. لا يقبل `next_month_orders` كخاصية في أي إجابة.

---

# مختبر اليوم الثاني — تجهيز خصائص عملاء منافذ في خط معالجة

## هدف المختبر

يبني الطالب خط معالجة يعالج النقص والخصائص العددية والفئوية بطريقة قابلة للتكرار، من دون أن يتعلم أي قيمة من بيانات الاختبار.

## السيناريو والبيانات

يستمر الطالب على جدول العملاء نفسه وعلى الخصائص الآمنة التي حددها في اليوم الأول. يستفيد المختبر عمدًا من النقص الواقعي في التقييم المتوسط وآخر عرض ترويجي. لا يحذف الطلاب هذين العمودين؛ الهدف هو تعلم معالجة النقص بصورة منظمة.

| مجموعة الخصائص | الأعمدة | المعالجة المطلوبة | سبب الاختيار |
|---|---|---|---|
| عددية | `tenure_months`، `orders_per_month`، `avg_basket_sar`، `days_since_last_order`، `distinct_categories`، `promo_usage_rate`، `avg_rating` | وسيط ثم تحجيم، مع إضافة مؤشر نقص | تحتوي `avg_rating` على نقص ذي معنى محتمل للعميل الجديد |
| فئوية | `city`، `device`، `payment_method`، `last_promo_used` | تعويض قيمة «غير معروف» ثم ترميز أحادي | الفئة اسم لا مقدار، وغياب آخر عرض قد يحمل معنى |
| ترتيبية | `city_tier` | تعامل كرقم ترتيبي في هذا المختبر | الترتيب بين 1 و2 و3 موجود فعليًا في وصف الحزمة |
| مستبعدة | `customer_id`، `signup_date`، `snapshot_date`، أعمدة التسريب، والهدف | لا تدخل `X` | معرّف أو تاريخ لم نشتق منه خاصية اليوم أو معلومات مستقبلية |

## خطوات التنفيذ بالتسلسل

1. أعد قراءة الملف أو استخدم متغير `customers` من اليوم الأول.
2. عرّف `X` باستخدام `safe_features` وحدها، وعرّف `y` من `churned_30d`.
3. قسم البيانات إلى تدريب واختبار بنسبة 80/20 مع `stratify=y` و`random_state=42`.
4. عرّف قائمة الخصائص العددية وقائمة الخصائص الفئوية.
5. ابنِ مسارًا عدديًا: تعويض بالوسيط، مؤشر نقص، ثم تحجيم.
6. ابنِ مسارًا فئويًا: تعويض بقيمة ثابتة «غير معروف»، ثم ترميز أحادي.
7. اجمع المسارين داخل `ColumnTransformer` باسم `preprocessor`.
8. شغّل `fit_transform` على تدريب صغير فقط للتحقق من أن الخط يعمل، ولا تدرب نموذجًا في هذا اليوم.

## ما يكتبه أو يشغله الطالب

```python
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

X = customers[safe_features]
y = customers["churned_30d"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

numeric_features = [
    "city_tier", "tenure_months", "orders_per_month", "avg_basket_sar",
    "days_since_last_order", "distinct_categories", "promo_usage_rate",
    "avg_rating"
]
categorical_features = [
    "city", "device", "payment_method", "last_promo_used"
]

numeric_pipeline = Pipeline([
    ("fill", SimpleImputer(strategy="median", add_indicator=True)),
    ("scale", StandardScaler())
])

categorical_pipeline = Pipeline([
    ("fill", SimpleImputer(strategy="constant", fill_value="غير_معروف")),
    ("encode", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer([
    ("numbers", numeric_pipeline, numeric_features),
    ("categories", categorical_pipeline, categorical_features)
])

prepared_train = preprocessor.fit_transform(X_train)
prepared_test = preprocessor.transform(X_test)
print(prepared_train.shape, prepared_test.shape)
```

## النتيجة المتوقعة

ينتج متغير `preprocessor` ومصفوفتا خصائص مجهزتان للتدريب والاختبار، مع عدد صفوف يطابق صفوف التدريب والاختبار. قد يزيد عدد الأعمدة بعد الترميز وإضافة مؤشر النقص؛ هذا طبيعي. لا يجب أن يضم أي ناتج عمودًا من `leak_columns`.

## المهارات التي يراجعها الطالب

يفصل الطالب التدريب عن الاختبار، ويعالج القيم الناقصة، ويستخدم مؤشر النقص، ويرمز الفئات، ويحجم الأرقام، ويبني `Pipeline` و`ColumnTransformer` دون معالجة يدوية مختلفة لكل مجموعة بيانات.

## شرط التسليم قبل مغادرة اليوم

يعرض الطالب كتلتي الكود للمسارين وقائمتي الأعمدة. يشرح في جملة واحدة لماذا لا يحسب الوسيط من كامل الجدول قبل التقسيم.

---

# مختبر اليوم الثالث — تصنيف مغادرة العملاء وانحدار سعر المركبة

## هدف المختبر

ينفذ الطالب مهمتين مختلفتين على بيانات الحزمة نفسها: تصنيف مغادرة العميل، وانحدار سعر مركبة مستعملة. الهدف هو تثبيت الفرق بين **الفئة** و**الرقم ذي المقدار** لا تحقيق أفضل أداء ممكن.

## السيناريو والبيانات

يستخدم مسار التصنيف جدول العملاء وهدف `churned_30d`. ويستخدم مسار الانحدار ملف `markabat_listings_sample.csv` الذي يحتوي على 2,000 إعلان لمركبات مستعملة؛ الهدف هو `sale_price_sar`.

| المسار | السؤال | الملف | الهدف | نوع المهمة |
|---|---|---|---|---|
| التصنيف | هل سيغادر العميل خلال 30 يومًا؟ | `manafeth_customers.parquet` | `churned_30d` | تصنيف ثنائي |
| الانحدار | ما سعر البيع التقريبي للمركبة؟ | `markabat_listings_sample.csv` | `sale_price_sar` | انحدار |

## خطوات التنفيذ بالتسلسل

1. أعد استخدام `preprocessor` وخط تقسيم العملاء من اليوم الثاني.
2. أنشئ خط تصنيف يضم `preprocessor` ثم الانحدار اللوجستي.
3. درب النموذج على `X_train` و`y_train`، ثم احفظ الفئات المتوقعة واحتمال المغادرة.
4. افتح ملف المركبات وفحص الأعمدة.
5. استبعد `listing_id` من خصائص المركبة؛ وفي أول نموذج استبعد `listed_month` و`days_on_platform` لأن الهدف التعليمي هو التنبؤ بسعر عند إنشاء الإعلان لا بعد بقائه على المنصة.
6. ابنِ خط معالجة جديدًا للمركبات: أعمدة رقمية وفئوية، ثم انحدار خطي.
7. درب نموذج السعر واطبع أول خمسة أسعار متوقعة بعد التقريب إلى ريالين عشريين.
8. افحص صفًا واحدًا من كل مسار: خصائصه، التوقع، والحقيقة التي نحتفظ بها للتقييم في اليوم الرابع.

## ما يكتبه أو يشغله الطالب

```python
from sklearn.linear_model import LogisticRegression, LinearRegression

churn_classifier = Pipeline([
    ("prepare", preprocessor),
    ("model", LogisticRegression(max_iter=1000))
])
churn_classifier.fit(X_train, y_train)
churn_predictions = churn_classifier.predict(X_test)
churn_probabilities = churn_classifier.predict_proba(X_test)[:, 1]

vehicles = pd.read_csv(VEHICLES_PATH)
vehicle_target = "sale_price_sar"
vehicle_features = [
    "make", "model_year", "mileage_km", "city",
    "condition_grade", "photos_count"
]

X_vehicle = vehicles[vehicle_features]
y_vehicle = vehicles[vehicle_target]
Xv_train, Xv_test, yv_train, yv_test = train_test_split(
    X_vehicle, y_vehicle, test_size=0.20, random_state=42
)

vehicle_numeric = ["model_year", "mileage_km", "photos_count"]
vehicle_categorical = ["make", "city", "condition_grade"]
vehicle_preprocessor = ColumnTransformer([
    ("numbers", Pipeline([
        ("fill", SimpleImputer(strategy="median")),
        ("scale", StandardScaler())
    ]), vehicle_numeric),
    ("categories", Pipeline([
        ("fill", SimpleImputer(strategy="most_frequent")),
        ("encode", OneHotEncoder(handle_unknown="ignore"))
    ]), vehicle_categorical)
])

price_regressor = Pipeline([
    ("prepare", vehicle_preprocessor),
    ("model", LinearRegression())
])
price_regressor.fit(Xv_train, yv_train)
price_predictions = price_regressor.predict(Xv_test)
print(price_predictions[:5].round(2))
```

## النتيجة المتوقعة

يحصل الطالب على قائمة فئات واحتمالات لمغادرة العملاء، وقائمة أسعار رقمية متوقعة للمركبات. لا يعلن أن نموذجًا جيدًا من قراءة خمسة صفوف؛ سيكون قياس الجودة محور اليوم الرابع.

## المهارات التي يراجعها الطالب

يختار الطالب التصنيف أو الانحدار من شكل الهدف، ويضع نموذجًا داخل `Pipeline`، ويستخدم `fit` و`predict` و`predict_proba`، ويتحقق من أن المعرفات وأعمدة المستقبل لا تدخل الخصائص.

## شرط التسليم قبل مغادرة اليوم

يسلم الطالب لقطة ناتج أو خلية طباعة من المسارين، ثم يكتب جملتين: «مخرج التصنيف …» و«مخرج الانحدار …». يجب أن تتضمن الجملتان الفرق بين فئة واحتمال ورقم.

---

# مختبر اليوم الرابع — مقارنة نماذج المغادرة وتحليل الأخطاء

## هدف المختبر

يقارن الطالب نموذجًا مبدئيًا ونماذج شجرية على مشكلة مغادرة العملاء الحقيقية. يتعلم اختيار المقياس الذي يناسب فئة إيجابية أقل ظهورًا، ويحلل صفوف الخطأ بدل الاحتفال برقم واحد.

## السيناريو والبيانات

تبلغ نسبة `churned_30d = 1` في حزمة منافذ نحو 14% تقريبًا؛ لذلك لا تكفي الدقة وحدها. يستخدم المختبر **متوسط الدقة (Average Precision)**، وهو مقياس يلخص منحنى الدقة–الاستدعاء، لمقارنة القدرة على ترتيب العملاء الذين قد يغادرون. يستخدم أيضًا الاستدعاء بين أعلى 20% من العملاء ترتيبًا لأن هذا يناسب سيناريو قائمة متابعة محدودة لفريق خدمة العملاء.

| النموذج | دوره في المختبر | إعداد مبدئي |
|---|---|---|
| الانحدار اللوجستي | خط أساس قابل للتفسير | `max_iter=1000` |
| شجرة القرار | نموذج أسئلة متتابعة بسيط | `max_depth=4` |
| الغابة العشوائية | تجميع أشجار للتصويت | `n_estimators=150` |
| XGBoost | تعزيز متدرج للمقارنة | `n_estimators=100` و`max_depth=3` |

## خطوات التنفيذ بالتسلسل

1. استخدم فقط `X_train` و`y_train` و`preprocessor` من اليومين السابقين في مرحلة المقارنة.
2. ضع كل نموذج داخل `Pipeline` نفسه لضمان المعالجة نفسها.
3. احسب متوسط الدقة بخمس طيات تحقق متقاطع.
4. سجل النتيجة في جدول `results_df` ولا تستخدم بيانات الاختبار لاختيار النموذج.
5. اختر النموذج المرشح بسبب مكتوب: المقياس أولًا، ثم قابلية الفهم أو استقرار النتيجة إن كانت الفروق صغيرة.
6. درب النموذج المختار على كامل التدريب، ثم احسب احتمالات المغادرة على `X_test`.
7. اعرض منحنى الدقة–الاستدعاء، ثم احسب الاستدعاء عندما نتواصل مع أعلى 20% فقط من العملاء.
8. كوّن مصفوفة التباس عند عتبة 0.50 للتدريب على قراءة الأخطاء، ثم استخرج خمسة عملاء أخطأ النموذج فيهم.

## ما يكتبه أو يشغله الطالب

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
from sklearn.metrics import (
    average_precision_score, precision_recall_curve,
    ConfusionMatrixDisplay, recall_score
)
from xgboost import XGBClassifier

models = {
    "انحدار لوجستي": LogisticRegression(max_iter=1000),
    "شجرة قرار": DecisionTreeClassifier(max_depth=4, random_state=42),
    "غابة عشوائية": RandomForestClassifier(n_estimators=150, random_state=42),
    "XGBoost": XGBClassifier(
        n_estimators=100, max_depth=3,
        eval_metric="logloss", random_state=42
    )
}

comparison = []
for name, model in models.items():
    workflow = Pipeline([("prepare", preprocessor), ("model", model)])
    scores = cross_val_score(
        workflow, X_train, y_train,
        cv=5, scoring="average_precision"
    )
    comparison.append([name, scores.mean(), scores.std()])

results_df = pd.DataFrame(
    comparison,
    columns=["النموذج", "متوسط الدقة", "تغير النتيجة بين الطيات"]
).sort_values("متوسط الدقة", ascending=False)
results_df
```

```python
chosen_name = results_df.iloc[0]["النموذج"]
final_workflow = Pipeline([
    ("prepare", preprocessor),
    ("model", models[chosen_name])
])
final_workflow.fit(X_train, y_train)
probabilities = final_workflow.predict_proba(X_test)[:, 1]

ap = average_precision_score(y_test, probabilities)
precision, recall, _ = precision_recall_curve(y_test, probabilities)
plt.plot(recall, precision)
plt.xlabel("الاستدعاء")
plt.ylabel("الإحكام")
plt.title("منحنى الدقة–الاستدعاء")
plt.show()

contact_count = int(len(y_test) * 0.20)
top_customers = pd.DataFrame({
    "الحقيقة": y_test.to_numpy(),
    "احتمال_المغادرة": probabilities
}).sort_values("احتمال_المغادرة", ascending=False).head(contact_count)
recall_at_20 = top_customers["الحقيقة"].sum() / y_test.sum()
print("متوسط الدقة على الاختبار:", round(ap, 3))
print("الاستدعاء بين أعلى 20%:", round(recall_at_20, 3))
```

## النتيجة المتوقعة

ينتج جدول مقارنة لأربعة نماذج، ومنحنى دقة–استدعاء، وقيمة متوسط دقة، واستدعاء في قائمة أعلى 20%. لا تضع في السلايدات رقمًا ثابتًا للأداء؛ قد تختلف النتائج بحسب الإصدار والإعدادات. النتيجة الصحيحة هي أن يبرر الطالب الاختيار ببيانات التدريب وأن يشرح أين تظهر حالات التفويت في مصفوفة الالتباس.

## المهارات التي يراجعها الطالب

يختار الطالب مقياسًا يناسب عدم توازن الفئات، ويستخدم التحقق المتقاطع، ويقارن خطوط معالجة متكافئة، ويقرأ منحنى الدقة–الاستدعاء ومصفوفة الالتباس، ويحلل أخطاء فعلية، ويستخدم شجرة القرار والغابة العشوائية وXGBoost بصورة مدروسة.

## شرط التسليم قبل مغادرة اليوم

يسلم الطالب جدولًا بأسماء النماذج ومتوسط دقتها، ومخططًا واحدًا، وجملة تتضمن سبب اختيار النموذج، وجملة عن خطأ متكرر أو حالة تحتاج متابعة.

---

# مختبر اليوم الخامس — مشروع منافذ المتكامل وفحص تغير التشغيل

## هدف المختبر

ينجز الطالب مشروع تعلم آلة بسيطًا من البداية إلى النهاية باستخدام بيانات منافذ الفعلية، ثم يجري فحصًا تشغيليًا أوليًا على شهر لاحق. يجمع المشروع صياغة المشكلة، تجهيز البيانات، المقارنة، التقييم، تحليل الأخطاء، والتواصل المسؤول.

## السيناريو والبيانات

يبني الطالب نموذجًا يرتب العملاء الذين يحتمل أن يغادروا خلال 30 يومًا من تاريخ لقطة شهرية. يستخدم `manafeth_customers.parquet` لتطوير النموذج وتقييمه التاريخي. بعد تثبيت النموذج، يستخدم `shifted_month.parquet` وهو جدول من شهر لاحق **من دون هدف معروف في المختبر**؛ لذلك لا يدعي الطالب قياس أداء عليه، بل يقارن فقط نسبة العملاء الذين سيتجاوزون عتبة الاتصال نفسها.

> لا تدخل أي من الأعمدة `refund_issued` أو `support_ticket_after_snapshot` أو `next_month_orders` في المشروع. لا يحتوي ملف الشهر اللاحق على الهدف، ولذلك لا يجوز كتابة دقة أو استدعاء له.

## مراحل التنفيذ بالتسلسل

### المرحلة الأولى: بطاقة المشروع والاستكشاف

1. اكتب بطاقة المشكلة: السؤال، وحدة التنبؤ، الهدف، قرار المتابعة، والخصائص المتاحة عند تاريخ اللقطة.
2. افتح جدول العملاء وافحص الحجم والأنواع والنقص وتوازن الهدف.
3. أنشئ جدول قرار يوضح الأعمدة الآمنة، المعرفات، والتسريب.
4. ارسم مخطط أعمدة لتوزيع `churned_30d` بعنوان ومحاور عربية.

### المرحلة الثانية: التجهيز والمقارنة

5. أنشئ `X` و`y` وقسم البيانات إلى تدريب واختبار بنسبة 80/20 مع الحفاظ على توزيع الهدف.
6. ابنِ `preprocessor` نفسه، بما في ذلك مؤشر النقص للأعمدة العددية.
7. قارن الانحدار اللوجستي والغابة العشوائية وXGBoost بالتحقق المتقاطع وبمقياس متوسط الدقة.
8. اختر نموذجًا ودوّن سبب الاختيار قبل فتح بيانات الاختبار.

### المرحلة الثالثة: التقييم والتفسير

9. درب النموذج المختار على كامل بيانات التدريب.
10. احسب احتمال المغادرة لكل عميل اختبار، ومتوسط الدقة، ومنحنى الدقة–الاستدعاء، والاستدعاء بين أعلى 20% من العملاء.
11. اعرض مصفوفة الالتباس عند عتبة 0.50 للتدريب على قراءة الأخطاء.
12. راجع خمسة صفوف أخطأ النموذج في تصنيفها واكتب ملاحظة تستند إلى البيانات فقط.

### المرحلة الرابعة: فحص تغير التشغيل في شهر لاحق

13. افتح `shifted_month.parquet`، واختر منه **الأعمدة الآمنة نفسها وبالترتيب نفسه**.
14. طبق النموذج للحصول على احتمالات من دون تقييم دقة؛ لا توجد حقيقة هدف في هذا الملف.
15. حدد عتبة الاتصال من بيانات الاختبار: العتبة التي تفصل أعلى 20% من احتمالات الاختبار.
16. احسب نسبة عملاء الشهر اللاحق الذين يتجاوزون هذه العتبة، وقارنها بنسبة 20% الأصلية.
17. اكتب تنبيهًا تشغيليًا إن تغيرت النسبة: «تغيرت نسبة التنبيهات، لذا يجب مراجعة القدرة التشغيلية وقياس النتائج الفعلية عند توفرها».

## ما يكتبه أو يشغله الطالب

```python
import numpy as np

# عتبة تُختار من بيانات الاختبار لتحديد أعلى 20% من العملاء بالترتيب
contact_threshold = np.quantile(probabilities, 0.80)

shifted = pd.read_parquet(SHIFTED_PATH)
X_shifted = shifted[safe_features]
shifted_probabilities = final_workflow.predict_proba(X_shifted)[:, 1]
shifted_contact_rate = (shifted_probabilities >= contact_threshold).mean()

print("عتبة الاتصال:", round(contact_threshold, 3))
print("نسبة العملاء المتجاوزين للعتبة في الشهر اللاحق:", round(shifted_contact_rate, 3))
```

```python
# مراجعة أخطاء الاختبار فقط؛ لا نستخدم هذا الكود على الشهر اللاحق لأنه بلا هدف.
review = X_test.copy()
review["الحقيقة"] = y_test.to_numpy()
review["احتمال_المغادرة"] = probabilities
review["التوقع_عند_0_50"] = (probabilities >= 0.50).astype(int)
errors = review[review["الحقيقة"] != review["التوقع_عند_0_50"]]
errors.head()
```

## النتيجة المتوقعة

ينتج دفتر مشروع منظم يحتوي على تعريف المشكلة، فحص البيانات، خط معالجة، مقارنة نماذج، جدول نتائج، رسم واحد على الأقل، منحنى دقة–استدعاء، مصفوفة التباس، تحليل أخطاء، وفحص لتغير نسبة التنبيهات في الشهر اللاحق. قد تتغير نسبة التنبيهات في الشهر اللاحق، وهذه ليست «دقة» أو «فشلًا» للنموذج؛ هي إشارة تشغيلية تحتاج قياس النتائج الفعلية لاحقًا.

## المهارات التي يراجعها الطالب

يراجع الطالب سير عمل تعلم الآلة كاملًا: صياغة المشكلة، منع التسريب، pandas وJupyter، المعالجة المسبقة، التصنيف، التحقق المتقاطع، اختيار مقياس مناسب، Matplotlib، XGBoost، تحليل الأخطاء، وتقديم نتيجة مسؤولة.

## شكل التسليم والعرض

يسلم كل فريق دفتر `final_project_manafeth_churn.ipynb` ويعرض خلال دقيقة ونصف:

1. المشكلة والهدف وسبب نوع التصنيف.
2. الخصائص الآمنة والأعمدة التي استبعدها ولماذا.
3. طريقة التجهيز والمقارنة.
4. النموذج المختار والمقياس المستخدم.
5. مصفوفة الالتباس أو منحنى الدقة–الاستدعاء.
6. ملاحظة واحدة من الأخطاء، وملاحظة واحدة عن تغير نسبة التنبيهات في الشهر اللاحق.

## قائمة تحقق المدرب

| بند المراجعة | تحقق |
|---|---|
| استُخدم `manafeth_customers.parquet` للمختبرات الأساسية | ☐ |
| استُبعدت الأعمدة المسرّبة الثلاثة من كل `X` | ☐ |
| بُنيت المعالجة داخل `Pipeline` و`ColumnTransformer` | ☐ |
| قورنت النماذج على التدريب فقط بالتحقق المتقاطع | ☐ |
| قُيّم الاختبار مرة واحدة بعد الاختيار | ☐ |
| لم تُنسب دقة أو استدعاء إلى `shifted_month.parquet` | ☐ |
| احتوى التسليم على تحليل صفوف خطأ فعلية وخلاصة لا تبالغ | ☐ |

## المراجع

[1]: /home/ubuntu/course_data_package/manafeth_data_package/data_dictionary.md "Manafeth Data Dictionary — SDA-AIE-111"
[2]: /home/ubuntu/course_data_package/manafeth_data_package/validation_report.txt "Manafeth Data Validation Report"
