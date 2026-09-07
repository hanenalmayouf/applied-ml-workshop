<div dir="rtl">

# اليوم الثالث — تصنيف مغادرة العملاء وانحدار سعر المركبة

هذه الحزمة جاهزة للاستخدام في **Google Colab** أو في Jupyter محليًا — تحتوي على كل ما يحتاجه اليوم من دفاتر وبيانات.

## افتح مباشرة في Google Colab (زر واحد، بلا رفع يدوي)

[![Open In Colab — دفتر الطالب](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/hanenalmayouf/applied-ml-workshop/blob/main/labs_colab/day3/lab_3_manafeth_models.ipynb)  **دفتر الطالب** (فيه TODO)

[![Open In Colab — دفتر الحل](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/hanenalmayouf/applied-ml-workshop/blob/main/labs_colab/day3/lab_3_manafeth_models_solution.ipynb)  **دفتر الحل الكامل**

عند فتح الدفتر من الزر أعلاه، ستجد نفس زر "Open in Colab" في أول خلية داخل الدفتر أيضًا — البيانات تُحمَّل تلقائيًا من المستودع نفسه، بلا أي رفع يدوي.

## محتوى الحزمة (نسخة محلية)

| الملف | الوصف |
|---|---|
| `lab_3_manafeth_models.ipynb` | **دفتر الطالب** — يحتوي على خلايا TODO يكملها الطالب بنفسه، بالإضافة إلى خلايا «فكّر أولًا» و«مساعدة» ورسومات جاهزة. هذا هو الملف الذي يُوزَّع على المتدربين. |
| `lab_3_manafeth_models_solution.ipynb` | **دفتر الحل الكامل** — نفس الدفتر لكن بكل الخلايا مكتملة ومُنفَّذة، للمدرب أو للمراجعة بعد التسليم. |
| `manafeth_data_package/` | مجلد البيانات: manafeth_customers.parquet + markabat_listings_sample.csv (2,000 إعلان) + data_dictionary.md |
| `manafeth_data_package.zip` | نسخة مضغوطة من مجلد البيانات، لاستخدامها فقط إذا فتحت الدفتر برفع يدوي بدل زر Colab أعلاه. |

## كيف تشغّل الدفتر

### الخيار 1 — زر "Open in Colab" أعلاه (الأسهل، موصى به)

اضغطي الزر، سجّلي الدخول بحساب Google إن لزم، ثم شغّلي الخلايا بالترتيب — البيانات تُحمَّل تلقائيًا من نفس المستودع على GitHub.

### الخيار 2 — رفع يدوي في Colab

1. اذهبي إلى [colab.research.google.com](https://colab.research.google.com) وسجّلي الدخول.
2. من القائمة `File → Upload notebook`، ارفعي `lab_3_manafeth_models.ipynb`.
3. شغّلي الخلية الأولى (خلية إعداد البيانات). إذا لم يجد الدفتر مجلد البيانات تلقائيًا، ستظهر أداة رفع ملفات — اختاري عندها `manafeth_data_package.zip` المرفق مع هذه الحزمة.

### الخيار 3 — محليًا (Jupyter / VS Code)

ضعي مجلد `manafeth_data_package/` بجانب ملف الدفتر مباشرة (كما هو مرتّب في هذه الحزمة) وشغّلي الدفتر بواسطة Jupyter أو VS Code.

## قبل أن تبدأ

راجعي ملف `00_start_here.md` في جذر المستودع لمعرفة طريقة استخدام خلايا **فكّر أولًا** و**TODO** و**مساعدة** في هذه الدفاتر. لا تنتقلي إلى دفتر الحل إلا بعد محاولة حل كل TODO بنفسك.

</div>
