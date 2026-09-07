import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const templatePath = path.join(root, "slides", "template", "template.html");
const revealTemplatePath = path.join(root, "slides", "template", "reveal_reference.html");
const outDir = path.join(root, "docs", "slides");
fs.mkdirSync(outDir, { recursive: true });

let head = fs.readFileSync(templatePath, "utf8").split("<body>")[0];
head = head
  .replaceAll("ai-education-assets/", "assets/ai-education-assets/")
  .replaceAll("sdaia-icons/", "assets/sdaia-icons/")
  .replace("</head>", `<style>
.content-body{position:absolute;right:8vw;left:8vw;top:21vh;bottom:12vh;font-size:clamp(20px,2vw,30px);line-height:1.35}
.two{display:grid;grid-template-columns:1fr 1fr;gap:28px;height:100%}.box{background:#fff;border:1.5px solid #d9ddea;border-radius:16px;padding:25px 28px}.box h3{color:var(--navy);font-size:29px;margin:0 0 13px}.box p,.box li{font-size:23px;line-height:1.3}.box ul{margin:8px 0}.codebox{direction:ltr;text-align:left;background:#11182f;color:#eef5ff;border-radius:15px;padding:24px;font:20px/1.5 monospace;white-space:pre-wrap}.question{background:#273370;color:white;border-radius:22px;padding:35px 45px;text-align:center;font-size:clamp(28px,3.2vw,48px);margin-top:7vh}.answer{margin-top:22px;color:#29ba74;font-weight:600}.lab-hero{display:grid;grid-template-columns:.8fr 1.2fr;gap:32px;align-items:center}.lab-num{font:700 clamp(70px,10vw,150px) Arial;color:#29ba74;text-align:center}.checklist{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.check{border-right:6px solid #29ba74;background:#fff;padding:17px 20px;border-radius:8px;font-size:22px}.flow{display:flex;gap:10px;align-items:stretch;direction:rtl}.flow>div{flex:1;background:#fff;border:2px solid #273370;border-radius:14px;padding:22px 12px;text-align:center;font-size:22px;position:relative}.flow>div:not(:last-child):after{content:'←';position:absolute;left:-20px;top:38%;color:#29ba74;font:bold 28px Arial}.metric{font:700 clamp(46px,6vw,86px) Arial;color:#273370}.muted2{color:#6f7482}.mini-table{width:100%;border-collapse:collapse;background:#fff}.mini-table th{background:#273370;color:#fff}.mini-table th,.mini-table td{padding:12px 15px;border:1px solid #d9ddea;text-align:center;font-size:20px}.warning{border-right:8px solid #fcbd4c;background:#fff9e8;padding:20px 25px;border-radius:12px}.footerline{position:absolute;right:8vw;bottom:4vh;color:#8a8a8a;font:14px Arial}.chapter-tag{color:#29ba74;font-weight:600}.closing-note{position:absolute;right:11vw;bottom:18vh;color:#fffbd0;font-size:28px;z-index:4}
</style><style>
/* Reveal/SDAIA-like visual language used by the reference course */
.reference-cover{background:#fff!important}.reference-cover .first-bg-frame{display:none}.reference-cover:before,.reference-cover:after{display:none!important}.reference-cover .first-bg-title{color:#1C355E!important;text-shadow:none!important;font-size:clamp(48px,6vw,82px)!important}.reference-cover .closing-note{color:#101820!important;right:0!important;left:0!important;text-align:center!important;bottom:32vh!important;font-size:clamp(20px,2.1vw,31px)!important}.reference-cover:after{content:'›';display:block!important;position:absolute!important;right:4vw!important;left:auto!important;top:45%!important;color:#00AE8D!important;font:70px Arial!important;border:0!important}.content{background:#fff!important}.content .title-zone{top:5vh!important;right:8vw!important;height:auto!important;border-bottom:3px solid rgba(0,174,141,.3);padding-bottom:12px}.content .content-device{display:none}.content .academy-mark{width:95px;height:62px;left:1.5vw;bottom:1.5vh}.content-body{top:18vh!important;bottom:10vh!important}.controls{display:flex!important;right:auto!important;left:18px!important;transform:none!important;background:transparent!important}.controls button{color:#00AE8D!important;font-size:36px!important}.counter{display:block!important;left:18px!important;bottom:60px!important}.closing-note{z-index:4}
</style></head>`);

const esc = (s) => s;
const cover = (title, subtitle) => `<section id="title-slide" data-background-image="slides_template/slides_template/assets/anim.svg" data-background-opacity="0.42" data-background-size="cover" class="quarto-title-block center"><h1 class="title">${title}</h1><p class="subtitle lead">${subtitle}</p></section>`;
const content = (title, body, klass="") => `<section class="slide level2 ${klass}"><h2>${title}</h2><div class="course-body">${body}</div></section>`;
const section = (title, subtitle="") => `<section class="title-slide slide level1 sdaia-dark center" data-background-gradient="linear-gradient(135deg, #1C355E, #00C9A7)"><h1>${title}</h1><p>${subtitle}</p></section>`;
const close = (note) => `<section class="title-slide slide level1 sdaia-dark center" data-background-gradient="linear-gradient(135deg, #1C355E, #00C9A7)" data-state="sdaia-bg"><h1>نلتقي في اللاب</h1><p>${note}</p></section>`;
const bullets = (items) => `<ul>${items.map(x=>`<li>${x}</li>`).join("")}</ul>`;
const two = (aTitle,a,bTitle,b) => `<div class="two"><div class="box"><h3>${aTitle}</h3>${a}</div><div class="box"><h3>${bTitle}</h3>${b}</div></div>`;
const question = (q,a) => `<div class="question">${q}<div class="answer">${a}</div></div>`;
const lab = (n,title,tasks) => `<div class="lab-hero"><div class="lab-num">LAB ${n}</div><div><h3 style="font-size:38px;color:#273370">${title}</h3><div class="checklist">${tasks.map(t=>`<div class="check">${t}</div>`).join("")}</div></div></div>`;

const decks = [
{
 file:"chapter-1.html", title:"اليوم الأول: مقدمة في الذكاء الاصطناعي وتعلم الآلة", sub:"AI وMachine Learning وDeep Learning وGenerative AI", slides:[
  content("رحلة اليوم الأول", `<div class="flow"><div>سؤال العمل</div><div>نوع المهمة</div><div>صف البيانات والهدف</div><div>Train / Test</div><div>خط الأساس</div></div><p class="warning" style="margin-top:35px">قبل أن نختار أي خوارزمية، نحدد القرار الذي سيتغير بسبب التنبؤ.</p>`),
  content("متى نستخدم تعلم الآلة؟", two("مناسب",bullets(["توجد أمثلة سابقة يمكن التعلم منها","القواعد كثيرة أو تتغير مع الوقت","يمكن قياس الخطأ بوضوح"]),"غير مناسب",bullets(["قاعدة ثابتة وبسيطة تكفي","لا توجد بيانات تمثل السؤال","الخطأ غير مسموح ولا توجد مراجعة بشرية"]))),
  content("ثلاثة أنواع من المسائل", `<div class="pillars"><div class="panel pillar"><span class="badge">١</span><h3>Regression</h3><p>نتوقع رقمًا مثل قيمة السلة بالريال.</p></div><div class="panel pillar"><span class="badge">٢</span><h3>Classification</h3><p>نتوقع فئة أو احتمالًا مثل احتمال التوقف.</p></div><div class="panel pillar"><span class="badge">٣</span><h3>Clustering</h3><p>نبحث عن مجموعات متشابهة دون هدف جاهز.</p></div></div>`),
  content("قصة منافذ", two("سؤال العمل",`<p>فريق الاحتفاظ يستطيع التواصل مع 20% من العملاء فقط. من نضع في أعلى القائمة؟</p><p class="metric">14%</p><p>نسبة العملاء الذين توقفوا خلال 30 يومًا في البيانات.</p>`,"صياغة تعلم الآلة",`<p><b>صف واحد:</b> عميل عند تاريخ اللقطة</p><p><b>الهدف:</b> churned_30d</p><p><b>المخرج:</b> احتمال بين 0 و1</p><p><b>القرار:</b> ترتيب قائمة التواصل</p>`)),
  content("ميزة أم تسرب؟", `<table class="mini-table"><tr><th>العمود</th><th>متوفر لحظة التنبؤ؟</th><th>نستخدمه؟</th></tr><tr><td>days_since_last_order</td><td>نعم</td><td>نعم</td></tr><tr><td>next_month_orders</td><td>لا</td><td>لا</td></tr><tr><td>support_ticket_after_snapshot</td><td>لا</td><td>لا</td></tr></table>${question("النتيجة ارتفعت إلى 0.99 بعد إضافة بيانات الشهر التالي. هل تحسن النموذج؟","لا. النموذج رأى المستقبل.")}`),
  content("لماذا نقسم البيانات؟", `<div class="flow"><div><b>Train</b><br>يتعلم النموذج</div><div><b>Validation / CV</b><br>نقارن ونختار</div><div><b>Test</b><br>اختبار نهائي مرة واحدة</div></div><p class="warning" style="margin-top:35px">إذا أثّر test في اختيارنا، لم يعد اختبارًا محايدًا.</p>`),
  content("خط الأساس هو الحد الأدنى", two("Classification",`<p>Dummy يتوقع حسب نسبة الفئة. في منافذ:</p><p class="metric">PR-AUC ≈ 0.14</p>`,"Regression",`<p>Dummy يتوقع الوسيط لكل العملاء:</p><p class="metric">MAE ≈ 33 SAR</p>`)),
  content("الانحدار الخطي ببساطة", `<div class="statement"><div class="quote">يبحث النموذج عن أوزان تجعل الفرق بين <em>القيمة الحقيقية والمتوقعة</em> أصغر.</div><div class="side"><div class="panel"><strong>MAE</strong>متوسط الخطأ بوحدة مفهومة: ريال.</div><div class="panel"><strong>Residual</strong>الحقيقي ناقص المتوقع. يرينا نمط الخطأ.</div></div></div>`),
  content("قراءة النتيجة", `<div class="codebox">baseline_mae = 33.26\nlinear_mae   = 32.25</div>${question("هل النموذج الخطي ممتاز؟","لا. تفوق قليلًا فقط، وهذا دليل مفيد لا نهاية العمل.")}`),
  content("تحدي دقيقتين", question("نريد توقع عدد الطلبات الشهر القادم. Regression أم Classification؟ وما صف البيانات؟","Regression. صف واحد لكل عميل عند تاريخ محدد.")),
  section("الانتقال إلى التطبيق","سنثبت قرارات اليوم بالكود بدل حفظ المصطلحات"),
  content("المعملان", lab("1A","التأطير والتقسيم وخط الأساس",["فحص البيانات","كشف أعمدة المستقبل","تقسيم stratified","Dummy PR-AUC"])),
  content("المعملان", lab("1B","توقع قيمة السلة",["Dummy MAE","Linear Regression","Residual Plot","تفسير بالريال"])),
 ]
},
{
 file:"chapter-2.html", title:"اليوم الثاني: التصنيف وبناء Pipeline", sub:"الاحتمالات، فرط التعلّم، وتجهيز البيانات الصحيح", slides:[
  content("رحلة اليوم الثاني", `<div class="flow"><div>Probability</div><div>Threshold</div><div>Logistic Regression</div><div>Decision Tree</div><div>Pipeline</div></div>`),
  content("النموذج يعيد احتمالًا", two("احتمال 0.82",`<p>يعني أن الحالة تشبه حالات التوقف في بيانات التدريب بدرجة عالية.</p><p>لا يعني ضمانًا بنسبة 82% لشخص بعينه.</p>`,"العتبة",`<p>عند 0.50 قد نصنّف العميل كمتوقف.</p><p>لكن فريق العمل يحدد العتبة حسب الميزانية وتكلفة الخطأ.</p>`)),
  content("مصفوفة الالتباس", `<table class="mini-table"><tr><th></th><th>توقف فعليًا</th><th>لم يتوقف</th></tr><tr><th>اخترناه</th><td>True Positive</td><td>False Positive</td></tr><tr><th>لم نختره</th><td>False Negative</td><td>True Negative</td></tr></table><p class="warning">في حملة الاحتفاظ، False Negative يعني أننا لم نتواصل مع عميل كان معرضًا للتوقف.</p>`),
  content("Logistic Regression", `<div class="statement"><div class="quote">نموذج بسيط يحوّل مجموعًا موزونًا للميزات إلى <em>احتمال بين 0 و1</em>.</div><div class="side"><div class="panel"><strong>الميزة</strong>سريع وسهل المقارنة والتفسير.</div><div class="panel"><strong>الحد</strong>لا يلتقط العلاقات المعقدة تلقائيًا.</div></div></div>`),
  content("Decision Tree", two("كيف تفكر؟",`<p>تسأل سلسلة أسئلة مثل:</p><div class="codebox">days_since_last_order &gt; 18?\norders_per_month &lt; 1.5?</div>`,"لماذا نضبط العمق؟",`<p>شجرة صغيرة قد تفوّت نمطًا.</p><p>شجرة عميقة تحفظ التدريب وتفشل على بيانات جديدة.</p>`)),
  content("فرط التعلّم", `<table class="mini-table"><tr><th>عمق الشجرة</th><th>Train PR-AUC</th><th>Validation PR-AUC</th></tr><tr><td>3</td><td>0.45</td><td>0.43</td></tr><tr><td>7</td><td>0.62</td><td>0.50</td></tr><tr><td>20</td><td>0.99</td><td>0.43</td></tr></table>${question("أي عمق نختار؟","القريب من أفضل validation، وليس أعلى train.")}`),
  section("البيانات الخام لا تدخل النموذج كما هي","لكل نوع عمود معاملة تناسبه"),
  content("القيم المفقودة", two("avg_rating",`<p>31% مفقود، وغالبًا لدى العملاء الجدد.</p><p>نستخدم median مع missing indicator لأن الغياب نفسه يحمل معلومة.</p>`,"last_promo_used",`<p>القيمة المفقودة تعني غالبًا «لم يستخدم عرضًا».</p><p>نعالجها كفئة مفهومة أو most frequent حسب السؤال.</p>`)),
  content("Scaling وEncoding", `<div class="flow"><div>Numeric<br>Impute</div><div>Scale</div><div>Categorical<br>Impute</div><div>One-Hot</div><div>Model</div></div><p class="warning" style="margin-top:35px">الأشجار لا تحتاج scaling، لكن Logistic Regression وKNN تستفيدان منه.</p>`),
  content("لماذا Pipeline؟", two("خلايا متفرقة",bullets(["قد ننسى خطوة عند التنبؤ","قد ندرّب scaler على test","يصعب حفظ الوصفة كاملة"]),"كائن واحد",bullets(["fit على train فقط","يعيد الخطوات نفسها عند inference","يمكن حفظه واختباره ومراجعته"]))),
  content("Pipeline في scikit-learn", `<div class="codebox">pipe = Pipeline([\n  ("prep", build_preprocessor()),\n  ("model", LogisticRegression())\n])\npipe.fit(X_train, y_train)</div>`),
  content("اختبار سريع للتسرب", question("خلطنا y عشوائيًا وبقي PR-AUC = 0.70. ماذا نستنتج؟","يوجد تسرب أو خطأ في بروتوكول التقييم. المفترض أن تهبط النتيجة قرب 0.14.")),
  content("المعملان", lab("2A","التصنيف وفرط التعلّم",["احتمالات Logistic","PR-AUC","تجربة عمق الشجرة","اختيار من validation"])),
  content("المعملان", lab("2B","Pipeline وصيد التسرب",["ColumnTransformer","Missing indicator","Unknown categories","Shuffled-label test"])),
 ]
},
{
 file:"chapter-3.html", title:"اليوم الثالث: تقييم النموذج وتحسينه", sub:"مقاييس صحيحة، Cross-Validation، وتحليل الأخطاء", slides:[
  content("رحلة اليوم الثالث", `<div class="flow"><div>Metric</div><div>Cross-Validation</div><div>Threshold</div><div>Error Slices</div><div>Ensembles</div></div>`),
  content("لماذا Accuracy تضللنا؟", `<div class="statement"><div class="quote">إذا توقّعنا «لن يتوقف» للجميع، نحصل على <em>86% Accuracy</em> دون اكتشاف أي متوقف.</div><div class="side"><div class="panel"><strong>Precision</strong>من الذين اخترناهم، كم واحدًا توقف فعلًا؟</div><div class="panel"><strong>Recall</strong>من المتوقفين، كم واحدًا اكتشفنا؟</div></div></div>`),
  content("PR-AUC للمقارنة", two("ماذا يقيس؟",`<p>قدرة النموذج على ترتيب الحالات الإيجابية عبر عتبات مختلفة.</p><p>مفيد عندما تكون الفئة الإيجابية قليلة.</p>`,"كيف نقرأه؟",`<p>خط الأساس قريب من prevalence = 0.14.</p><p>نموذج 0.50 أفضل بوضوح، لكنه بعيد عن الكمال.</p>`)),
  content("Cross-Validation", `<div class="flow"><div>Fold 1<br>Validate</div><div>Fold 2<br>Validate</div><div>Fold 3<br>Validate</div><div>Fold 4<br>Validate</div><div>Fold 5<br>Validate</div></div><p style="margin-top:32px">نقارن كل النماذج على الطيات نفسها، ثم نعرض المتوسط والتباين.</p>`),
  content("نتيجة قابلة للدفاع", `<div class="kpi"><div class="kpi-head"><div>النموذج</div><div>PR-AUC</div><div>المعنى</div></div><div class="kpi-row"><div class="kpi-cell">Dummy</div><div class="kpi-cell num">0.14</div><div class="kpi-cell">لا يتعلم نمطًا</div></div><div class="kpi-row"><div class="kpi-cell">Logistic</div><div class="kpi-cell lav num">0.49 ± 0.01</div><div class="kpi-cell">تحسن ثابت عبر الطيات</div></div></div>`),
  content("العتبة قرار عمل", `<div class="statement"><div class="quote">الفريق يستطيع التواصل مع <em>20%</em> فقط. نرتب الاحتمالات ونختار أعلى 20%.</div><div class="side"><div class="panel"><strong>Precision</strong>جودة قائمة التواصل.</div><div class="panel"><strong>Recall</strong>كم متوقفًا تغطي الميزانية.</div></div></div>`),
  content("تحليل الشرائح", `<table class="mini-table"><tr><th>الشريحة</th><th>Recall</th><th>ماذا نسأل؟</th></tr><tr><td>عملاء جدد</td><td>أضعف</td><td>هل تاريخهم القصير لا يكفي؟</td></tr><tr><td>عملاء قدامى</td><td>أفضل</td><td>هل لدينا سلوك أكثر؟</td></tr><tr><td>حسب المدينة</td><td>متفاوت</td><td>هل البيانات أو السلوك مختلف؟</td></tr></table>`),
  section("من شجرة واحدة إلى غابة","نجمع نماذج كثيرة لتقليل حساسية القرار لعينة واحدة"),
  content("Random Forest", two("الفكرة",`<p>ندرب أشجارًا كثيرة على عينات وميزات مختلفة، ثم نأخذ متوسط الاحتمالات.</p>`,"الإعدادات المهمة",bullets(["n_estimators: عدد الأشجار","max_depth: تعقيد كل شجرة","min_samples_leaf: أقل حجم للورقة"]))),
  content("Gradient Boosting", `<div class="statement"><div class="quote">كل شجرة جديدة تركز على الأخطاء التي تركتها الأشجار السابقة.</div><div class="side"><div class="panel"><strong>قوة</strong>أداء ممتاز على البيانات الجدولية.</div><div class="panel"><strong>حذر</strong>يحتاج ضبطًا ومراقبة لفرط التعلم.</div></div></div>`),
  content("Permutation Importance", `<div class="codebox">1. احسب نتيجة validation\n2. اخلط عمودًا واحدًا\n3. أعد الحساب\n4. مقدار الهبوط = أهمية العمود</div><p class="warning">الأهمية لا تثبت السببية. هي تصف اعتماد النموذج على العمود.</p>`),
  content("Champion وChallenger", question("Random Forest أفضل بـ0.01 لكنه أبطأ عشر مرات. هل يفوز تلقائيًا؟","لا. نزن التحسن والثبات والسرعة وقابلية التفسير معًا.")),
  content("المعملان", lab("3A","التقييم وعتبة الميزانية",["CV موحد","PR-AUC","Recall@20%","Slice analysis"])),
  content("المعملان", lab("3B","النماذج التجميعية",["Random Forest","مقارنة عادلة","Permutation importance","Champion table"])),
 ]
},
{
 file:"chapter-4.html", title:"اليوم الرابع: اكتشاف الأنماط واختيار النموذج", sub:"Clustering، PCA، وضبط المعلمات دون لمس الاختبار", slides:[
  content("رحلة اليوم الرابع", `<div class="flow"><div>Scaling</div><div>K-Means</div><div>اختيار k</div><div>PCA</div><div>Tuning</div></div>`),
  content("عندما لا يوجد Target", two("Supervised",`<p>لدينا إجابة تاريخية مثل churned_30d ويتعلم النموذج توقعها.</p>`,"Unsupervised",`<p>لا توجد إجابة جاهزة. نبحث عن بنية مفيدة مثل شرائح العملاء.</p>`)),
  content("K-Means بصورة مبسطة", `<div class="flow"><div>اختر k مراكز</div><div>اربط كل صف بالأقرب</div><div>حرّك المركز إلى المتوسط</div><div>كرر حتى الاستقرار</div></div>`),
  content("لماذا Scaling ضروري؟", question("avg_basket_sar يصل إلى 500، وpromo_usage_rate بين 0 و1. ماذا يحدث دون scaling؟","المسافة يسيطر عليها الريال، وقد يتجاهل النموذج بقية السلوك.")),
  content("اختيار عدد المجموعات", `<div class="pillars"><div class="panel pillar"><span class="badge">١</span><h3>Silhouette</h3><p>هل الصف قريب من مجموعته وبعيد عن غيرها؟</p></div><div class="panel pillar"><span class="badge">٢</span><h3>Elbow</h3><p>متى يتباطأ تحسن تماسك المجموعات؟</p></div><div class="panel pillar"><span class="badge">٣</span><h3>Usefulness</h3><p>هل نستطيع تسمية الشرائح والتصرف بناء عليها؟</p></div></div>`),
  content("الملف التعريفي أهم من اللون", `<table class="mini-table"><tr><th>الشريحة</th><th>Orders/month</th><th>Recency</th><th>اسم عملي</th></tr><tr><td>0</td><td>مرتفع</td><td>منخفض</td><td>عملاء متكررون</td></tr><tr><td>1</td><td>منخفض</td><td>مرتفع</td><td>عملاء يتباعد نشاطهم</td></tr><tr><td>2</td><td>موسمي</td><td>متوسط</td><td>متسوقو المواسم</td></tr></table>`),
  content("PCA: خريطة وليست الحقيقة", two("ماذا تفعل؟",`<p>تضغط عدة أعمدة إلى اتجاهين يحتفظان بأكبر قدر من التباين.</p>`,"ما الذي نخسره؟",`<p>الخريطة ثنائية الأبعاد تخفي جزءًا من المعلومات. نذكر explained variance.</p>`)),
  content("K-Means دائمًا يعطي مجموعات", `<div class="statement"><div class="quote">حتى الضوضاء يمكن تقسيمها إلى <em>k مجموعات جميلة</em>.</div><div class="side"><div class="panel"><strong>الاختبار</strong>قارن silhouette الحقيقي بضوضاء مشابهة.</div><div class="panel"><strong>الدليل</strong>افحص الثبات والفائدة الخارجية.</div></div></div>`),
  section("الضبط ليس سحرًا","نبحث داخل ميزانية محددة وبروتوكول تقييم ثابت"),
  content("Parameters وHyperparameters", two("Parameters",`<p>يتعلمها النموذج من البيانات، مثل معاملات Logistic Regression.</p>`,"Hyperparameters",`<p>نحدد مجالها قبل التدريب، مثل max_depth وعدد الأشجار.</p>`)),
  content("Random Search", `<div class="codebox">RandomizedSearchCV(\n  pipeline,\n  param_distributions=space,\n  n_iter=12,\n  scoring="average_precision",\n  cv=3\n)</div><p class="warning">نضبط Pipeline كاملًا داخل CV، لا نموذجًا فوق بيانات مجهزة مسبقًا.</p>`),
  content("متى نتوقف؟", bullets(["أفضل الإعدادات متقاربة والنتيجة مستقرة","التحسن أصغر من تباين CV","وقت التدريب لا يبرر التحسن","وصلنا إلى متطلبات القرار"])),
  content("فتح Test مرة واحدة", `<div class="flow"><div>Freeze features</div><div>Freeze metric</div><div>Freeze model</div><div>Refit on train</div><div>Evaluate test once</div></div>`),
  content("المعملان", lab("4A","شرائح العملاء وPCA",["log1p + scale","اختيار k","Cluster profiles","PCA map"])),
  content("المعملان", lab("4B","الضبط وبطاقة النموذج",["Random search","CV budget","Test once","Model Card"])),
 ]
},
{
 file:"chapter-5.html", title:"اليوم الخامس: تنفيذ المشاريع وعرضها", sub:"Dataset من اختيار الفريق، بناء المشروع، ثم التقييم والعروض", slides:[
  content("هدف اليوم", `<div class="statement"><div class="quote">إثبات أنك تستطيع تنفيذ دورة العمل على <em>بيانات جديدة</em> دون اتباع الحل خطوة بخطوة.</div><div class="side"><div class="panel"><strong>فريق من طالبين</strong>تقسيم أدوار مع مراجعة متبادلة.</div><div class="panel"><strong>خمس ساعات</strong>أربع نقاط تحقق ثم عرض.</div></div></div>`),
  content("Dataset من اختيار الفريق", `<div class="two"><div class="box"><h3>قبل اليوم الخامس</h3><p>يختار الفريق بيانات عامة أو مسموحًا باستخدامها، ثم يرسل المصدر وحجم البيانات وسؤال المشروع للمدرب.</p></div><div class="box"><h3>الخطة الاحتياطية</h3><p>إذا لم تعتمد البيانات، يعطي المدرب ملف Markabat أو Jubail من الحزمة حتى يبدأ الفريق فورًا.</p></div></div>`),
  content("C1: التأطير والتقسيم", lab("C1","أول 50 دقيقة",["قرار العمل","صف البيانات والهدف","اختبار الزمن","Split مناسب"])),
  content("أسئلة نقطة التحقق C1", bullets(["هل المشكلة تحتاج ML فعلًا؟","هل كل ميزة متاحة وقت التنبؤ؟","هل التقسيم عشوائي أم زمني أم grouped؟ ولماذا؟","ما المقياس الذي يرتبط بالقرار؟"])),
  content("C2: Pipeline وخط الأساس", lab("C2","الساعة الثانية",["Dummy baseline","Domain heuristic","Preprocessor","First honest model"])),
  content("الحد الأدنى المقبول", `<div class="kpi"><div class="kpi-head"><div>الدليل</div><div>موجود؟</div><div>المعنى</div></div><div class="kpi-row"><div class="kpi-cell">خط أساس</div><div class="kpi-cell num">✓</div><div class="kpi-cell">نعرف قيمة التحسن</div></div><div class="kpi-row"><div class="kpi-cell">Pipeline</div><div class="kpi-cell lav num">✓</div><div class="kpi-cell">لا توجد معالجة يدوية متناثرة</div></div></div>`),
  content("C3: المقارنة والتحسين", lab("C3","الساعة الثالثة",["نموذجان على الأقل","CV موحد","Error analysis","بحث محدود"])),
  content("قصة النتيجة", `<div class="flow"><div>Baseline</div><div>First model</div><div>Error finding</div><div>One improvement</div><div>Champion</div></div><p class="warning" style="margin-top:35px">لا تعرض عشر تجارب بلا سبب. اعرض قرارًا واحدًا أدى إلى تجربة ونتيجة.</p>`),
  content("C4: بطاقة النموذج", lab("C4","الساعة الرابعة",["Intended use","Data lineage","Metrics + slices","Limitations + owner"])),
  content("حدود يجب كتابتها", two("أمثلة جيدة",bullets(["لا يستخدم لحرمان عميل من خدمة","الأداء أضعف للحالات قليلة التاريخ","يحتاج مراجعة عند تغير نسبة الفئة"]),"عبارات ضعيفة",bullets(["النموذج دقيق","البيانات جيدة","قد توجد أخطاء"]))),
  content("المراجعة الثنائية", `<div class="flow"><div>Restart & Run All</div><div>راجع التسرب</div><div>طابق الأرقام</div><div>اقرأ السرد</div><div>وقّع checklist</div></div>`),
  content("C5: عرض خمس دقائق", `<div class="pillars"><div class="panel pillar"><span class="badge">١</span><h3>المشكلة</h3><p>قرار واضح في 45 ثانية.</p></div><div class="panel pillar"><span class="badge">٢</span><h3>الدليل</h3><p>Baseline، CV، وخطأ مهم.</p></div><div class="panel pillar"><span class="badge">٣</span><h3>الحدود</h3><p>متى نستخدم النموذج ومتى نتوقف.</p></div></div>`),
  content("Rubric مختصر", `<table class="mini-table"><tr><th>المحور</th><th>الدرجة</th></tr><tr><td>التأطير والتقسيم والخط الأساسي</td><td>30</td></tr><tr><td>Pipeline والخصائص</td><td>15</td></tr><tr><td>التقييم وتحليل الأخطاء والتحسين</td><td>42</td></tr><tr><td>بطاقة النموذج والعرض</td><td>13</td></tr></table>`),
  content("قبل العرض", question("هل يستطيع شخص لم يحضر الورشة تشغيل المشروع وفهم قرار النموذج وحدوده؟","إذا كانت الإجابة نعم، فالمستودع هو منتجكم الحقيقي.")),
  content("لاب اليوم الخامس", lab("5","المشروع المتكامل",["FRAMING.md","notebook.ipynb","MODEL_CARD.md","عرض 5 دقائق"])),
 ]
}
];

let topicIndex = 0;
const topic = (name, explanation, example, check, answer, codeSample="") => {
  const n = ++topicIndex;
  const visual = n % 3 === 0
    ? `<div class="signal"><span></span><span></span><span></span><span></span><span></span></div>`
    : n % 3 === 1
      ? `<div class="orbit"><i>${String(n).padStart(2,"0")}</i><b>${name}</b></div>`
      : `<div class="steps-art"><span>بيانات</span><i>←</i><span>قرار</span><i>←</i><span>دليل</span></div>`;
  return [
    content(name, `<div class="concept-layout"><div class="concept-copy"><p class="eyebrow">الفكرة الأساسية</p><p class="lead-copy">${explanation}</p><div class="manafeth-example"><b>في بيانات منافذ</b><p>${example}</p></div></div><div class="concept-art">${visual}</div></div>`),
    content(`${name} — من الفكرة إلى القرار`, `<div class="worked"><div class="worked-head"><span>01</span><p>نحدد ما نعرفه لحظة التنبؤ</p><span>02</span><p>نطبق القاعدة أو النموذج</p><span>03</span><p>نقيس أثر القرار</p></div>${codeSample ? `<div class="codebox">${codeSample}</div>` : ""}<div class="checkpoint"><b>${check}</b><p>${answer}</p></div></div>`),
  ];
};

const opening = (day, outcomes, route) => [
  content(`قصة اليوم ${day}`, `<div class="image-story"><div class="story-copy"><p class="eyebrow">APPLIED MACHINE LEARNING</p><h3>${["من سؤال عمل مبهم إلى تجربة قابلة للقياس","من أرقام خام إلى تنبؤ يمكن تفسيره","من Notebook متفرق إلى Pipeline موثوق","من نموذج واحد إلى قرار مدعوم بالدليل","من المهارة إلى مشروع يُعرض ويُناقش"][day-1]}</h3><p>سنستخدم بيانات منافذ كحالة ممتدة؛ كل قرار نبنيه اليوم سيظهر لاحقًا في اللاب والمشروع.</p></div><img src="assets/course/day${day}-${["problem-framing","supervised-learning","pipeline","ensembles","showcase"][day-1]}.png" alt="مشهد بصري لليوم ${day}"></div>`, "visual-slide"),
  content(`ما الذي ستستطيع تنفيذه؟`, `<div class="outcome-grid">${outcomes.map((x,i)=>`<div class="outcome"><span>${String(i+1).padStart(2,"0")}</span><p>${x}</p></div>`).join("")}</div><p class="teaching-contract">المعيار: لا يكفي أن تعمل الشفرة؛ يجب أن تشرح لماذا كان القرار صحيحًا.</p>`),
  content("خريطة الجلسة", `<div class="flow">${route.map(x=>`<div>${x}</div>`).join("")}</div><p style="margin-top:35px;text-align:center">ثلاث ساعات شرح وأنشطة صفية، ثم ساعتان للتطبيق.</p>`),
];

const day1 = [
 content("قبل أن نبدأ", `<div class="big-prompt"><span>فكّر في تطبيق تستخدمه يوميًا</span><h3>أين يظهر فيه «الذكاء»؟</h3><p>اقتراح أغنية؟ فتح الهاتف بالوجه؟ ترجمة نص؟ اكتب مثالًا واحدًا، ثم حدّد: ما المدخل وما المخرج؟</p></div>`),
 content("مخرجات اليوم الأول", `<div class="outcome-grid"><div class="outcome"><span>01</span><p>تشرح معنى الذكاء الاصطناعي بلغة بسيطة</p></div><div class="outcome"><span>02</span><p>تميّز بين AI وML وDL وGenerative AI</p></div><div class="outcome"><span>03</span><p>تختار نوع تعلم الآلة المناسب للمشكلة</p></div><div class="outcome"><span>04</span><p>تتعرف على feature وtarget وmodel وprediction</p></div></div>`),
 content("خطة خمس ساعات", `<div class="day-plan"><div><b>45 د</b><span>ما هو AI؟</span></div><div><b>55 د</b><span>AI وML وDL وGenAI</span></div><div><b>50 د</b><span>أنواع تعلم الآلة</span></div><div><b>30 د</b><span>من البيانات إلى نموذج</span></div><div class="accent"><b>120 د</b><span>لاب منافذ + مراجعة</span></div></div>`),

 section("Chapter 1","الصورة الكبيرة: ما هو الذكاء الاصطناعي؟"),
 content("الذكاء الاصطناعي باختصار", `<div class="definition-slide"><div class="definition-mark">AI</div><div><h3>أنظمة تنفّذ مهامًا تحتاج عادةً إلى قدر من الذكاء البشري</h3><p>مثل الفهم، التعرّف، التنبؤ، اتخاذ قرار، أو إنشاء محتوى.</p><div class="note-line">الذكاء الاصطناعي اسم للمجال الكبير، وليس خوارزمية واحدة.</div></div></div>`),
 content("كيف نلاحظ الذكاء في النظام؟", `<div class="io-diagram"><div><span>المدخل</span><b>صورة طريق</b></div><i>←</i><div class="brain-node"><span>المعالجة</span><b>يتعرّف على المركبات</b></div><i>←</i><div><span>المخرج</span><b>تنبيه السائق</b></div></div><p class="center-note">نسأل دائمًا: ماذا يستقبل النظام؟ ماذا يفعل؟ وما النتيجة التي يعيدها؟</p>`),
 content("الذكاء الاصطناعي حولنا", `<div class="example-grid"><div><span>🎧</span><b>منصات الصوت</b><p>توصي بمحتوى يناسب اهتمامك</p></div><div><span>📱</span><b>الهاتف</b><p>يتعرف على الوجه ويفتح الجهاز</p></div><div><span>🗺️</span><b>الخرائط</b><p>تتنبأ بالازدحام وتقترح مسارًا</p></div><div><span>🏦</span><b>البنوك</b><p>ترصد العمليات غير المعتادة</p></div></div>`),
 content("هل كل Automation هو AI؟", `<div class="compare-clean"><div><p class="tag">Automation</p><h3>إذا حدث X نفّذ Y</h3><p>قواعد يكتبها الإنسان مسبقًا.</p><div class="rule">إذا كانت الساعة 7 ← أرسل الرسالة</div></div><div><p class="tag purple">AI</p><h3>اختر المخرج المناسب من السياق</h3><p>قد يعتمد على قواعد أو نماذج تتعلم من البيانات.</p><div class="rule">توقّع أفضل وقت لإرسال الرسالة</div></div></div>`),
 content("قدرات مختلفة تحت مظلة AI", `<div class="capability-row"><div><b>يرى</b><span>Computer Vision</span></div><div><b>يفهم اللغة</b><span>NLP</span></div><div><b>يتنبأ</b><span>Machine Learning</span></div><div><b>يخطط</b><span>Robotics</span></div><div><b>يُنشئ</b><span>Generative AI</span></div></div>`),

 section("Chapter 2","العلاقة بين AI وML وDL وGenerative AI"),
 content("الخريطة التي تمنع الخلط", `<div class="nested-map"><div class="ai-ring"><span>Artificial Intelligence<small>المجال الأكبر</small><div class="ml-ring">Machine Learning<small>يتعلم من البيانات</small><div class="dl-ring">Deep Learning<small>شبكات عصبية عميقة</small><div class="gen-ring">Generative AI<small>ينشئ محتوى</small></div></div></div></div></div>`),
 content("المصطلحات الأربعة في سطر واحد", `<table class="concept-table"><tr><th>المصطلح</th><th>الفكرة</th><th>مثال</th></tr><tr><td>AI</td><td>المظلّة العامة للأنظمة الذكية</td><td>مساعد يقترح قرارًا</td></tr><tr><td>ML</td><td>يتعلم نمطًا من أمثلة سابقة</td><td>توقع تأخر رحلة</td></tr><tr><td>DL</td><td>ML باستخدام شبكات عصبية متعددة الطبقات</td><td>التعرف على الأشياء في صورة</td></tr><tr><td>Generative AI</td><td>ينشئ محتوى جديدًا</td><td>إنشاء نص أو صورة</td></tr></table>`),
 content("Machine Learning — تعلم الآلة", `<div class="definition-slide"><div class="definition-mark ml">ML</div><div><h3>طريقة نجعل بها الحاسوب يتعلم علاقة من البيانات بدل كتابة كل القواعد يدويًا</h3><p>نعطيه أمثلة، فيبحث عن نمط يساعده على التنبؤ في أمثلة جديدة.</p></div></div>`),
 content("من القواعد إلى التعلّم", `<div class="two-paths"><div><h3>البرمجة التقليدية</h3><div class="formula"><span>بيانات</span><b>+</b><span>قواعد</span><b>→</b><span>إجابة</span></div><p>المبرمج يكتب منطق القرار.</p></div><div><h3>تعلم الآلة</h3><div class="formula"><span>بيانات</span><b>+</b><span>إجابات صحيحة</span><b>→</b><span>نموذج</span></div><p>الخوارزمية تستنتج نمط القرار.</p></div></div>`),
 content("كيف يتعلم نموذج ML؟", `<div class="learning-loop"><div><b>1</b><span>أمثلة سابقة</span></div><i>←</i><div><b>2</b><span>خوارزمية تتعلم</span></div><i>←</i><div><b>3</b><span>نموذج</span></div><i>←</i><div><b>4</b><span>تنبؤ جديد</span></div></div><p class="center-note">إذا كانت الأمثلة ضعيفة أو لا تمثل الواقع، فلن ينقذنا نموذج متقدم.</p>`),
 content("Deep Learning — التعلم العميق", `<div class="definition-slide"><div class="definition-mark dl">DL</div><div><h3>نوع من تعلم الآلة يستخدم شبكات عصبية مكوّنة من طبقات كثيرة</h3><p>مفيد خصوصًا مع الصور والصوت والنصوص والأنماط المعقدة.</p></div></div>`),
 content("فكرة الشبكة العصبية", `<div class="neural"><div class="layer"><span></span><span></span><span></span><label>المدخلات</label></div><div class="links">⟵</div><div class="layer hidden"><span></span><span></span><span></span><span></span><label>طبقات تتعلم تمثيلات</label></div><div class="links">⟵</div><div class="layer output"><span></span><label>المخرج</label></div></div><p class="center-note">كل طبقة تتعلم تمثيلًا أكثر تجريدًا؛ من حواف بسيطة إلى شكل أو معنى.</p>`),
 content("هل نحتاج Deep Learning دائمًا؟", `<div class="balance"><div><h3>نختاره عندما</h3>${bullets(["البيانات صور أو صوت أو نص كثير","العلاقة شديدة التعقيد","توجد بيانات وحوسبة كافيتان"])}</div><div><h3>غالبًا لا نحتاجه عندما</h3>${bullets(["لدينا جدول صغير أو متوسط","نحتاج تفسيرًا بسيطًا","نموذج تقليدي يحقق الهدف"])}</div></div>`),
 content("Generative AI — الذكاء الاصطناعي التوليدي", `<div class="definition-slide"><div class="definition-mark gen">GenAI</div><div><h3>أنظمة تتعلم أنماط البيانات ثم تُنشئ محتوى جديدًا</h3><p>قد يكون نصًا أو صورة أو صوتًا أو فيديو أو شفرة برمجية.</p><div class="note-line">لا تبحث فقط عن إجابة محفوظة؛ بل تولّد استجابة جديدة اعتمادًا على ما تعلمته.</div></div></div>`),
 content("تنبؤ أم توليد؟", `<div class="compare-clean"><div><p class="tag">Predictive AI</p><h3>يختار أو يتوقع</h3><p>هل الرسالة مزعجة؟ كم سيكون السعر؟</p><div class="rule">مدخل → فئة أو رقم</div></div><div><p class="tag purple">Generative AI</p><h3>ينشئ</h3><p>اكتب ملخصًا. أنشئ صورة. اقترح شفرة.</p><div class="rule">تعليمة → محتوى جديد</div></div></div>`),
 content("اختبر الخريطة", `<div class="quiz-cases"><div><b>يتوقع سعر منزل</b><span>Machine Learning</span></div><div><b>يتعرف على وجه في صورة</b><span>Deep Learning / Vision</span></div><div><b>يكتب وصفًا لمنتج</b><span>Generative AI</span></div><div><b>روبوت يتجنب العوائق بقواعد حساسات</b><span>AI، وليس شرطًا ML</span></div></div>`),

 section("Chapter 3","الأنواع الأساسية لتعلم الآلة"),
 content("ثلاث طرق ليتعلم النظام", `<div class="three-learning"><div><span>01</span><h3>Supervised</h3><p>نتعلم من أمثلة معها الإجابة الصحيحة.</p></div><div><span>02</span><h3>Unsupervised</h3><p>نبحث عن بنية أو مجموعات بلا إجابة جاهزة.</p></div><div><span>03</span><h3>Reinforcement</h3><p>نتعلم من التجربة والمكافأة.</p></div></div>`),
 content("Supervised Learning", `<div class="supervised-demo"><div class="sample"><b>المثال</b><span>مساحة المنزل، الحي، العمر</span></div><div class="sample"><b>الإجابة</b><span>السعر الحقيقي</span></div><i>← تدريب ←</i><div class="model-chip">MODEL</div><i>←</i><div class="sample"><b>التنبؤ</b><span>سعر منزل جديد</span></div></div>`),
 content("Classification — التصنيف", `<div class="task-card"><div class="task-symbol">A / B</div><div><h3>نريد توقع فئة</h3><p>رسالة مزعجة أم سليمة؟ عملية احتيال أم طبيعية؟ ناجح أم غير ناجح؟</p><div class="output-chip">المخرج: اسم فئة أو احتمالها</div></div></div>`),
 content("Regression — الانحدار", `<div class="task-card"><div class="task-symbol chart-symbol">↗</div><div><h3>نريد توقع رقم مستمر</h3><p>سعر، مدة، درجة حرارة، كمية طلب، أو استهلاك طاقة.</p><div class="output-chip">المخرج: قيمة رقمية بوحدة واضحة</div></div></div>`),
 content("Unsupervised Learning", `<div class="cluster-demo"><div class="dots group-a">•••••</div><div class="dots group-b">••••</div><div class="dots group-c">••••••</div></div><h3 class="under-visual">لا توجد إجابة جاهزة؛ نبحث عن مجموعات أو أنماط متشابهة</h3>`),
 content("Clustering — التجميع", `<div class="compare-clean"><div><h3>المدخل</h3><p>خصائص العملاء أو المنتجات، من دون عمود هدف.</p></div><div><h3>المخرج</h3><p>مجموعات متشابهة تساعدنا على الفهم أو التخصيص.</p></div></div><p class="warning">المجموعة ليست «حقيقة» تلقائيًا؛ يجب أن نفسرها ونتأكد من فائدتها.</p>`),
 content("Reinforcement Learning", `<div class="rl-loop"><div>وكيل<br><small>Agent</small></div><i>يتصرف ←</i><div>بيئة<br><small>Environment</small></div><i>← مكافأة</i></div><p class="center-note">مثال: نظام يتعلم اللعب؛ يحصل على مكافأة عندما يتقدم نحو الفوز.</p>`),
 content("اختيار نوع المهمة", `<table class="concept-table"><tr><th>السؤال</th><th>نوع المهمة</th></tr><tr><td>هل سيغادر العميل؟</td><td>Classification</td></tr><tr><td>كم ستكون قيمة الطلب؟</td><td>Regression</td></tr><tr><td>ما شرائح العملاء الموجودة؟</td><td>Clustering</td></tr><tr><td>ما الحركة التي تزيد المكافأة؟</td><td>Reinforcement Learning</td></tr></table>`),

 section("Chapter 4","لغة تعلم الآلة ودورة العمل"),
 content("أربع كلمات سنكررها طوال الدورة", `<div class="term-grid"><div><b>Sample</b><p>مثال واحد أو صف واحد</p></div><div><b>Feature</b><p>معلومة نستخدمها للتنبؤ</p></div><div><b>Target</b><p>الإجابة التي نريد تعلمها</p></div><div><b>Model</b><p>النمط المتعلم من البيانات</p></div></div>`),
 content("مثال صغير: هل ينجح الطالب؟", `<table class="concept-table"><tr><th>ساعات المذاكرة</th><th>نسبة الحضور</th><th>حل الواجبات</th><th>نجح؟</th></tr><tr><td>8</td><td>95%</td><td>نعم</td><td class="yes">نعم</td></tr><tr><td>2</td><td>55%</td><td>لا</td><td class="no">لا</td></tr><tr><td>6</td><td>80%</td><td>نعم</td><td class="yes">نعم</td></tr></table><p class="center-note">الميزات: الأعمدة الثلاثة الأولى. الهدف: «نجح؟». كل طالب: Sample.</p>`),
 content("دورة مشروع تعلم الآلة", `<div class="lifecycle"><div><b>1</b><span>نفهم المشكلة</span></div><div><b>2</b><span>نجمع البيانات</span></div><div><b>3</b><span>نجهزها</span></div><div><b>4</b><span>ندرب نموذجًا</span></div><div><b>5</b><span>نقيّم</span></div><div><b>6</b><span>نستخدم ونراقب</span></div></div>`),
 content("ما الذي لا يفعله النموذج؟", `<div class="myths"><div><b>لا يفهم العالم مثل الإنسان</b><p>يتعلم أنماطًا من البيانات المتاحة له.</p></div><div><b>لا يضمن الحقيقة</b><p>كل تنبؤ يحمل احتمالًا للخطأ.</p></div><div><b>لا يصلح بيانات سيئة</b><p>جودة المدخلات وحدودها تنتقل إلى النموذج.</p></div></div>`),
 content("الانتقال إلى اللاب", `<div class="lab-transition"><p>الآن فقط سنستخدم بيانات <b>منافذ</b> كبيئة تدريبية</p><h3>لن نبني نموذجًا معقدًا اليوم</h3><span>سنفتح البيانات، نفهم الصفوف والأعمدة، نحدد Features وTarget، ونختار نوع المهمة.</span></div>`),
 content("لاب اليوم الأول: استكشاف بيانات منافذ", lab("1A","من الجدول إلى سؤال تعلم آلة",["فتح ملفات البيانات وفهمها","تمييز الصف والعمود","تحديد Features وTarget","تصنيف السؤال: Classification أم Regression"])),
 content("خطة اللاب — ساعتان", `<table class="mini-table"><tr><th>الوقت</th><th>المهمة</th><th>ما يسلّمه الطالب</th></tr><tr><td>20 د</td><td>التعرف على الملفات والقاموس</td><td>وصف كل جدول</td></tr><tr><td>30 د</td><td>فحص الصفوف والأعمدة والأنواع</td><td>ملاحظات الاستكشاف</td></tr><tr><td>30 د</td><td>اختيار سؤالين مختلفين</td><td>Classification + Regression</td></tr><tr><td>25 د</td><td>تحديد Features وTarget</td><td>Framing Canvas</td></tr><tr><td>15 د</td><td>مشاركة ومراجعة</td><td>شرح دقيقتين</td></tr></table>`),
 content("حصيلة اليوم", `<div class="recap-map"><span>AI هو المظلّة</span><i>←</i><span>ML يتعلم من البيانات</span><i>←</i><span>DL نوع متقدم من ML</span><i>←</i><span>GenAI ينشئ محتوى</span></div><div class="final-check">قبل أن تغادر: هل تستطيع إعطاء مثال مختلف لكل مصطلح؟</div>`),
];

const day2 = [
 ...opening(2,["تدريب Linear وRidge Regression","بناء Logistic Regression للتصنيف","قراءة الاحتمالات ومصفوفة الالتباس","تشخيص underfitting وoverfitting"],["Regression","Regularization","Classification","Trees","Diagnosis"]),
 section("Chapter 3","نماذج الانحدار"),
 ...topic("Linear Regression","يبني علاقة خطية بين الميزات والهدف ويختار معاملات تقلل الخطأ.","نربط تكرار الطلب ومدة العميل وتنوع الفئات بمتوسط السلة، ثم نقيس MAE.","إذا زاد orders_per_month بوحدة، ماذا يمثل معامله؟","التغير المتوقع في الهدف مع ثبات بقية الميزات."),
 ...topic("Residuals","البقايا هي الحقيقي ناقص المتوقع. نمطها يكشف ما لم يتعلمه النموذج.","شكل المروحة عند السلال الكبيرة يشير إلى أن الخطأ يكبر مع القيمة وقد يفيد log1p.","بقايا موجبة كبيرة تعني ماذا؟","النموذج قلل التوقع عن القيمة الحقيقية."),
 ...topic("Ridge Regularization","Ridge يضيف عقوبة للأوزان الكبيرة حتى يقل اعتماد النموذج على تقلبات صغيرة.","عند وجود ميزات مترابطة، Ridge غالبًا يعطي معاملات أكثر استقرارًا من Linear Regression.","هل Ridge يضمن نتيجة أفضل دائمًا؟","لا؛ نتحقق تحت validation أو CV."),
 ...topic("Lasso واختيار الميزات","Lasso يستطيع دفع بعض المعاملات إلى الصفر، لكنه لا يفهم معنى المجال تلقائيًا.","قد يصفر ميزة من ميزتين مترابطتين رغم أن كلتيهما مفيدة في التفسير.","هل المعامل صفر يثبت أن الميزة بلا قيمة؟","لا، خصوصًا مع ميزات مترابطة أو sample محدود."),
 ...topic("تحويل الهدف","التحويل اللوغاريتمي يساعد عندما يكون الهدف موجبًا وله ذيل طويل.","نستخدم log1p للسلة ثم expm1 لإعادة التوقع إلى الريال قبل حساب MAE.","بأي وحدة نقيم النموذج النهائي؟","بالريال بعد عكس التحويل."),
 section("Chapter 4","نماذج التصنيف وفرط التعلم"),
 ...topic("Probability قبل Label","النموذج ينتج درجة أو احتمالًا، ثم تحول سياسة العمل هذه الدرجة إلى قرار.","منافذ ترتب العملاء حسب الاحتمال وتختار أعلى 20% بدل استخدام 0.5 آليًا.","هل احتمال 0.8 يعني أن النموذج صحيح قطعًا؟","لا؛ هو تقدير يحتاج تقييمًا ومعايرة."),
 ...topic("Logistic Regression","يحّول مجموعًا موزونًا من الميزات إلى احتمال بين صفر وواحد.","يوفر baseline قويًا وسريعًا لتوقع churn ويمكن تفسير اتجاه المعاملات.","لماذا نستخدم predict_proba مع PR-AUC؟","لأن المقياس يحتاج ترتيب الدرجات عبر العتبات."),
 ...topic("Confusion Matrix","أربع خانات تربط توقع النموذج بالحقيقة وتكشف نوع الخطأ.","False Negative هو عميل متوقف لم يصل إلى حملة الاحتفاظ.","ما تكلفة False Positive في الحالة؟","عرض أو اتصال يُصرف على عميل لم يكن سيتوقف."),
 ...topic("Decision Tree","تقسم البيانات بأسئلة متتابعة ويمكنها تمثيل علاقات غير خطية.","قد تسأل الشجرة عن recency ثم orders_per_month ثم avg_rating.","لماذا تبدو الشجرة مفهومة لكنها خطرة؟","لأنها قد تكبر وتحفظ تفاصيل التدريب."),
 ...topic("Overfitting وUnderfitting","نقارن train وvalidation: ضعف الاثنين يعني نقص التعلم، وفجوة كبيرة تعني حفظ التدريب.","عمق 20 قد يصل train≈1.0 بينما يهبط validation عن عمق 7.","train=0.98 وvalidation=0.44: التشخيص؟","Overfitting؛ نقلل السعة أو نزيد التنظيم أو نحسن البيانات."),
 content("اللابات", lab("2A","Regression على منافذ",["Dummy vs Linear","Ridge","Residuals","Log target"])),
 content("اللابات", lab("2B","Classification وعمق الشجرة",["Logistic probability","Confusion matrix","Depth sweep","Validation choice"])),
 content("خطة الساعتين التطبيقية", `<table class="mini-table"><tr><th>الوقت</th><th>المهمة</th></tr><tr><td>50 د</td><td>Regression وresidual analysis</td></tr><tr><td>10 د</td><td>مراجعة قصيرة</td></tr><tr><td>50 د</td><td>Classification وdepth sweep</td></tr><tr><td>10 د</td><td>كتابة الاستنتاج والتسليم</td></tr></table>`),
 content("ملخص اليوم الثاني", `<div class="checklist"><div class="check">المقياس بوحدة القرار</div><div class="check">الاحتمال يسبق العتبة</div><div class="check">validation يختار التعقيد</div><div class="check">الفجوة تشخص overfitting</div></div>`),
];

const day3 = [
 ...opening(3,["معالجة missing values والفئات والأرقام","بناء ColumnTransformer وPipeline","تقييم النماذج تحت CV موحد","اختيار threshold وتحليل الشرائح"],["Impute","Encode","Scale","Pipeline","Evaluate"]),
 section("Chapter 5","هندسة الخصائص وخطوط المعالجة"),
 ...topic("Missing Values","لا نعوض القيمة قبل فهم سبب غيابها، وقد نضيف مؤشرًا لأن الغياب نفسه معلومة.","avg_rating مفقود غالبًا للعميل الجديد؛ median مع add_indicator يحفظ الإشارة.","هل نملأ كل النواقص بصفر؟","لا؛ الصفر قد يكون قيمة حقيقية ويغير المعنى."),
 ...topic("Categorical Encoding","One-Hot يحول كل فئة إلى عمود ثنائي دون افتراض ترتيب غير موجود.","city وdevice وpayment_method فئات اسمية مناسبة لـOneHotEncoder.","لماذا handle_unknown=ignore مهم؟","حتى لا يفشل التنبؤ عند ظهور فئة جديدة."),
 ...topic("Scaling","القياس يجعل الميزات على نطاقات قابلة للمقارنة للنماذج الحساسة للمسافة أو العقوبة.","الريال أكبر عدديًا من promo_usage_rate، لكن الحجم العددي لا يعني أهمية أكبر.","هل Random Forest يحتاج StandardScaler؟","عادة لا؛ الانقسامات لا تعتمد على المسافة."),
 ...topic("Datetime Features","التاريخ الخام قليل الفائدة؛ نستخرج منه مدة أو موسمًا متاحًا وقت التنبؤ.","tenure_months يأتي من snapshot_date ناقص signup_date.","هل نحسب ميزة من طلب وقع بعد snapshot؟","لا؛ كل aggregate يجب أن يرشح order_ts قبل اللقطة."),
 ...topic("RFM Features","Recency وFrequency وMonetary تلخص تاريخ التعامل حتى لحظة القرار.","orders_90d وavg_basket_90d تستخدم الطلبات السابقة للّقطة فقط.","لماذا aggregate على كل جدول orders تسرب؟","لأنه قد يلخص أحداث المستقبل."),
 ...topic("ColumnTransformer","يرسل كل مجموعة أعمدة إلى خطوات تناسب نوعها ثم يجمع الناتج.","الأرقام: impute ثم scale. الفئات: impute ثم one-hot.","أين نضع customer_id؟","نستبعده؛ معرف فريد وليس سلوكًا قابلًا للتعميم."),
 ...topic("Pipeline","تربط preprocessing بالنموذج حتى يتعلم كل transform من fold التدريب فقط.","pipe.fit يستقبل dataframe الخام، وpipe.predict_proba يعيد الاحتمال دون خطوات يدوية.","لماذا تجهيز البيانات قبل CV خطير؟","لأن المتوسطات والفئات ستتعلم من folds التحقق."),
 section("Chapter 6","التقييم واختيار سياسة القرار"),
 ...topic("Precision وRecall","Precision يقيس جودة المختارين، وRecall يقيس تغطية الحالات الإيجابية.","عند ميزانية تواصل محدودة نراقب الاثنين ونشرح تكلفة كل خطأ.","إذا أردنا ألا نفوّت المتسربين، أي مقياس يرتفع؟","Recall، مع قبول زيادة false positives غالبًا."),
 ...topic("PR-AUC وROC-AUC","PR-AUC أكثر إفادة للفئة النادرة لأنه يركز على جودة الإيجابيات.","مع prevalence=14%، Dummy PR-AUC≈0.14 ويعطي نقطة مرجعية واضحة.","هل نقارن PR-AUC لنموذج بدقة Accuracy لآخر؟","لا؛ نستخدم المقياس نفسه والبروتوكول نفسه."),
 ...topic("Cross-Validation","نكرر التدريب والتحقق على طيات ثابتة ونبلغ المتوسط والتباين.","0.49±0.01 أقوى كادعاء من نتيجة split واحدة 0.52 دون تباين.","لماذا نستخدم الطيات نفسها لكل نموذج؟","حتى تكون المقارنة عادلة ولا يربح نموذج من تقسيم أسهل."),
 ...topic("Threshold at Budget","العتبة ليست خاصية مقدسة للنموذج؛ هي سياسة يحددها قيد العمل.","نختار الحد الذي يضع 20% من العملاء في قائمة التواصل.","هل نضبط العتبة على test؟","لا؛ نضبطها داخل train/validation ثم نثبتها."),
 ...topic("Slice Analysis","المتوسط قد يخفي ضعفًا عند مدينة أو شريحة عمر حساب معينة.","نقارن recall للعملاء الجدد والقدامى والمدن مع عدد الحالات في كل شريحة.","فرق صغير في شريحة بها 8 حالات: هل يكفي؟","لا؛ نذكر حجم العينة وعدم اليقين."),
 content("اللابات", lab("3A","Pipeline آمن على منافذ",["Imputation","One-Hot","Scaling","Leakage test"])),
 content("اللابات", lab("3B","Evaluation harness",["Shared CV","PR-AUC","Threshold@20%","Slice analysis"])),
 content("ملخص اليوم الثالث", `<div class="checklist"><div class="check">كل transforms داخل Pipeline</div><div class="check">aggregates قبل snapshot</div><div class="check">النماذج على folds موحدة</div><div class="check">العتبة من قيد العمل</div></div>`),
];

const day4 = [
 ...opening(4,["تدريب Random Forest وGradient Boosting","تفسير النموذج دون ادعاء السببية","تقسيم العملاء بـK-Means وPCA","ضبط النموذج وإغلاق الاختبار مرة واحدة"],["Ensembles","Explain","Cluster","Tune","Finalize"]),
 section("Chapter 7","النماذج الشجرية المجمعة"),
 ...topic("Bagging","ندرب نماذج متوازية على عينات مختلفة ثم نوسطها لتقليل التباين.","Random Forest يبني أشجارًا متعددة بدل الاعتماد على شجرة حساسة لعينة واحدة.","أي مشكلة يعالجها averaging أساسًا؟","التباين وعدم استقرار الشجرة."),
 ...topic("Random Forest","كل شجرة ترى عينة من الصفوف ومجموعة من الميزات، ثم تتوسط الغابة الاحتمالات.","نقارنها بـLogistic على folds نفسها ونراقب وقت التدريب.","هل عدد أشجار أكبر يعالج leakage؟","لا؛ يحسن الثبات لكنه لا يصلح البيانات الخاطئة."),
 ...topic("Gradient Boosting","يبني الأشجار بالتتابع، وكل شجرة تركز على أخطاء المجموعة الحالية.","XGBoost أو HistGradientBoosting قد يلتقط علاقات دقيقة في بيانات منافذ.","ما دور learning_rate؟","يحدد مساهمة كل شجرة جديدة وسرعة التعلم."),
 ...topic("Class Imbalance","نتعامل مع الفئة النادرة بالمقياس الصحيح والأوزان والعتبة، لا بنسخ البيانات تلقائيًا.","class_weight يساعد بعض النماذج، لكن الحكم النهائي يبقى PR-AUC وقرار الميزانية.","هل accuracy تكفي بعد class_weight؟","لا؛ ما زالت تخفي أداء الفئة الإيجابية."),
 ...topic("Permutation Importance","نخلط عمودًا في validation ونقيس مقدار هبوط النتيجة.","إذا هبط PR-AUC بعد خلط recency، يعتمد النموذج عليه في هذه البيانات.","هل الأهمية تثبت أن recency يسبب churn؟","لا؛ اعتماد تنبؤي وليس علاقة سببية."),
 ...topic("Champion وChallenger","نختار نموذجًا رئيسيًا بالدليل ونحتفظ بمنافس أبسط للمقارنة والرجوع.","قد يفوز forest قليلًا، بينما يبقى logistic challenger أسرع وأسهل تفسيرًا.","متى نختار الأبسط؟","عندما يكون التحسن غير ثابت أو لا يبرر التكلفة."),
 section("Chapter 8","التعلم غير الخاضع والضبط النهائي"),
 ...topic("K-Means","يقسم الصفوف حسب قربها من مراكز تتحدث تدريجيًا.","نقسم عملاء منافذ حسب التكرار والسلة والحداثة وتنوع الفئات.","لماذا نطبق log وscale أولًا؟","حتى لا تسيطر الذيول والنطاقات الكبيرة على المسافة."),
 ...topic("اختيار k","نوازن بين silhouette وشكل elbow وإمكانية تسمية الشرائح واستخدامها.","قد يقترح الرقم 5 شرائح واضحة مثل المتكرر والموسمي والمتباعد.","هل أعلى silhouette يقرر وحده؟","لا؛ الفائدة والثبات جزء من القرار."),
 ...topic("PCA","يضغط عدة ميزات إلى محاور تحفظ أكبر قدر من التباين وتساعد على العرض.","نرسم العملاء على PC1 وPC2 ونذكر نسبة التباين المحفوظة.","هل تباعد النقاط في رسم PCA يثبت جودة الشرائح؟","لا؛ نحتاج profiling وثباتًا وفائدة خارجية."),
 ...topic("Hyperparameter Tuning","نحدد مساحة وميزانية بحث قبل التشغيل ونضبط Pipeline كاملًا داخل CV.","RandomizedSearchCV بـ12 تجربة أفضل تعليميًا من grid ضخم بلا مبرر.","أين يبقى test أثناء البحث؟","مغلق تمامًا حتى تجميد كل القرارات."),
 ...topic("Final Test وModel Card","نعيد تدريب النموذج المختار على train، نفتح test مرة واحدة، ثم نوثق الاستخدام والحدود.","نسجل PR-AUC والعتبة والشرائح الضعيفة ومالك المراقبة.","بعد رؤية test أردنا تعديل ميزة. ماذا حدث؟","تحول test إلى validation ونحتاج بيانات اختبار جديدة للتقييم المحايد."),
 content("اللابات", lab("4A","Ensembles وClustering",["Random Forest","Importance","K-Means","PCA"])),
 content("اللابات", lab("4B","Tuning وإغلاق الحلقة",["Random search","CV budget","Test once","Model Card"])),
 content("تجهيز مشروع الغد", `<div class="checklist"><div class="check">اعتماد Dataset ومصدرها</div><div class="check">تعريف الصف والهدف</div><div class="check">اختيار المقياس والتقسيم</div><div class="check">تحميل نسخة محلية جاهزة</div></div>`),
 content("ملخص الأيام التعليمية", `<div class="flow"><div>Frame</div><div>Split</div><div>Baseline</div><div>Pipeline</div><div>Evaluate</div><div>Document</div></div>`),
];

const day5 = [
 ...opening(5,["نقل المهارة إلى Dataset جديدة","إنتاج مشروع قابل لإعادة التشغيل","الدفاع عن قرارات التقييم","عرض النتائج والحدود بوضوح"],["اعتماد","بناء","تقييم","توثيق","عرض"]),
 content("لا توجد محاضرة جديدة اليوم", `<div class="decision"><div class="callout">اليوم الخامس <strong>ورشة مشروع وتقييم</strong>. المدرب يراجع القرارات ولا يملي الحل.</div></div>`),
 content("شروط Dataset", `<div class="checklist"><div class="check">مصدر وترخيص واضحان</div><div class="check">لا توجد بيانات حساسة</div><div class="check">حجم مناسب للجهاز والوقت</div><div class="check">هدف ومعنى أعمدة مفهوم</div></div>`),
 content("خطة الخمس ساعات", `<table class="mini-table"><tr><th>الساعة</th><th>العمل</th><th>البوابة</th></tr><tr><td>1</td><td>تأطير، audit، split</td><td>C1</td></tr><tr><td>2</td><td>baseline، Pipeline، أول نموذج</td><td>C2</td></tr><tr><td>3</td><td>CV، أخطاء، تحسين</td><td>C3</td></tr><tr><td>4</td><td>Model Card، Run All، العرض</td><td>C4</td></tr><tr><td>5</td><td>عروض وتقييم</td><td>C5</td></tr></table>`),
 section("C1","المشكلة والتقسيم"),
 ...topic("بوابة C1","لا يبدأ التدريب قبل اعتماد قرار العمل والصف والهدف والزمن والتقسيم.","يشرح الفريق لماذا اختار random أو temporal أو grouped split.","Dataset زمنية قُسمت عشوائيًا. ما الخطر؟","قد يتعلم النموذج من المستقبل ويعطي تقديرًا متفائلًا."),
 section("C2","Pipeline وخط الأساس"),
 ...topic("بوابة C2","يجب أن يعمل المسار من dataframe خام إلى prediction، مع baseline مسجل.","تعالج الأنواع داخل ColumnTransformer ولا توجد خطوات يدوية على test.","لماذا نطلب baseline قبل النموذج؟","حتى نعرف هل التعقيد أضاف قيمة."),
 section("C3","المقارنة وتحليل الأخطاء"),
 ...topic("بوابة C3","يقارن الفريق نموذجين على البروتوكول نفسه ثم يحسن بناء على خطأ محدد.","يعرض المتوسط والتباين وشريحة ضعيفة بدل رقم واحد فقط.","هل اختيار أعلى best_score_ يكفي؟","لا؛ نفحص الثبات والبساطة والأخطاء والتكلفة."),
 section("C4","التوثيق وتجهيز العرض"),
 ...topic("بوابة C4","Restart & Run All ينجح، والأرقام في Model Card تطابق الدفتر.","تكتب الحدود بصياغة محددة مثل ضعف الأداء لشريحة قليلة التاريخ.","عبارة «قد يخطئ النموذج» كافية؟","لا؛ نحدد أين ولماذا وما الإجراء الوقائي."),
 section("C5","العروض والتقييم"),
 content("عرض من 5 إلى 7 دقائق", `<div class="flow"><div>المشكلة</div><div>البيانات</div><div>Baseline</div><div>الدليل</div><div>الحدود</div></div><p class="warning" style="margin-top:30px">يعرض الفريق قصة قرار واحدة، لا جولة في كل خلية.</p>`),
 content("Rubric من 100", `<table class="mini-table"><tr><th>المحور</th><th>الدرجة</th></tr><tr><td>التأطير وسلامة البيانات</td><td>22</td></tr><tr><td>التقسيم وPipeline وBaseline</td><td>25</td></tr><tr><td>التقييم وتحليل الأخطاء والتحسين</td><td>33</td></tr><tr><td>Model Card وإعادة التشغيل</td><td>12</td></tr><tr><td>العرض والإجابة</td><td>8</td></tr></table>`),
 content("أسئلة المقيمين", `<div class="checklist"><div class="check">ما القرار الذي يتغير؟</div><div class="check">كيف منعت leakage؟</div><div class="check">لماذا اخترت هذا المقياس؟</div><div class="check">أين يضعف النموذج؟</div><div class="check">ما الذي ستراقبه بعد النشر؟</div><div class="check">متى ترفض استخدامه؟</div></div>`),
 content("التسليم النهائي", lab("5","مشروع تعلم آلة متكامل",["FRAMING.md","notebook.ipynb","MODEL_CARD.md","عرض 5–7 دقائق"])),
];

const storyEsc = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

function inlineStory(text) {
  return storyEsc(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function storyboardMarkdown(markdown) {
  const codeBlocks = [];
  let source = markdown.trim().replace(/```(?:python)?\n([\s\S]*?)```/g, (_, code) => {
    const id = codeBlocks.push(`<pre class="story-code"><code>${storyEsc(code.trim())}</code></pre>`) - 1;
    return `\n@@CODE${id}@@\n`;
  });
  const lines = source.split("\n");
  const out = [];
  for (let i = 0; i < lines.length;) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }
    if (/^@@CODE\d+@@$/.test(line)) {
      out.push(codeBlocks[Number(line.match(/\d+/)[0])]); i++; continue;
    }
    if (line.startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(lines[i++].trim());
      const clean = rows.filter(r => !/^\|?\s*:?-+/.test(r.replaceAll("|", "").trim()));
      const cells = clean.map(r => r.slice(1,-1).split("|").map(c => inlineStory(c.trim())));
      out.push(`<table class="story-table">${cells.map((r,ri)=>`<tr>${r.map(c=>ri===0?`<th>${c}</th>`:`<td>${c}</td>`).join("")}</tr>`).join("")}</table>`);
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*]\s+/, ""));
      out.push(`<ul class="story-list">${items.map(x=>`<li>${inlineStory(x)}</li>`).join("")}</ul>`);
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+\.\s+/, ""));
      out.push(`<ol class="story-list numbered">${items.map(x=>`<li>${inlineStory(x)}</li>`).join("")}</ol>`);
      continue;
    }
    out.push(`<p>${inlineStory(line)}</p>`); i++;
  }
  return out.join("");
}

function parseStoryboard() {
  const storyboardPath = path.join(root, "course", "Applied_ML_5day_Expanded_Slide_Storyboard_AR.md");
  const source = fs.readFileSync(storyboardPath, "utf8");
  const matches = [...source.matchAll(/^## الشريحة (\d+): (.+)$/gm)];
  return matches.map((match, index) => {
    const block = source.slice(match.index + match[0].length, matches[index + 1]?.index ?? source.length);
    const day = Number(block.match(/\nاليوم:\s*\n(\d+)/)?.[1]);
    let visible = block.match(/المحتوى الظاهر على الشريحة:\s*\n([\s\S]*?)\nالتصميم البصري:/)?.[1]?.trim() ?? "";
    const codeBlocks = [...block.matchAll(/```(?:python)?\n[\s\S]*?```/g)].map(m => m[0]);
    for (const codeBlock of codeBlocks) {
      if (!visible.includes(codeBlock)) visible += `\n\n${codeBlock}`;
    }
    const design = block.match(/التصميم البصري:\s*\n([\s\S]*?)\nملاحظات المدرب:/)?.[1]?.trim() ?? "";
    return { number: Number(match[1]), title: match[2].trim(), day, visible, design };
  });
}

const storyboardSlides = parseStoryboard();
const labPriority = {
  159: `- **الهدف:** \`churned_30d\`\n- مغادرة خلال 30 يومًا = 1، وعدم المغادرة = 0\n- **نوع المهمة:** تصنيف ثنائي\n- **وحدة التنبؤ:** عميل واحد عند تاريخ لقطة شهرية\n- **القرار:** ترتيب قائمة المتابعة لفريق خدمة العملاء`,
  163: `- **ملف التطوير والتقييم:** \`manafeth_customers.parquet\`\n- **ملف التشغيل اللاحق:** \`shifted_month.parquet\` بلا هدف\n- يحتوي الجدول على خصائص سلوك واشتراك ورضا متاحة عند تاريخ اللقطة\n- \`customer_id\` معرّف للتتبع وليس خاصية\n- \`churned_30d\` هو الهدف في الملف التاريخي فقط`,
  167: `- أدخل فقط الخصائص المتاحة عند تاريخ اللقطة\n- استبعد \`churned_30d\` لأنه الهدف\n- استبعد \`customer_id\` لأنه معرّف\n- استبعد \`refund_issued\` و\`support_ticket_after_snapshot\` و\`next_month_orders\` لأنها معلومات مستقبلية\n- استخدم قائمة الخصائص الآمنة نفسها وبالترتيب نفسه مع \`shifted_month.parquet\``,
  33: `- **هدف المختبر:** كشف تسريب البيانات وصياغة مسألة مغادرة العميل قبل تدريب أي نموذج\n- **البيانات:** \`manafeth_customers.parquet\`؛ كل صف عميل عند تاريخ لقطة\n- **الهدف:** \`churned_30d\`\n- **الناتج:** بطاقة مشكلة وقائمة أعمدة آمنة ومستبعدة\n- **الزمن:** 35 دقيقة`,
  34: `1. افتح \`lab_1_manafeth_leakage.ipynb\` واقرأ جدول العملاء\n2. افحص الحجم والأنواع والنقص وتوازن الهدف\n3. حدّد وحدة التنبؤ والقرار الذي سيستخدم الاحتمال\n4. استبعد \`customer_id\` بوصفه معرّفًا\n5. استبعد \`refund_issued\` و\`support_ticket_after_snapshot\` و\`next_month_orders\` لأنها تكشف المستقبل`,
  35: `- شغّل الفحص ثم وثّق قرار كل عمود:\n\n\`\`\`python\ncustomers = pd.read_parquet(CUSTOMERS_PATH)\ncustomers.head()\ncustomers.info()\ncustomers.isna().mean().sort_values(ascending=False).head(10)\ncustomers["churned_30d"].value_counts(normalize=True)\n\nleak_columns = [\n    "refund_issued", "support_ticket_after_snapshot",\n    "next_month_orders"\n]\n\`\`\``,
  36: `- **النتيجة المتوقعة:** بطاقة مشكلة، نسبة الهدف، وقائمتان للأعمدة الآمنة والمستبعدة\n- اشرح لماذا لا يدخل \`customer_id\` إلى النموذج\n- اشرح لماذا الأعمدة المسرّبة تعطي نتيجة ممتازة على الورق وفاشلة عند التشغيل\n- **التسليم:** خلية Markdown توثق السؤال ووحدة التنبؤ والهدف وقرار الاستبعاد`,
  69: `- **هدف المختبر:** بناء \`preprocessor\` صادق لخصائص عملاء منافذ\n- **البيانات:** \`manafeth_customers.parquet\`\n- **الهدف:** \`churned_30d\`\n- **الناتج:** مسار أرقام ومسار فئات داخل \`ColumnTransformer\`\n- **الزمن:** 60 دقيقة`,
  70: `1. افصل الهدف عن الخصائص الآمنة\n2. استبعد المعرّف والأعمدة المسرّبة الثلاثة\n3. قسّم 80/20 مع \`stratify=y\`\n4. صنّف الخصائص إلى عددية وفئوية\n5. تحقق من وجود نقص في \`avg_rating\` قبل بناء المعالجة`,
  71: `- المسار العددي: وسيط + مؤشر نقص + تحجيم\n\n\`\`\`python\nnumeric_pipeline = Pipeline([\n    ("fill", SimpleImputer(strategy="median", add_indicator=True)),\n    ("scale", StandardScaler())\n])\n\`\`\``,
  72: `- المسار الفئوي: الأكثر تكرارًا + One-Hot\n\n\`\`\`python\ncategorical_pipeline = Pipeline([\n    ("fill", SimpleImputer(strategy="most_frequent")),\n    ("encode", OneHotEncoder(handle_unknown="ignore"))\n])\npreprocessor = ColumnTransformer([\n    ("numbers", numeric_pipeline, numeric_features),\n    ("categories", categorical_pipeline, categorical_features)\n])\n\`\`\``,
  73: `- إذا ظهر \`KeyError\`: اطبع أسماء الأعمدة وقارنها بالقوائم\n- إذا اختلف عدد الصفوف: أعد إنشاء X وy من الجدول نفسه قبل التقسيم\n- إذا اختفى مؤشر النقص: تحقق من \`add_indicator=True\`\n- لا تعالج كامل الجدول قبل التقسيم؛ تتعلم المعالجة من التدريب فقط`,
  74: `- الهدف خارج X\n- المعرّف والأعمدة المسرّبة خارج الخصائص\n- التقسيم يحافظ على توزيع \`churned_30d\`\n- \`preprocessor.fit_transform(X_train)\` يعمل دون خطأ\n- الناتج يحتوي مؤشرًا للنقص\n- **التسليم:** القوائم ومسارا المعالجة وسبب عدم حساب الوسيط من كامل الجدول`,
  100: `- **هدف المختبر:** تنفيذ تصنيف مغادرة العميل وانحدار سعر مركبة\n- **التصنيف:** \`manafeth_customers.parquet\` والهدف \`churned_30d\`\n- **الانحدار:** \`markabat_listings_sample.csv\` والهدف \`sale_price_sar\`\n- **الناتج:** فئات واحتمالات للمغادرة، وأسعار رقمية للمركبات\n- **الزمن:** 75 دقيقة`,
  101: `1. أعد استخدام \`preprocessor\` وتقسيم العملاء\n2. أنشئ Pipeline مع \`LogisticRegression(max_iter=1000)\`\n3. درّب على التدريب فقط\n4. احفظ \`predict\` للفئة و\`predict_proba\` لاحتمال المغادرة\n5. افحص حالة واحدة مع حقيقتها`,
  102: `\`\`\`python\nchurn_classifier = Pipeline([\n    ("prepare", preprocessor),\n    ("model", LogisticRegression(max_iter=1000))\n])\nchurn_classifier.fit(X_train, y_train)\nchurn_predictions = churn_classifier.predict(X_test)\nchurn_probabilities = churn_classifier.predict_proba(X_test)[:, 1]\n\`\`\``,
  103: `1. اقرأ \`markabat_listings_sample.csv\`\n2. اجعل \`sale_price_sar\` هو الهدف\n3. استبعد \`listing_id\` و\`listed_month\` و\`days_on_platform\`\n4. جهز الأرقام والفئات في Pipeline جديد\n5. درّب \`LinearRegression\` واطبع أول خمسة أسعار`,
  104: `- الخصائص: \`make\` و\`model_year\` و\`mileage_km\` و\`city\` و\`condition_grade\` و\`photos_count\`\n\n\`\`\`python\nprice_regressor = Pipeline([\n    ("prepare", vehicle_preprocessor),\n    ("model", LinearRegression())\n])\nprice_regressor.fit(Xv_train, yv_train)\nprice_predictions = price_regressor.predict(Xv_test)\nprint(price_predictions[:5].round(2))\n\`\`\``,
  105: `- اعرض صف عميل واحد: خصائصه، فئة المغادرة، احتمالها، والحقيقة\n- اعرض مركبة واحدة: خصائصها، السعر المتوقع، والسعر الحقيقي\n- اكتب وصفًا لما أخرجه النموذج دون ادعاء أن الخصائص «سببت» النتيجة`,
  106: `- \`NameError\`: شغّل خلية تعريف المتغير\n- \`KeyError\`: تحقق من اسم العمود في الملف الفعلي\n- خطأ الفئات الجديدة: تحقق من \`handle_unknown="ignore"\`\n- عدم تطابق الصفوف: أنشئ X وy قبل التقسيم من المصدر نفسه`,
  107: `- قائمة فئات واحتمالات لمغادرة العملاء\n- قائمة أسعار رقمية متوقعة للمركبات\n- لا نحكم على الجودة من أول خمسة توقعات\n- **التسليم:** مخرج من المسارين وجملتان توضحان الفرق بين فئة واحتمال ورقم`,
  150: `- **هدف المختبر:** مقارنة أربعة نماذج لمغادرة العملاء وتحليل الأخطاء\n- **البيانات:** \`manafeth_customers.parquet\`\n- **المقياس:** Average Precision بسبب أن المغادرة تقارب 14%\n- **النماذج:** Logistic Regression، Decision Tree، Random Forest، XGBoost\n- **الزمن:** 90 دقيقة`,
  151: `1. قارن النماذج على X_train فقط بخمس طيات\n2. استخدم \`scoring="average_precision"\`\n3. اختر المرشح قبل فتح الاختبار\n4. ارسم منحنى الدقة–الاستدعاء\n5. احسب الاستدعاء بين أعلى 20% من العملاء\n6. اعرض مصفوفة الالتباس واستخرج خمسة أخطاء`,
  152: `\`\`\`python\nmodels = {\n "انحدار لوجستي": LogisticRegression(max_iter=1000),\n "شجرة قرار": DecisionTreeClassifier(max_depth=4, random_state=42),\n "غابة عشوائية": RandomForestClassifier(n_estimators=150, random_state=42),\n "XGBoost": XGBClassifier(n_estimators=100, max_depth=3, eval_metric="logloss", random_state=42)\n}\n\`\`\``,
  153: `- ضع كل نموذج بعد \`preprocessor\` نفسه\n- استخدم \`cross_val_score(..., cv=5, scoring="average_precision")\`\n- سجّل المتوسط والانحراف في \`results_df\`\n- لا تستخدم الاختبار لترتيب النماذج`,
  154: `- درّب المرشح على كامل التدريب وافتح الاختبار مرة واحدة\n- احسب Average Precision ومنحنى Precision–Recall وRecall@20%\n- راجع خمسة عملاء أخطأ النموذج فيهم\n- **التسليم:** جدول مقارنة، رسم واحد، سبب الاختيار، وملاحظة عن خطأ متكرر`,
  168: `- **هدف المشروع:** ترتيب العملاء المحتمل مغادرتهم خلال 30 يومًا\n- **التطوير والتقييم:** \`manafeth_customers.parquet\`\n- **فحص التشغيل اللاحق:** \`shifted_month.parquet\` من دون هدف\n- **الناتج:** دفتر كامل ومقارنة وتقييم وتحليل أخطاء وفحص تغير التنبيهات`,
  169: `1. افتح \`final_project_manafeth_churn.ipynb\`\n2. اكتب بطاقة المشكلة ووحدة التنبؤ والقرار\n3. افحص الحجم والأنواع والنقص وتوازن الهدف\n4. صنف الأعمدة: آمنة، معرّف، وتسريب\n5. استبعد \`refund_issued\` و\`support_ticket_after_snapshot\` و\`next_month_orders\``,
  170: `- افصل \`churned_30d\` عن الخصائص\n- ارسم توزيع الهدف بعنوان ومحاور عربية\n- اكتب نسبة الفئة الإيجابية وماذا تعني للمقياس\n- لا يدخل الهدف أو المعرّف أو أعمدة المستقبل إلى X`,
  171: `- هل وحدة التنبؤ «عميل عند تاريخ لقطة»؟\n- هل الهدف \`churned_30d\` خارج X؟\n- هل الأعمدة المسرّبة الثلاثة مستبعدة؟\n- هل كتبت قرار المتابعة الذي سيستخدم ترتيب الاحتمالات؟`,
  176: `- المرشحون: Logistic Regression وRandom Forest وXGBoost\n- المقارنة: خمس طيات على التدريب فقط\n- المقياس: Average Precision\n- القرار التشغيلي: أعلى 20% من العملاء ترتيبًا\n- الاختبار يفتح مرة واحدة بعد توثيق الاختيار`,
  180: `- اختر المرشح من جدول Average Precision على التدريب\n- راعِ ثبات النتيجة وقابلية الفهم إذا كانت الفروق صغيرة\n- اكتب سبب الاختيار قبل فتح الاختبار\n- لا تختبر كل نموذج ثم تختار أفضل نتيجة اختبار`,
  181: `- احسب احتمالات الاختبار وAverage Precision\n- ارسم منحنى الدقة–الاستدعاء\n- احسب Recall@20%\n- اعرض مصفوفة الالتباس عند 0.50 للتعلم من أنواع الأخطاء`,
  182: `- اجمع خصائص الاختبار والحقيقة والاحتمال والتوقع\n- اعرض خمسة صفوف أخطأ النموذج فيها\n- صف النمط الذي تراه فقط؛ لا تدّعِ السببية\n- لا تنفذ تحليل أخطاء على الشهر اللاحق لأنه بلا هدف`,
  185: `1. أكمل بطاقة المشروع والاستكشاف\n2. ابنِ preprocessor وقارن النماذج\n3. قيّم المرشح وحلل الأخطاء\n4. استخرج عتبة أعلى 20% من احتمالات الاختبار\n5. طبّق النموذج على \`shifted_month.parquet\` بالخصائص الآمنة نفسها\n6. احسب نسبة المتجاوزين للعتبة دون ادعاء دقة`,
  186: `- الدفتر يعمل من أول خلية إلى آخرها\n- الأعمدة المسرّبة غير موجودة في X\n- المقارنة تمت على التدريب فقط\n- الاختبار قيّم مرة واحدة\n- لا توجد دقة أو استدعاء منسوبة إلى \`shifted_month.parquet\`\n- توجد ملاحظة تشغيلية عن تغير نسبة التنبيهات وخلاصة لا تبالغ`,
};

for (const slide of storyboardSlides) {
  if (labPriority[slide.number]) slide.visible = labPriority[slide.number];
}

function visualLayout(slide) {
  const probe = `${slide.title} ${slide.design}`;
  if (slide.number === 1 || /غلاف/.test(probe)) return "layout-cover";
  if (/مختبر|المشروع/.test(slide.title)) return "layout-lab";
  if (/كود|خلية|ما سيكتبه|ما سيشغله|أمر/.test(probe)) return "layout-code";
  if (/سؤال|نشاط|تصويت|تحقق|فحص سريع|اختبر/.test(probe)) return "layout-activity";
  if (/جدول|مصفوفة|مقارنة|عمودان/.test(probe)) return "layout-compare";
  if (/طريق|مسار أفقي|خط زمني|محطات|سير العمل|دائري|سهم|تدفق|خط المعالجة|Pipeline/.test(probe)) return "layout-flow";
  if (/بطاقات|شبكة|أيقونات|ثلاثة|أربعة|خمس|ست /.test(probe)) return "layout-cards";
  if (/رسم|مخطط|منحنى|نقاط|أعمدة/.test(probe)) return "layout-chart";
  return "layout-editorial";
}
const expandedDayTitles = [
  ["اليوم الأول: من السؤال إلى فهم البيانات", "أساسيات تعلم الآلة وصياغة المشكلة وفهم البيانات"],
  ["اليوم الثاني: تجهيز البيانات وصناعة الخصائص", "التنظيف والترميز والتحجيم وخطوط المعالجة"],
  ["اليوم الثالث: تدريب التصنيف والانحدار", "من البيانات المجهزة إلى أول توقعات قابلة للفحص"],
  ["اليوم الرابع: التقييم والنماذج الشجرية", "المقاييس والتحقق المتقاطع وتحليل الأخطاء"],
  ["اليوم الخامس: المشروع المتكامل", "مشروع منافذ من الصياغة إلى العرض وفحص تغير التشغيل"],
];
for (let day = 1; day <= 5; day++) {
  [decks[day - 1].title, decks[day - 1].sub] = expandedDayTitles[day - 1];
  decks[day - 1].slides = storyboardSlides.filter(s => s.day === day).map(s => {
    const body = storyboardMarkdown(s.visible);
    if (s.number === 1) return `<section id="title-slide" data-background-image="slides_template/slides_template/assets/anim.svg" data-background-opacity="0.3" data-background-size="cover" class="quarto-title-block center story-cover layout-cover"><h1 class="title">${s.title}</h1><div class="story-cover-body">${body}</div></section>`;
    return content(s.title, `<div class="story-number">${String(s.number).padStart(2,"0")}</div><div class="story-content">${body}</div>`, `storyboard-slide ${visualLayout(s)}`);
  });
}

function render(deck){
 const all = deck.slides.join("\n");
 let base = fs.readFileSync(revealTemplatePath, "utf8")
   .replaceAll("Image_Foundations_files", "reveal_files")
   .replaceAll("أساسيات الصور الرقمية", deck.title)
   .replaceAll("كيف تدرك أجهزة الكمبيوتر الصور", deck.sub);
 const courseCss = `<style>
.reveal .image-story{display:grid;grid-template-columns:.82fr 1.18fr;gap:1.2em;align-items:stretch;height:500px}.reveal .image-story img{width:100%;height:100%;object-fit:cover;border-radius:20px;box-shadow:0 18px 50px rgba(28,53,94,.14)}.reveal .story-copy{display:flex;flex-direction:column;justify-content:center;padding:.5em}.reveal .story-copy h3{font-size:1.55em;line-height:1.3;color:#1C355E;margin:.2em 0 .55em}.reveal .story-copy p{color:#5c687a}.reveal .eyebrow{font:700 .62em Arial!important;letter-spacing:.18em;color:#00AE8D!important}.reveal .outcome-grid{display:grid;grid-template-columns:1fr 1fr;gap:.8em}.reveal .outcome{display:grid;grid-template-columns:56px 1fr;align-items:center;background:#f6f3ff;border-radius:16px;padding:.75em}.reveal .outcome span{font:800 1.1em Arial;color:#7b61c9}.reveal .outcome p{margin:0;font-weight:700;color:#1C355E}.reveal .teaching-contract{background:#1C355E;color:#fff;border-radius:14px;padding:.7em 1em;margin-top:.9em;text-align:center}.reveal .concept-layout{display:grid;grid-template-columns:1.15fr .85fr;gap:1.3em;align-items:stretch}.reveal .lead-copy{font-size:1.25em;line-height:1.6;color:#1C355E;margin:.25em 0 .8em}.reveal .manafeth-example{border-right:6px solid #00AE8D;background:#f7f9fc;border-radius:12px;padding:.75em 1em}.reveal .manafeth-example b{color:#00806b}.reveal .manafeth-example p{margin:.2em 0}.reveal .concept-art{min-height:340px;background:linear-gradient(145deg,#1C355E,#57448f);border-radius:24px;display:grid;place-items:center;color:#fff;overflow:hidden}.reveal .orbit{width:235px;height:235px;border:2px solid rgba(255,255,255,.45);border-radius:50%;display:grid;place-items:center;position:relative;text-align:center}.reveal .orbit:before,.reveal .orbit:after{content:'';position:absolute;border-radius:50%;border:1px solid rgba(102,224,194,.7)}.reveal .orbit:before{inset:24px}.reveal .orbit:after{inset:52px}.reveal .orbit i{position:absolute;top:-18px;background:#66e0c2;color:#1C355E;padding:.3em .55em;border-radius:20px;font:800 .8em Arial}.reveal .orbit b{z-index:2;width:150px;font-size:.86em}.reveal .signal{display:flex;align-items:end;gap:16px;height:220px}.reveal .signal span{width:34px;border-radius:9px 9px 0 0;background:#66e0c2}.reveal .signal span:nth-child(1){height:38%}.reveal .signal span:nth-child(2){height:72%}.reveal .signal span:nth-child(3){height:52%}.reveal .signal span:nth-child(4){height:94%}.reveal .signal span:nth-child(5){height:66%}.reveal .steps-art{display:flex;align-items:center;gap:.45em;font-size:.78em}.reveal .steps-art span{padding:1em .75em;border:1px solid rgba(255,255,255,.55);border-radius:50%;background:rgba(255,255,255,.1)}.reveal .steps-art i{color:#66e0c2}.reveal .worked{display:grid;gap:.8em}.reveal .worked-head{display:grid;grid-template-columns:58px 1fr 58px 1fr 58px 1fr;gap:.4em;align-items:center;background:#f7f9fc;border-radius:18px;padding:1em}.reveal .worked-head span{display:grid;place-items:center;width:50px;height:50px;border-radius:50%;background:#1C355E;color:#fff;font:800 .75em Arial}.reveal .worked-head p{margin:0;font-weight:700;font-size:.82em}.reveal .checkpoint{background:linear-gradient(135deg,#ede8ff,#f8f6ff);border-right:7px solid #7b61c9;border-radius:14px;padding:.75em 1em}.reveal .checkpoint b{color:#1C355E}.reveal .checkpoint p{margin:.25em 0 0;color:#5d4a96}
.reveal .big-prompt{background:#1C355E;color:#fff;border-radius:24px;padding:1.4em;text-align:center}.reveal .big-prompt span{color:#66e0c2}.reveal .big-prompt h3{font-size:1.75em;margin:.25em}.reveal .day-plan{display:grid;grid-template-columns:repeat(5,1fr);gap:.55em}.reveal .day-plan div{background:#f5f6fa;border-radius:16px;padding:1em .5em;text-align:center}.reveal .day-plan b,.reveal .day-plan span{display:block}.reveal .day-plan b{color:#7b61c9;font-size:1.25em}.reveal .day-plan .accent{background:#1C355E;color:#fff}.reveal .definition-slide{display:grid;grid-template-columns:.36fr 1.64fr;gap:1em;align-items:center}.reveal .definition-mark{width:210px;height:210px;border-radius:50%;display:grid;place-items:center;background:#1C355E;color:#fff;font:900 2.2em Arial;box-shadow:0 0 0 18px #edf1f6}.reveal .definition-mark.ml{background:#00AE8D}.reveal .definition-mark.dl{background:#7b61c9}.reveal .definition-mark.gen{font-size:1.3em;background:linear-gradient(135deg,#1C355E,#7b61c9)}.reveal .definition-slide h3{font-size:1.45em;line-height:1.5;margin:.2em 0}.reveal .note-line{border-right:6px solid #00AE8D;background:#f6f8fb;padding:.65em;border-radius:10px}.reveal .io-diagram,.reveal .learning-loop{display:flex;align-items:center;justify-content:center;gap:.65em}.reveal .io-diagram div,.reveal .learning-loop div{background:#f5f6fa;border:2px solid #dbe2ea;border-radius:18px;padding:1em;min-width:210px;text-align:center}.reveal .io-diagram span,.reveal .io-diagram b,.reveal .learning-loop b,.reveal .learning-loop span{display:block}.reveal .brain-node{border-color:#7b61c9!important;background:#f2eeff!important}.reveal .center-note{text-align:center;background:#f6f8fb;border-radius:12px;padding:.6em;margin-top:1em!important}.reveal .example-grid,.reveal .term-grid,.reveal .quiz-cases{display:grid;grid-template-columns:1fr 1fr;gap:.7em}.reveal .example-grid div,.reveal .term-grid div,.reveal .quiz-cases div{background:#f6f7fb;border-radius:16px;padding:.8em}.reveal .example-grid span{font-size:1.8em;float:left}.reveal .example-grid p,.reveal .term-grid p{margin:.2em 0}.reveal .compare-clean,.reveal .two-paths,.reveal .balance{display:grid;grid-template-columns:1fr 1fr;gap:1em}.reveal .compare-clean>div,.reveal .two-paths>div,.reveal .balance>div{border:2px solid #dbe2ea;border-radius:18px;padding:1em}.reveal .tag{display:inline-block;background:#dff7ef;color:#007c67;border-radius:20px;padding:.25em .7em}.reveal .tag.purple{background:#eee9ff;color:#6848b5}.reveal .rule,.reveal .output-chip{background:#1C355E;color:#fff;border-radius:10px;padding:.55em;margin-top:.7em}.reveal .capability-row{display:grid;grid-template-columns:repeat(5,1fr);gap:.5em}.reveal .capability-row div{min-height:210px;background:linear-gradient(180deg,#1C355E,#3e4d81);color:#fff;border-radius:16px;display:flex;flex-direction:column;justify-content:center;text-align:center;padding:.5em}.reveal .capability-row span{color:#66e0c2;font-size:.7em}.reveal .nested-map{display:grid;place-items:center;height:510px}.reveal .ai-ring,.reveal .ml-ring,.reveal .dl-ring,.reveal .gen-ring{border-radius:50%;display:grid;place-items:center;text-align:center}.reveal .ai-ring{width:500px;height:500px;background:#e8edf5;color:#1C355E}.reveal .ml-ring{width:390px;height:390px;background:#d8f3eb}.reveal .dl-ring{width:280px;height:280px;background:#e8e1fb}.reveal .gen-ring{width:170px;height:170px;background:#1C355E;color:#fff}.reveal .nested-map small{display:block;font-size:.48em;font-weight:400}.reveal .concept-table{width:100%;border-collapse:separate;border-spacing:0 .3em}.reveal .concept-table th{background:#1C355E;color:#fff}.reveal .concept-table th,.reveal .concept-table td{padding:.55em;border:0;text-align:right}.reveal .concept-table td{background:#f6f7fb}.reveal .formula{display:flex;gap:.4em;align-items:center;justify-content:center}.reveal .formula span{background:#f0edfa;padding:.6em;border-radius:10px}.reveal .neural{display:flex;justify-content:center;align-items:center;gap:1.1em}.reveal .layer{display:grid;gap:.35em;place-items:center}.reveal .layer span{width:46px;height:46px;border-radius:50%;background:#00AE8D}.reveal .layer.hidden span{background:#7b61c9}.reveal .layer.output span{background:#1C355E}.reveal .layer label{font-size:.65em}.reveal .three-learning{display:grid;grid-template-columns:repeat(3,1fr);gap:.8em}.reveal .three-learning div{background:#f6f7fb;border-top:7px solid #00AE8D;border-radius:16px;padding:1em;min-height:245px}.reveal .three-learning span{color:#7b61c9;font:800 1.3em Arial}.reveal .supervised-demo{display:flex;align-items:center;justify-content:center;gap:.45em}.reveal .sample,.reveal .model-chip{padding:.75em;background:#f5f6fa;border-radius:14px;text-align:center}.reveal .sample b,.reveal .sample span{display:block}.reveal .model-chip{background:#1C355E;color:#fff}.reveal .task-card{display:grid;grid-template-columns:.55fr 1.45fr;gap:1em;align-items:center}.reveal .task-symbol{height:300px;border-radius:24px;background:#7b61c9;color:#fff;display:grid;place-items:center;font:900 2.2em Arial}.reveal .chart-symbol{background:#00AE8D}.reveal .cluster-demo{height:360px;position:relative;background:#f6f7fb;border-radius:20px}.reveal .dots{position:absolute;font-size:2.2em;letter-spacing:.25em}.reveal .group-a{right:12%;top:15%;color:#00AE8D}.reveal .group-b{left:15%;top:23%;color:#7b61c9}.reveal .group-c{right:35%;bottom:12%;color:#1C355E}.reveal .under-visual{text-align:center}.reveal .rl-loop{display:flex;align-items:center;justify-content:center;gap:1em}.reveal .rl-loop div{width:250px;height:180px;border-radius:50%;background:#1C355E;color:#fff;display:grid;place-items:center;text-align:center}.reveal .lifecycle{display:grid;grid-template-columns:repeat(6,1fr);gap:.4em}.reveal .lifecycle div{background:#f6f7fb;border-radius:14px;padding:.8em .35em;text-align:center}.reveal .lifecycle b,.reveal .lifecycle span{display:block}.reveal .lifecycle b{color:#00AE8D}.reveal .myths{display:grid;grid-template-columns:repeat(3,1fr);gap:.8em}.reveal .myths div{background:#fff5ea;border-top:7px solid #ffb548;border-radius:16px;padding:1em}.reveal .lab-transition{background:linear-gradient(135deg,#1C355E,#514080);color:#fff;border-radius:24px;padding:1.4em;text-align:center}.reveal .lab-transition b{color:#66e0c2}.reveal .lab-transition h3{font-size:1.5em}.reveal .recap-map{display:flex;align-items:center;gap:.45em}.reveal .recap-map span{flex:1;background:#f0edfa;border-radius:12px;padding:.8em;text-align:center}.reveal .final-check{background:#1C355E;color:#fff;border-radius:14px;padding:.8em;text-align:center;margin-top:1em}.reveal .yes{color:#007c67;font-weight:800}.reveal .no{color:#b23a48;font-weight:800}
.reveal .storyboard-slide .course-body{position:relative;font-size:.75em;line-height:1.34}.reveal .story-number{position:absolute;left:0;top:-62px;color:#00AE8D;font:800 .7em Arial;letter-spacing:.12em}.reveal .story-content{max-width:1180px;margin:auto}.reveal .story-content>p{background:#f6f7fb;border-right:5px solid #00AE8D;border-radius:10px;padding:.5em .7em;margin:.28em 0}.reveal .story-content>p:first-child{font-size:1.04em;color:#1C355E}.reveal .story-list{display:grid;grid-template-columns:1fr 1fr;gap:.36em .6em;margin:.2em 0!important;padding:0!important;list-style:none}.reveal .story-list li{background:#f5f6fa;border-radius:12px;padding:.46em .62em;margin:0!important;position:relative}.reveal .story-list li:before{content:'✓';color:#00AE8D;font-weight:900;margin-left:.4em}.reveal .story-list.numbered{counter-reset:step}.reveal .story-list.numbered li:before{counter-increment:step;content:counter(step,decimal-leading-zero);display:inline-grid;place-items:center;background:#1C355E;color:#fff;border-radius:50%;width:30px;height:30px;font:700 .52em Arial}.reveal .story-table{width:100%;border-collapse:separate;border-spacing:0 .18em;font-size:.74em}.reveal .story-table th{background:#1C355E;color:#fff}.reveal .story-table td{background:#f5f6fa}.reveal .story-table th,.reveal .story-table td{padding:.42em .55em;text-align:right;border:0}.reveal .story-code{direction:ltr;text-align:left;background:#121b32;color:#eef5ff;border-radius:14px;padding:.65em .9em;font:0.58em/1.42 monospace;margin:.35em 0;box-shadow:none}.reveal .story-cover-body{max-width:900px;margin:1em auto 0}.reveal .story-cover-body .story-list{grid-template-columns:1fr}.reveal .story-cover-body p,.reveal .story-cover-body li{font-size:.7em}.reveal .story-cover-body li{background:rgba(255,255,255,.82)}.reveal .story-cover .title{font-size:1.65em!important}.reveal code{background:#edf0f6;color:#1C355E;padding:.08em .25em;border-radius:5px}
/* Layouts are selected from each slide's own visual-design brief. */
.reveal .layout-editorial .story-content{display:grid;grid-template-columns:1.18fr .82fr;gap:.9em;align-items:center}.reveal .layout-editorial .story-list{grid-template-columns:1fr}.reveal .layout-editorial .story-list li{background:transparent;border-bottom:1px solid #dfe5ec;border-radius:0;padding:.52em .15em}.reveal .layout-editorial .story-list li:first-child{font-size:1.18em;color:#1C355E;border-bottom:4px solid #00AE8D}.reveal .layout-editorial .story-content>p{background:transparent;border:0;padding:.25em 0}.reveal .layout-cards .story-list{grid-template-columns:repeat(3,1fr);gap:.72em}.reveal .layout-cards .story-list li{min-height:145px;padding:1em;border:1px solid #e1e6ed;border-radius:18px;background:linear-gradient(155deg,#fff,#f3f5fa);box-shadow:0 12px 30px rgba(28,53,94,.07);display:flex;align-items:center}.reveal .layout-cards .story-list li:before{display:grid;place-items:center;min-width:32px;height:32px;border-radius:50%;background:#daf6ed}.reveal .layout-flow .story-list{display:flex;gap:.3em;align-items:stretch;counter-reset:flow}.reveal .layout-flow .story-list li{flex:1;min-height:190px;background:#fff;border:2px solid #dfe5ec;border-radius:16px;padding:1em .55em;display:flex;flex-direction:column;justify-content:center;text-align:center}.reveal .layout-flow .story-list li:before{counter-increment:flow;content:counter(flow,decimal-leading-zero);display:block;color:#00AE8D;font:800 1.35em Arial;margin:0 0 .35em}.reveal .layout-flow .story-list li:not(:last-child):after{content:'←';position:absolute;left:-.52em;top:42%;color:#7b61c9;font-size:1.25em;z-index:2}.reveal .layout-compare .story-table{font-size:.82em;border-spacing:0}.reveal .layout-compare .story-table th{padding:.8em;background:#1C355E}.reveal .layout-compare .story-table td{padding:.7em;border-bottom:1px solid #dde3eb}.reveal .layout-compare .story-table tr:nth-child(even) td{background:#eef8f5}.reveal .layout-compare .story-list{grid-template-columns:1fr 1fr}.reveal .layout-compare .story-list li{min-height:112px;border-right:7px solid #7b61c9;background:#f6f3ff}.reveal .layout-code .story-content{display:grid;grid-template-columns:.72fr 1.28fr;gap:.8em;align-items:center}.reveal .layout-code .story-code{grid-column:2;grid-row:1 / span 4;margin:0;padding:1.15em;border-radius:20px;background:#131a31;color:#f2f5fa;unicode-bidi:plaintext;box-shadow:0 18px 45px rgba(19,26,49,.18)}.reveal .layout-code .story-list,.reveal .layout-code .story-content>p{grid-column:1}.reveal .layout-code .story-list{grid-template-columns:1fr}.reveal .layout-code .story-list li{background:transparent;border-right:5px solid #00AE8D;border-radius:0}.reveal .layout-activity:before{content:'نشاط';position:absolute;left:8%;top:18%;background:#00AE8D;color:#fff;padding:.25em .8em;border-radius:40px;font:800 .45em Arial;letter-spacing:.14em}.reveal .layout-activity .story-content{background:linear-gradient(135deg,#1C355E,#34306e);color:#fff;border-radius:25px;padding:1.1em 1.2em}.reveal .layout-activity .story-list{grid-template-columns:1fr}.reveal .layout-activity .story-list li,.reveal .layout-activity .story-content>p{background:transparent;color:#fff;border:0;border-bottom:1px solid rgba(255,255,255,.18);border-radius:0}.reveal .layout-activity .story-list li:before{content:'؟';color:#66e0c2}.reveal .layout-lab h2{background:#1C355E;color:#fff!important;border:0!important;margin-right:-2.2em!important;margin-left:-2.2em!important;padding:.3em 2.2em!important}.reveal .layout-lab .story-number{color:#66e0c2}.reveal .layout-lab .story-list li{background:#eef8f5;border-right:5px solid #00AE8D}.reveal .layout-lab .story-code{background:#121a2e;border-radius:18px;unicode-bidi:plaintext}.reveal .layout-chart .story-content{position:relative;padding-bottom:230px}.reveal .layout-chart .story-content:after{content:'';position:absolute;right:8%;left:8%;bottom:10px;height:190px;background:linear-gradient(to top,rgba(28,53,94,.08) 1px,transparent 1px) 0 0/100% 25%,linear-gradient(90deg,#00AE8D 0 13%,transparent 13% 18%,#7b61c9 18% 38%,transparent 38% 43%,#1C355E 43% 72%,transparent 72% 77%,#ffb548 77% 94%,transparent 94%);border-right:2px solid #1C355E;border-bottom:2px solid #1C355E;opacity:.9}.reveal .layout-chart .story-list{grid-template-columns:repeat(2,1fr)}
</style>`;
 base = base.replace("</head>", `${courseCss}</head>`);
 const pattern = /<div class="slides">[\s\S]*?<\/div>\s*<\/div>\s*<script/;
 base = base.replace(pattern, `<div class="slides">${all}</div>\n  </div>\n  <script`);
 return base;
}

for (const deck of decks) fs.writeFileSync(path.join(outDir, deck.file), render(deck));

const cards = decks.map((d,i)=>{
 const colabBase = "https://colab.research.google.com/github/hanenalmayouf/Applied_Machine_Learning_Arabic/blob/main/labs";
 const labFiles = [
   "lab_1_manafeth_leakage.ipynb",
   "lab_2_manafeth_preprocessing.ipynb",
   "lab_3_manafeth_models.ipynb",
   "lab_4_manafeth_evaluation.ipynb",
   "final_project_manafeth_churn.ipynb",
 ];
 const labs = `<a class="btn btn-lab" target="_blank" href="${colabBase}/day${i+1}/${labFiles[i]}">🧪 ${i===4 ? "فتح المشروع في Colab" : "فتح مختبر منافذ"}</a>`;
 return `<div class="card"><span class="badge">اليوم ${i+1}</span><h3>${i+1}. ${d.title.replace(/^اليوم [^:]+:\s*/,"")}</h3><p>${d.sub}</p><div class="btn-group"><a class="btn btn-slides" href="slides/${d.file}">🎥 عرض المحاضرة</a>${labs}</div></div>`;
}).join("\n");

const index = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>أسس تعلم الآلة التطبيقي - SDAIA</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap" rel="stylesheet"><style>
body{font-family:'Inter',sans-serif;background:#f0f4f8;margin:0;padding:0;color:#1C355E}header{background:linear-gradient(135deg,#1C355E,#00C9A7);color:white;padding:4rem 1rem;text-align:center;box-shadow:0 4px 15px rgba(0,0,0,.1)}.container{max-width:1200px;margin:2rem auto;padding:1rem}h1{margin:0;font-size:2.8rem;font-weight:800}.section-title{margin:3rem 0 2rem;color:#1C355E;text-align:center;font-size:2.2rem;font-weight:800}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:2.5rem}.card{background:white;border-radius:24px;padding:2.5rem;transition:.4s cubic-bezier(.175,.885,.32,1.275);box-shadow:0 10px 30px rgba(0,0,0,.05);border:1px solid #eef2f7;display:flex;flex-direction:column}.card:hover{transform:translateY(-10px);box-shadow:0 20px 40px rgba(0,0,0,.1);border-color:#00C9A7}.card h3{margin:0 0 1rem;color:#1C355E;font-size:1.5rem;font-weight:800}.card p{margin:0 0 2.5rem;font-size:1rem;color:#546e7a;line-height:1.6;flex-grow:1}.badge{display:inline-block;padding:6px 14px;border-radius:12px;font-size:.8rem;font-weight:700;margin-bottom:1.2rem;background:#e0f2f1;color:#00796b;width:fit-content}.btn-group{display:flex;gap:12px;flex-wrap:wrap}.btn{flex:1;min-width:120px;text-align:center;padding:14px 16px;border-radius:15px;font-weight:700;text-decoration:none;font-size:.92rem;transition:.3s;display:flex;align-items:center;justify-content:center;gap:8px}.btn-slides{background:#1C355E;color:white}.btn-slides:hover{background:#2c5282}.btn-lab{background:#00C9A7;color:white}.btn-lab:hover{background:#00a88b}.footer{text-align:center;padding:4rem 2rem;color:#94a3b8;font-size:.9rem;border-top:1px solid #e2e8f0;margin-top:4rem}img.logo{width:140px;margin-bottom:1.5rem}header p{font-size:1rem} @media(max-width:600px){h1{font-size:2rem}.grid{grid-template-columns:1fr}.card{padding:1.7rem}}
</style></head><body><header><img src="slides/slides_template/assets/sdaia.svg" alt="SDAIA" class="logo"><h1>منهج تعلم الآلة التطبيقي</h1><p>مسار عملي لبناء النماذج باستخدام Python و scikit-learn</p></header><div class="container"><h2 class="section-title">خارطة الطريق التعليمية 🗺️</h2><div class="grid">${cards}</div></div><div class="footer">© 2026 جميع الحقوق محفوظة لـ سدايا (SDAIA)<br>منهج تعلم الآلة التطبيقي المطور لتمكين الكوادر الوطنية.</div></body></html>`;
fs.writeFileSync(path.join(root,"docs","index.html"),index);
console.log(`Built ${decks.length} chapter decks and course index.`);
