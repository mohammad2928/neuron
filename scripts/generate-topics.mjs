import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @typedef {'fa'|'ar'|'en'|'ku'} Locale */

/**
 * @param {string} fa
 * @param {string} ar
 * @param {string} en
 * @param {string} ku
 */
const L = (fa, ar, en, ku) => ({ fa, ar, en, ku })

const categories = [
  {
    id: 'foundations',
    title: L('مبانی یادگیری ماشین', 'أساسيات تعلم الآلة', 'ML Foundations', 'بنەماکانی فێربوونی ماشین'),
  },
  {
    id: 'neural-nets',
    title: L('شبکه‌های عصبی', 'الشبكات العصبية', 'Neural Networks', 'تۆڕە دەمارییەکان'),
  },
  {
    id: 'nlp-basics',
    title: L('مبانی NLP', 'أساسيات معالجة اللغة', 'NLP Basics', 'بنەماکانی NLP'),
  },
  {
    id: 'embeddings',
    title: L('بازنمایی و Embedding', 'التمثيلات والتضمين', 'Embeddings', 'نوێنەرایەتی و Embedding'),
  },
  {
    id: 'sequences',
    title: L('مدل‌های ترتیبی', 'نماذج التسلسل', 'Sequence Models', 'مۆدێلە زنجیرەییەکان'),
  },
  {
    id: 'attention',
    title: L('معماری Transformer', 'بنية المحوّل (Transformer)', 'Transformer Architecture', 'تەلارسازی Transformer'),
  },
  {
    id: 'llms',
    title: L('مدل‌های زبانی بزرگ', 'النماذج اللغوية الكبيرة', 'Large Language Models', 'مۆدێلە زمانی گەورەکان'),
  },
  {
    id: 'tokenization',
    title: L('توکن‌سازی', 'التقطيع إلى رموز', 'Tokenization', 'تۆکنکردن'),
  },
  {
    id: 'training',
    title: L('آموزش و بهینه‌سازی', 'التدريب والتحسين', 'Training & Optimization', 'ڕاهێنان و باشترکردن'),
  },
  {
    id: 'generation',
    title: L('تولید و Decoding', 'التوليد وفك الترميز', 'Generation & Decoding', 'بەرهەمهێنان و Decoding'),
  },
  {
    id: 'finetuning',
    title: L('Fine-tuning و Alignment', 'الضبط الدقيق والمحاذاة', 'Fine-tuning & Alignment', 'Fine-tuning و Alignment'),
  },
  {
    id: 'eval-safety',
    title: L('ارزیابی و ایمنی', 'التقييم والسلامة', 'Evaluation & Safety', 'هەڵسەنگاندن و سەلامەتی'),
  },
  {
    id: 'architectures',
    title: L('معماری‌های پیشرفته', 'بنى متقدمة', 'Advanced Architectures', 'تەلارسازی پێشکەوتوو'),
  },
  {
    id: 'engineering',
    title: L('مهندسی و استقرار', 'الهندسة والنشر', 'Engineering & Serving', 'ئەندازیاری و بڵاوکردنەوە'),
  },
  {
    id: 'classic-ml',
    title: L('مدل‌های کلاسیک ML', 'نماذج تعلم الآلة الكلاسيكية', 'Classic ML Models', 'مۆدێلە کلاسیکییەکانی ML'),
  },
  {
    id: 'dl-history',
    title: L('تاریخچه یادگیری عمیق', 'تاريخ التعلم العميق', 'Deep Learning History', 'مێژووی فێربوونی قووڵ'),
  },
  {
    id: 'modern-llms',
    title: L('LLMهای امروزی', 'نماذج اللغة الحديثة', 'Modern LLMs', 'LLMەکانی ئەمڕۆ'),
  },
]

/** @type {Array<any>} */
const topics = []

function expandDeep(base, faExtra, arExtra, enExtra, kuExtra) {
  return L(
    `${base.fa}\n\n${faExtra}`,
    `${base.ar}\n\n${arExtra}`,
    `${base.en}\n\n${enExtra}`,
    `${base.ku}\n\n${kuExtra}`,
  )
}

/** Real formulas + math notes by topic id (or keyword fallback later) */
const formulaBank = {
  'what-is-ml': ['ŷ = f_θ(x)', 'مدل تابعی با پارامتر θ است که از x به پیش‌بینی ŷ می‌رود.'],
  'loss-functions': ['L(θ) = (1/N) Σ ℓ(y_i, f_θ(x_i))', 'زیان میانگین خطای پیش‌بینی روی دادهٔ آموزش است.'],
  'gradient-descent': ['θ ← θ - η ∇_θ L(θ)', 'η نرخ یادگیری است؛ گرادیان جهت تندترین افزایش زیان را نشان می‌دهد، پس خلافش می‌رویم.'],
  regularization: ['L_reg = L + λ ||θ||²', 'λ میزان جریمهٔ پیچیدگی وزن‌ها را تعیین می‌کند.'],
  backprop: ['δ = ∂L/∂z  ,  ∂L/∂W = δ xᵀ', 'خطا از خروجی به عقب پخش می‌شود تا مشتق هر وزن به دست آید.'],
  qkv: ['Q=XW_Q , K=XW_K , V=XW_V', 'از هر توکن سه نقش ساخته می‌شود: پرسش، کلید، ارزش.'],
  'dot-product-attn': ['score(q,k)=q·k', 'ضرب داخلی یعنی چقدر دو بردار هم‌جهت‌اند.'],
  'softmax-attn': ['α_i = e^{z_i} / Σ_j e^{z_j}', 'Softmax امتیاز خام را به احتمال مثبت با جمع ۱ تبدیل می‌کند.'],
  'scaled-dot': ['Attention(Q,K,V)=softmax(QKᵀ/√d_k)V', '√d_k جلوی بزرگ شدن بیش از حد امتیازها را می‌گیرد.'],
  'multi-head': ['MultiHead=Concat(head_1..head_h)W_O', 'چند سر موازی در زیرفضاهای مختلف نگاه می‌کنند.'],
  positional: ['PE(pos,2i)=sin(pos/10000^{2i/d})', 'سیگنال مکان روی embedding اضافه می‌شود چون Attention ترتیب را خودش ندارد.'],
  similarity: ['cos(a,b)=(a·b)/(||a|| ||b||)', 'شباهت کسینوسی فقط به زاویه اهمیت می‌دهد نه طول بردار.'],
  perplexity: ['PPL = exp(- (1/N) Σ log p(w_i|context))', 'هرچه مدل مطمئن‌تر باشد، perplexity معمولاً کمتر است.'],
  'cross-entropy': ['CE = - Σ y log ŷ', 'اگر برچسب درست احتمال کمی بگیرد، جریمه بزرگ می‌شود.'],
  sampling: ['p\'_i ∝ exp(logit_i / T)', 'T بزرگ توزیع را صاف می‌کند؛ T کوچک آن را تیز.'],
  'top-k-p': ['V_p = کوچک‌ترین مجموعه با Σp ≥ p', 'Nucleus فقط توکن‌هایی را نگه می‌دارد که جرم احتمال کافی بسازند.'],
  lora: ['W\' = W + BA', 'B و A کم‌رتبه‌اند؛ W اصلی معمولاً فریز می‌ماند.'],
  svm: ['min (1/2)||w||² + C Σ ξ', 'حاشیه را بزرگ و خطای طبقه‌بندی را کنترل می‌کنیم.'],
  'linear-regression': ['ŷ = wᵀx + b', 'خطی‌ترین مدل: وزن‌ها ضرب ویژگی‌ها به‌علاوه بایاس.'],
  'logistic-regression': ['p = σ(wᵀx+b) = 1/(1+e^{-z})', 'خروجی بین ۰ و ۱ برای احتمال کلاس.'],
  word2vec: ['P(context|center) ≈ softmax(v_c · v_o)', 'کلمات هم‌بافت، بردار نزدیک می‌گیرند.'],
  'how-gpt-works': ['P(x_t | x_<t) = softmax(W h_t)', 'در هر قدم، فقط توکن بعدی از روی گذشته پیش‌بینی می‌شود.'],
}

function bankFormula(id) {
  const hit = formulaBank[id]
  if (!hit) return null
  return {
    formula: L(hit[0], hit[0], hit[0], hit[0]),
    math: L(
      `ریاضیات این موضوع:\nفرمول اصلی: ${hit[0]}\n${hit[1]}\nهر نماد را جدا بخوان: اول بفهم ورودی چیست، بعد عملگر چیست، بعد خروجی چیست.`,
      `رياضيات هذا الموضوع:\nالصيغة: ${hit[0]}\n${hit[1]}\nافهم المدخل ثم العملية ثم الناتج.`,
      `Math for this topic:\nFormula: ${hit[0]}\n${hit[1]}\nRead symbols in order: input → operator → output.`,
      `بیرکاری ئەم بابەتە:\nفۆرمولا: ${hit[0]}\n${hit[1]}\nسەرەتا input، پاشان ئۆپەرەیتەر، پاشان output.`,
    ),
  }
}

function pickInteractive(id, category) {
  if (id.includes('softmax') || id.includes('attention') || id.includes('scaled')) return 'softmax'
  if (id.includes('temp') || id.includes('sampling') || id.includes('top-')) return 'temperature'
  if (id.includes('lr') || id.includes('gradient') || id.includes('optim')) return 'learning-rate'
  if (category === 'attention' || category === 'modern-llms') return 'attention-focus'
  return 'quiz'
}

function add(topic) {
  const concepts = (topic.concepts || []).join('، ')
  const deepFa = topic.deepDive.fa
  const deepAr = topic.deepDive.ar
  const deepEn = topic.deepDive.en
  const deepKu = topic.deepDive.ku
  const bank = bankFormula(topic.id)

  topic.narration =
    topic.narration ??
    L(
      `در این درس «${topic.title.fa}» را از تعریف تا کاربرد و محدودیت می‌خوانیم.`,
      `نقرأ «${topic.title.ar}» من التعريف إلى التطبيق والحدود.`,
      `This lesson covers "${topic.title.en}" from definition to application and limits.`,
      `ئەم وانەیە «${topic.title.ku}» لە پێناسەوە تا کاربرد و سنوور دەخوێنێت.`,
    )

  // Accessible but serious intuition — NEVER the old "puzzle piece" template
  topic.simple =
    topic.simple ??
    L(
      `نگاه شهودی:\n${topic.narration.fa}\n\nدر یک جمله: ${topic.summary.fa}\n\nمفاهیم کلیدی مرتبط: ${concepts}`,
      `حدس عملي:\n${topic.narration.ar}\n\nجملة واحدة: ${topic.summary.ar}`,
      `Practical intuition:\n${topic.narration.en}\n\nIn one line: ${topic.summary.en}\n\nRelated ideas: ${concepts}`,
      `هەستی پراکتیکی:\n${topic.narration.ku}\n\nبە یەک ڕستە: ${topic.summary.ku}`,
    )

  // Academic explanation = deepDive core (not meta "this is a concept in the path")
  topic.whatIs =
    topic.whatIs ??
    L(
      `${deepFa}`,
      `${deepAr}`,
      `${deepEn}`,
      `${deepKu}`,
    )

  topic.formula =
    topic.formula ??
    bank?.formula ??
    L(
      `چارچوب مفهومی «${topic.title.fa}» (نه‌ یک ماشین‌حساب اجباری)`,
      `إطار مفاهيمي لـ «${topic.title.ar}»`,
      `Conceptual frame for "${topic.title.en}" (not a forced calculator)`,
      `چوارچێوەی چەمکی «${topic.title.ku}»`,
    )

  topic.mathExplain =
    topic.mathExplain ??
    bank?.math ??
    L(
      `صورت‌بندی صوری مرتبط با «${topic.title.fa}»:\n${topic.formula.fa}\n\nاین درس بیش از هر چیز مفهومی است. نمادها را این‌طور بخوانید:\n• چه کمیتی اندازه‌گیری/پیش‌بینی می‌شود؟\n• چه مفروضاتی لازم است؟\n• موفقیت را با چه معیاری می‌سنجید؟\n\nمفاهیم وابسته: ${concepts}`,
      `إطار «${topic.title.ar}»: اسأل ما يُقاس، ما الافتراضات، وما المقياس.\nالمفاهيم: ${concepts}`,
      `Formal framing for "${topic.title.en}":\n${topic.formula.en}\n\nAsk: what quantity is predicted/measured, what assumptions hold, which metric defines success?\nRelated: ${concepts}`,
      `چوارچێوەی «${topic.title.ku}»: چی دەپێورێت؟ گریمانەکان چین؟ metric کامە؟`,
    )

  topic.whyMatters =
    topic.whyMatters ??
    L(
      `اهمیت «${topic.title.fa}»:\nبدون فهم این موضوع، انتخاب مدل، ارزیابی، و تفسیر خطا در سامانه‌های واقعی سست می‌شود. این قطعه را باید بتوانید به یک تصمیم مهندسی وصل کنید: چه چیزی را عوض می‌کند؟`,
      `أهمية «${topic.title.ar}»: تربط الفهم باختيار النموذج والتقييم والقرار الهندسي.`,
      `Why "${topic.title.en}" matters: it should change a real engineering decision—model choice, evaluation, or error diagnosis.`,
      `گرنگی «${topic.title.ku}»: دەبێت بگاتە بڕیارێکی ئەندازیاری.`,
    )

  topic.example =
    topic.example ??
    L(
      `مثال کاربردی برای «${topic.title.fa}»:\nیک موقعیت واقعی انتخاب کنید (ایمیل، تصویر پزشکی، توصیهٔ کالا، ترجمه، امتیاز اعتبار).\nبنویسید:\n1) ورودی چیست؟\n2) خروجی مطلوب چیست؟\n3) نقش «${topic.title.fa}» در این مسیر چیست؟\n4) بدون آن چه اشتباهی رخ می‌دهد؟`,
      `مثال تطبيقي: حدّد مدخلاً ومخرجاً ودور «${topic.title.ar}».`,
      `Applied example for "${topic.title.en}": pick a real setting and write input, desired output, the role of this idea, and what fails without it.`,
      `نموونەی کارپێکراو بۆ «${topic.title.ku}»: input، output، ڕۆڵ، و هەڵەی بێ ئەمە.`,
    )

  topic.visualExplain =
    topic.visualExplain ??
    L(
      `نمای بصری «${topic.title.fa}» باید رابطهٔ اجزاء را نشان دهد: ورودی، تبدیل/تصمیم، و خروجی یا معیار. به ترتیب روشن‌شدن بلوک‌ها دقت کنید.`,
      `العرض البصري يوضح المدخل والتحويل والمخرج.`,
      `The visual for "${topic.title.en}" should show input → transform/decision → output/metric as blocks light up.`,
      `بینین: input → گۆڕان → output/metric.`,
    )

  topic.interactive = topic.interactive ?? pickInteractive(topic.id, topic.category)

  topic.deepDive = expandDeep(
    topic.deepDive,
    `جمع‌بندی:\n- تعریف عملی: ${topic.summary.fa}\n- اتصال مهندسی: این مفهوم چه تصمیمی را عوض می‌کند؟\n- تمرین: یک مثال واقعی در نوت بنویسید.`,
    `خلاصة: تعريف عملي واتصال هندسي ومثال واقعي.`,
    `Wrap-up: practical definition, which engineering decision changes, and one real example in your notes.`,
    `کۆتایی: پێناسەی پراکتیکی، بڕیاری ئەندازیاری، نموونەی ڕاستەقینە.`,
  )

  topics.push(topic)
}

function paper(title, url) {
  return { title, url }
}

// ——— Foundations (1-10)
add({
  id: 'what-is-ml',
  category: 'foundations',
  minutes: 8,
  tags: ['ML', 'Intro'],
  concepts: ['Supervised', 'Unsupervised', 'Generalization'],
  resources: [
    paper('Google ML Crash Course', 'https://developers.google.com/machine-learning/crash-course'),
    paper('ISL Book', 'https://www.statlearning.com/'),
  ],
  title: L('یادگیری ماشین چیست؟', 'ما هو تعلم الآلة؟', 'What is Machine Learning?', 'فێربوونی ماشین چییە؟'),
  summary: L(
    'تعریف علمی ML، تفاوت با برنامه‌نویسی سنتی، و سه خانوادهٔ مسائل.',
    'تعريف علمي لتعلم الآلة والفرق عن البرمجة وثلاث عائلات مسائل.',
    'Scientific definition of ML, contrast with traditional programming, three problem families.',
    'پێناسەی زانستی ML، جیاوازی لە پرۆگرامکردنی کلاسیک، سێ خێزانی کێشە.',
  ),
  narration: L(
    'به‌جای نوشتن همهٔ قواعد تصمیم، مدل از داده پارامتر می‌گیرد تا روی نمونهٔ جدید تعمیم بدهد.',
    'بدل كتابة كل قواعد القرار، يضبط النموذج معاملاته من البيانات ليعمم.',
    'Instead of coding every decision rule, a model fits parameters from data to generalize to new cases.',
    'لە جیاتی نووسینی هەموو یاساکان، مۆدێل لە داتا پارامێتەر فێر دەبێت بۆ گشتاندن.',
  ),
  deepDive: L(
    'یادگیری ماشین شاخه‌ای از هوش مصنوعی است که تابع یا سیاست را از داده تخمین می‌زند. در برنامه‌نویسی سنتی قواعد را انسان می‌نویسد؛ در ML انسان مسئله، داده و هدف را تعریف می‌کند و جزئیات تصمیم از بهینه‌سازی به‌دست می‌آید. سه خانواده: نظارت‌شده (برچسب y)، بدون‌نظارت (کشف ساختار)، تقویتی (پاداش از محیط). موفقیت = تعمیم به دادهٔ ندیده، که با جداسازی Train/Val/Test و متریک مناسب سنجیده می‌شود.',
    'تعلم الآلة يقدّر دالة/سياسة من البيانات. بإشراف أو بلا إشراف أو تعزيزي. النجاح هو التعميم مع انقسام بيانات ومقياس مناسب.',
    'ML estimates a function/policy from data. Supervised, unsupervised, or RL. Success is generalization measured with proper splits and metrics.',
    'ML فەنکشن/سیاسەت لە داتا خەمڵێنێت. supervised / unsupervised / RL. سەرکەوتن = گشتاندن.',
  ),
})

const foundationSpecs = [
  ['types-of-learning', 'انواع یادگیری', 'أنواع التعلم', 'Types of Learning', 'جۆرەکانی فێربوون', 'Supervised', 'https://developers.google.com/machine-learning/crash-course/framing'],
  ['train-val-test', 'آموزش، اعتبارسنجی، آزمون', 'تدريب وتحقق واختبار', 'Train / Val / Test', 'ڕاهێنان / هەڵسەنگاندن / تاقیکردنەوە', 'Split', 'https://scikit-learn.org/stable/modules/cross_validation.html'],
  ['bias-variance', 'بایاس و واریانس', 'التحيز والتباين', 'Bias–Variance', 'Bias–Variance', 'Overfitting', 'https://en.wikipedia.org/wiki/Bias%E2%80%93variance_tradeoff'],
  ['loss-functions', 'توابع زیان', 'دوال الخسارة', 'Loss Functions', 'فەنکشنەکانی زیان', 'Loss', 'https://en.wikipedia.org/wiki/Loss_function'],
  ['gradient-descent', 'گرادیان کاهشی', 'الانحدار التدرجي', 'Gradient Descent', 'Gradient Descent', 'Optimizer', 'https://www.deeplearningbook.org/contents/optimization.html'],
  ['regularization', 'منظم‌سازی', 'التنظيم', 'Regularization', 'ڕێکخستن', 'L2', 'https://en.wikipedia.org/wiki/Regularization_(mathematics)'],
  ['metrics-class', 'متریک‌های طبقه‌بندی', 'مقاييس التصنيف', 'Classification Metrics', 'پێوانەکانی پۆلێنکردن', 'F1', 'https://scikit-learn.org/stable/modules/model_evaluation.html'],
  ['metrics-reg', 'متریک‌های رگرسیون', 'مقاييس الانحدار', 'Regression Metrics', 'پێوانەکانی ڕیگرێشن', 'RMSE', 'https://scikit-learn.org/stable/modules/model_evaluation.html'],
  ['feature-basics', 'ویژگی و پیش‌پردازش', 'الميزات والمعالجة', 'Features & Preprocessing', 'تایبەتمەندی و پێشپرۆسێس', 'Scaling', 'https://scikit-learn.org/stable/modules/preprocessing.html'],
]

for (const [id, fa, ar, en, ku, concept, url] of foundationSpecs) {
  add({
    id,
    category: 'foundations',
    minutes: 9,
    tags: ['ML', concept],
    concepts: [concept, 'Generalization', 'Evaluation'],
    resources: [paper(en + ' reference', url), paper('Deep Learning Book', 'https://www.deeplearningbook.org/')],
    title: L(fa, ar, en, ku),
    summary: L(`مرور مفهومی ${fa}.`, `نظرة مفاهيمية: ${ar}.`, `Conceptual overview of ${en}.`, `پوختەی چەمکی ${ku}.`),
    narration: L(
      `در این مرحله، ${fa} را با شهود، کاربرد و اشتباهات رایج می‌بینید.`,
      `في هذه الخطوة نفهم ${ar} بالحدس والتطبيق والأخطاء الشائعة.`,
      `This step covers ${en} with intuition, practice, and common pitfalls.`,
      `لەم هەنگاوەدا ${ku} بە تێگەیشتن و پراکتیک و هەڵە باوەکان دەبینین.`,
    ),
    deepDive: L(
      `${fa} یکی از ستون‌های ساخت مدل قابل اعتماد است. اول مسئله را درست فرموله کنید، بعد داده را جدا کنید، سپس مدل را با زیان مناسب آموزش دهید و با متریک درست بسنجید. بدون این چرخه، حتی معماری قوی هم گمراه‌کننده است. هنگام کار روی متن و LLMها همین اصول پابرجاست: تعمیم، جلوگیری از overfitting، و ارزیابی صادقانه روی دادهٔ نگه داشته‌شده.`,
      `${ar} ركن لبناء نموذج موثوق. صغ المسألة، افصل البيانات، درّب بخسارة مناسبة، وقيّم بمقياس صحيح. بدون هذه الدورة حتى البنية القوية مضللة. المبادئ نفسها تنطبق على النصوص والنماذج اللغوية.`,
      `${en} is a pillar of trustworthy models. Frame the problem, split data, train with a suitable loss, and evaluate honestly. Without this loop even strong architectures mislead. The same principles apply to text and LLMs.`,
      `${ku} ستوونێکی مۆدێلی متمانەپێکراوە. کێشەکە فۆرمولە بکە، داتا جیا بکەوە، بە زیانی گونجاو ڕابهێنە و بە پێوانەی دروست هەڵبسەنگێنە. هەمان بنەما بۆ دەق و LLMیش ڕاستە.`,
    ),
  })
}

// ——— Neural nets (11-22)
const nnSpecs = [
  ['perceptron', 'پرسپترون', 'البرسبترون', 'Perceptron', 'پێرسێپترۆن', 'intro-hero'],
  ['mlp', 'شبکهٔ چندلایه (MLP)', 'الشبكة متعددة الطبقات', 'Multilayer Perceptron', 'MLP', null],
  ['activation', 'توابع فعال‌سازی', 'دوال التفعيل', 'Activation Functions', 'فەنکشنەکانی چالاککردن', null],
  ['backprop', 'پس‌انتشار', 'الانتشار العكسي', 'Backpropagation', 'Backpropagation', null],
  ['init-norm', 'مقداردهی و نرمال‌سازی', 'التهيئة والتطبيع', 'Init & Normalization', 'دەستپێکردن و ئاسایی کردن', null],
  ['dropout', 'Dropout و تعمیم', 'الإسقاط والتعميم', 'Dropout', 'Dropout', null],
  ['cnn-intro', 'آشنایی با CNN', 'مقدمة في CNN', 'CNN Intro', 'ناساندنی CNN', null],
  ['pooling', 'Pooling و سلسله‌مراتب ویژگی', 'التجميع وتسلسل الميزات', 'Pooling', 'Pooling', null],
  ['batchnorm', 'Batch Normalization', 'تطبيع الدُفعات', 'Batch Normalization', 'BatchNorm', null],
  ['residual', 'اتصالات باقیمانده', 'الوصلات المتبقية', 'Residual Connections', 'Residual', null],
  ['optimizers', 'SGD، Adam و دوستان', 'SGD وAdam', 'SGD & Adam', 'SGD و Adam', null],
  ['vanishing', 'محو/انفجار گرادیان', 'اختفاء/انفجار التدرج', 'Vanishing Gradients', 'Vanishing Gradients', 'rnn-limits'],
]

for (const [id, fa, ar, en, ku, visual] of nnSpecs) {
  add({
    id,
    category: 'neural-nets',
    minutes: 10,
    visual: visual || undefined,
    tags: ['DL', 'NeuralNet'],
    concepts: [en, 'Deep Learning', 'Optimization'],
    resources: [
      paper('Deep Learning Book', 'https://www.deeplearningbook.org/'),
      paper('CS231n', 'https://cs231n.github.io/'),
    ],
    title: L(fa, ar, en, ku),
    summary: L(`عمیق دربارهٔ ${fa}.`, `شرح معمق لـ ${ar}.`, `Deep dive into ${en}.`, `قووڵبوونەوە لە ${ku}.`),
    narration: L(
      `${fa} را لایه به لایه می‌شکافیم: چرا لازم است، چگونه کار می‌کند، کجا می‌شکند.`,
      `نشرح ${ar}: لماذا يلزم وكيف يعمل وأين يفشل.`,
      `We unpack ${en}: why it matters, how it works, where it fails.`,
      `${ku} دەکەینەوە: بۆچی گرنگە، چۆن کاردەکات، کوێ دەشکێت.`,
    ),
    deepDive: L(
      `${fa} بخشی از جعبه‌ابزار شبکه‌های عمیق است. ایدهٔ مرکزی: ترکیب تبدیل‌های ساده با غیرخطی‌ها ظرفیت مدل را بالا می‌برد. در عمل باید پایداری آموزش (گرادیان سالم، نرمال‌سازی، residual) و تعمیم (dropout، دادهٔ کافی) را همزمان ببینید. این مفاهیم مستقیم به Transformer وصل می‌شوند: LayerNorm، residual و FFN همان میراث MLP و بهینه‌سازی مدرن‌اند.`,
      `${ar} جزء أدوات التعلم العميق. الجمع بين تحويلات بسيطة ولاخطية يزيد القدرة. عملياً يجب موازنة استقرار التدريب والتعميم. هذه الأفكار تصل مباشرة إلى المحولات عبر LayerNorm والوصلات المتبقية وFFN.`,
      `${en} belongs to the deep learning toolkit. Combining simple transforms with nonlinearities increases capacity. In practice balance stable training and generalization. These ideas feed Transformers via LayerNorm, residuals, and FFNs.`,
      `${ku} بەشێکە لە کەرەستەی فێربوونی قووڵ. تێکەڵکردنی گۆڕانکاری سادە و ناهێڵی توانا زیاد دەکات. LayerNorm و residual و FFN لە Transformerدا هەمان میراتن.`,
    ),
    formula: id === 'backprop' ? L('δ = (∂L/∂z)', 'δ = (∂L/∂z)', 'δ = ∂L/∂z', 'δ = ∂L/∂z') : undefined,
  })
}

// ——— NLP basics (23-32)
const nlpSpecs = [
  ['nlp-pipeline', 'پایپ‌لاین NLP', 'خط أنابيب NLP', 'NLP Pipeline', 'هێڵی کارەکانی NLP'],
  ['text-preprocess', 'پیش‌پردازش متن', 'معالجة النص', 'Text Preprocessing', 'پێشپرۆسێسی دەق'],
  ['bow-tfidf', 'Bag-of-Words و TF-IDF', 'حقيبة الكلمات وTF-IDF', 'BoW & TF-IDF', 'BoW و TF-IDF'],
  ['language-model-idea', 'ایدهٔ مدل زبانی', 'فكرة نموذج اللغة', 'Language Modeling Idea', 'ایدەی مۆدێلی زمان'],
  ['n-grams', 'مدل‌های n-gram', 'نماذج n-gram', 'n-gram Models', 'مۆدێلی n-gram'],
  ['perplexity', 'Perplexity', 'الحيرة (Perplexity)', 'Perplexity', 'Perplexity'],
  ['pos-ner', 'POS و NER', 'وسم الأقسام والكيانات', 'POS & NER', 'POS و NER'],
  ['parsing', 'تجزیه نحوی', 'التحليل النحوي', 'Syntactic Parsing', 'شیکاری ڕێزمانی'],
  ['semantic-role', 'نقش معنایی', 'الأدوار الدلالية', 'Semantic Roles', 'ڕۆڵی واتایی'],
  ['eval-nlp', 'ارزیابی وظایف NLP', 'تقييم مهام NLP', 'NLP Task Evaluation', 'هەڵسەنگاندنی ئەرکەکانی NLP'],
]

for (const [id, fa, ar, en, ku] of nlpSpecs) {
  add({
    id,
    category: 'nlp-basics',
    minutes: 9,
    tags: ['NLP'],
    concepts: [en, 'Text', 'Evaluation'],
    resources: [
      paper('Jurafsky & Martin', 'https://web.stanford.edu/~jurafsky/slp3/'),
      paper('Hugging Face Course', 'https://huggingface.co/learn/nlp-course'),
    ],
    title: L(fa, ar, en, ku),
    summary: L(`پایهٔ زبانی: ${fa}.`, `أساس لغوي: ${ar}.`, `Language foundation: ${en}.`, `بنەمای زمان: ${ku}.`),
    narration: L(
      `متن خام باید به سیگنال قابل یادگیری تبدیل شود؛ ${fa} یکی از قطعات این مسیر است.`,
      `يجب تحويل النص الخام إلى إشارة قابلة للتعلم؛ ${ar} جزء من هذا المسار.`,
      `Raw text must become a learnable signal; ${en} is one piece of that path.`,
      `دەقی خاو دەبێت ببێتە سیگناڵێکی فێربوون؛ ${ku} بەشێکە لەو ڕێگایە.`,
    ),
    deepDive: L(
      `${fa} به شما کمک می‌کند بفهمید قبل از Transformer چه مسائلی وجود داشت و چرا بازنمایی توزیع‌شده و Attention لازم شدند. مدل‌های کلاسیک هنوز برای خطوط پایه و سیستم‌های سبک مفیدند. همیشه مشخص کنید ورودی چیست، برچسب چیست، و متریک موفقیت کدام است؛ وگرنه مقایسهٔ مدل‌ها بی‌معنا می‌شود.`,
      `${ar} يوضح ما قبل المحولات ولماذا ظهرت التمثيلات الموزعة والانتباه. النماذج الكلاسيكية ما زالت مفيدة كخطوط أساس. حدد دائماً المدخل والتسمية ومقياس النجاح.`,
      `${en} clarifies pre-Transformer NLP and why distributed representations and attention emerged. Classic models remain useful baselines. Always define input, label, and success metric.`,
      `${ku} یارمەتی دەدات تێبگەیت پێش Transformer چی هەبوو و بۆچی Attention پێویست بوو. هەمیشە input و label و metric دیاری بکە.`,
    ),
  })
}

// ——— Embeddings (33-40)
const embSpecs = [
  ['vector-space', 'فضای برداری معنا', 'فضاء المتجهات الدلالي', 'Semantic Vector Space', 'بۆشایی ڤێکتەری واتایی'],
  ['word2vec', 'Word2Vec', 'Word2Vec', 'Word2Vec', 'Word2Vec'],
  ['glove', 'GloVe', 'GloVe', 'GloVe', 'GloVe'],
  ['fasttext', 'FastText', 'FastText', 'FastText', 'FastText'],
  ['contextual-emb', 'Embedding بافت‌آگاه', 'التضمين السياقي', 'Contextual Embeddings', 'Embeddingی دەوروبەر'],
  ['similarity', 'شباهت کسینوسی', 'التشابه الجيبي', 'Cosine Similarity', 'لێکچووی کۆساین'],
  ['dim-reduction', 'کاهش بُعد برای نمایش', 'تخفيض الأبعاد', 'Dimensionality Reduction', 'کەمکردنەوەی ڕەهەند'],
  ['embedding-eval', 'ارزیابی Embedding', 'تقييم التضمين', 'Embedding Evaluation', 'هەڵسەنگاندنی Embedding'],
]

for (const [id, fa, ar, en, ku] of embSpecs) {
  add({
    id,
    category: 'embeddings',
    minutes: 10,
    tags: ['Embeddings', 'Representation'],
    concepts: [en, 'Vectors', 'Semantics'],
    resources: [
      paper('Word2Vec paper', 'https://arxiv.org/abs/1301.3781'),
      paper('GloVe', 'https://nlp.stanford.edu/projects/glove/'),
    ],
    title: L(fa, ar, en, ku),
    summary: L(`بازنمایی توزیع‌شده: ${fa}.`, `التمثيل الموزع: ${ar}.`, `Distributed representation: ${en}.`, `نوێنەرایەتی دابەشکراو: ${ku}.`),
    narration: L(
      `معنا را به عدد تبدیل می‌کنیم تا مدل بتواند شباهت و قیاس را یاد بگیرد.`,
      'نحول المعنى إلى أرقام ليتعلم النموذج التشابه والقياس.',
      'We map meaning to numbers so models can learn similarity and analogy.',
      'واتا دەکەین بە ژمارە تا مۆدێل لێکچوون فێر ببێت.',
    ),
    deepDive: L(
      `${fa} پلی است بین متن گسسته و جبر پیوسته. مدل‌های ایستا مثل Word2Vec برای هر کلمه یک بردار دارند؛ مدل‌های بافت‌آگاه (ELMo/BERT) بردار را وابسته به جمله می‌سازند. در Transformerها، embedding اولیه فقط نقطهٔ شروع است و لایه‌های Attention آن را غنی می‌کنند.`,
      `${ar} جسر بين النص المنفصل والجبر المستمر. النماذج الثابتة تعطي متجهاً لكل كلمة؛ السياقية تعتمد على الجملة. في المحولات يكون التضمين الأولي بداية فقط.`,
      `${fa === en ? en : en} bridges discrete text and continuous algebra. Static models assign one vector per word; contextual models depend on the sentence. In Transformers the input embedding is only the starting point.`,
      `${ku} پردێکە لەنێوان دەق و جەبری بەردەوام. لە Transformerدا embedding تەنها دەستپێکە.`,
    ),
  })
}

// ——— Sequences (41-48)
const seqSpecs = [
  ['seq-problem', 'مسئلهٔ توالی', 'مشكلة التسلسل', 'The Sequence Problem', 'کێشەی زنجیرە', 'seq-problem'],
  ['rnn-basics', 'RNN پایه', 'الشبكة التكرارية', 'RNN Basics', 'بنەماکانی RNN', 'rnn-limits'],
  ['lstm', 'LSTM', 'LSTM', 'LSTM', 'LSTM', 'rnn-limits'],
  ['gru', 'GRU', 'GRU', 'GRU', 'GRU', null],
  ['seq2seq', 'Seq2Seq', 'Seq2Seq', 'Seq2Seq', 'Seq2Seq', null],
  ['attn-bahdanau', 'Attention کلاسیک (Bahdanau)', 'انتباه Bahdanau', 'Bahdanau Attention', 'Attentionی Bahdanau', 'attention-intuition'],
  ['teacher-forcing', 'Teacher Forcing', 'الإجبار بالمعلم', 'Teacher Forcing', 'Teacher Forcing', null],
  ['seq-limits', 'محدودیت مدل‌های ترتیبی', 'حدود النماذج التسلسلية', 'Sequential Limits', 'سنووری مۆدێلی زنجیرەیی', 'rnn-limits'],
]

for (const [id, fa, ar, en, ku, visual] of seqSpecs) {
  add({
    id,
    category: 'sequences',
    minutes: 11,
    visual: visual || undefined,
    tags: ['RNN', 'Seq2Seq'],
    concepts: [en, 'Memory', 'Alignment'],
    resources: [
      paper('Seq2Seq paper', 'https://arxiv.org/abs/1409.3215'),
      paper('Bahdanau Attention', 'https://arxiv.org/abs/1409.0473'),
    ],
    title: L(fa, ar, en, ku),
    summary: L(`مدل‌سازی توالی: ${fa}.`, `نمذجة التسلسل: ${ar}.`, `Sequence modeling: ${en}.`, `مۆدێلکردنی زنجیرە: ${ku}.`),
    narration: L(
      `توالی‌ها وابستگی زمانی دارند؛ این مرحله نشان می‌دهد مدل چگونه حافظه و تراز می‌سازد.`,
      'للتسلسلات اعتماد زمني؛ نرى كيف تُبنى الذاكرة والمحاذاة.',
      'Sequences have temporal dependence; we see how memory and alignment are built.',
      'زنجیرەکان پاشکۆی کاتین؛ دەبینین بیرەوەری و تراز چۆن دروست دەبن.',
    ),
    deepDive: L(
      `${fa} توضیح می‌دهد چرا قبل از Transformer به RNN و Attention نرم نیاز بود و چرا موازی‌سازی سخت بود. LSTM/GRU مسیر گرادیان را بهتر می‌کنند اما همچنان ترتیبی‌اند. Attention کلاسیک روی خروجی‌های Encoder وزن می‌گذارد و مقدمهٔ مستقیم Self-Attention است.`,
      `${ar} يشرح الحاجة إلى RNN والانتباه قبل المحولات. LSTM/GRU أفضل للتدرج لكنها تسلسلية. الانتباه الكلاسيكي مقدمة لـ Self-Attention.`,
      `${en} explains why RNNs and soft attention preceded Transformers. LSTM/GRU improve gradients but stay sequential. Classic attention is the direct prelude to self-attention.`,
      `${ku} ڕوون دەکاتەوە بۆچی RNN و Attention پێش Transformer هاتن و بۆچی Self-Attention جێگرەوەیەکی باشترە.`,
    ),
  })
}

// ——— Attention & Transformers (49-66) — rich set with visuals
const attnSpecs = [
  ['attn-intro', 'شروع مسیر Attention', 'بداية مسار الانتباه', 'Attention Journey Start', 'دەستپێکی Attention', 'intro-hero'],
  ['attn-intuition', 'شهود Attention', 'حدس الانتباه', 'Attention Intuition', 'تێگەیشتنی Attention', 'attention-intuition'],
  ['qkv', 'Query، Key، Value', 'الاستعلام والمفتاح والقيمة', 'Query, Key, Value', 'Query، Key، Value', 'qkv-flow'],
  ['dot-product-attn', 'امتیاز Dot-Product', 'درجة الضرب النقطي', 'Dot-Product Scores', 'نمرەی Dot-Product', 'dot-product'],
  ['softmax-attn', 'Softmax وزن‌ها', 'Softmax للأوزان', 'Softmax Weights', 'کێشی Softmax', 'softmax-weights'],
  ['scaled-dot', 'Scaled Dot-Product Attention', 'الانتباه المقاس', 'Scaled Dot-Product Attention', 'Scaled Dot-Product', 'scaled-attention'],
  ['multi-head', 'Multi-Head Attention', 'الانتباه متعدد الرؤوس', 'Multi-Head Attention', 'Multi-Head Attention', 'multi-head'],
  ['positional', 'Positional Encoding', 'الترميز الموضعي', 'Positional Encoding', 'Positional Encoding', 'positional'],
  ['encoder-block', 'بلوک Encoder', 'كتلة المُرمِّز', 'Encoder Block', 'بلۆکی Encoder', 'encoder-stack'],
  ['decoder-block', 'بلوک Decoder', 'كتلة فك الترميز', 'Decoder Block', 'بلۆکی Decoder', 'decoder-stack'],
  ['full-transformer', 'معماری کامل Transformer', 'بنية المحول الكاملة', 'Full Transformer', 'تەلارسازی تەواوی Transformer', 'full-transformer'],
  ['self-vs-cross', 'Self در برابر Cross', 'ذاتي مقابل متقاطع', 'Self vs Cross Attention', 'Self بەرامبەر Cross', 'self-vs-cross'],
  ['causal-mask', 'ماسک علیّت', 'قناع السببية', 'Causal Masking', 'ماسکی هۆکاری', 'decoder-stack'],
  ['layernorm-ffn', 'LayerNorm و FFN', 'LayerNorm وFFN', 'LayerNorm & FFN', 'LayerNorm و FFN', 'encoder-stack'],
  ['why-transformers-scale', 'چرا Transformer مقیاس‌پذیر است', 'لماذا يتوسع المحول', 'Why Transformers Scale', 'بۆچی Transformer گەورە دەبێت', 'why-scale'],
  ['transformer-wrap', 'جمع‌بندی Transformer', 'خلاصة المحول', 'Transformer Wrap-up', 'کۆتایی Transformer', 'wrap-up'],
  ['attn-complexity', 'پیچیدگی O(n²)', 'تعقيد O(n²)', 'Attention Complexity', 'ئاڵۆزی O(n²)', 'why-scale'],
  ['rope-alibi', 'RoPE و ALiBi', 'RoPE وALiBi', 'RoPE & ALiBi', 'RoPE و ALiBi', 'positional'],
]

const formulas = {
  qkv: 'Q=XW_Q, K=XW_K, V=XW_V',
  'dot-product-attn': 'score = q · k',
  'softmax-attn': 'α = softmax(scores)',
  'scaled-dot': 'Attention(Q,K,V)=softmax(QKᵀ/√d_k)V',
  'multi-head': 'MultiHead=Concat(heads)W_O',
  positional: 'PE(pos,2i)=sin(pos/10000^(2i/d))',
}

for (const [id, fa, ar, en, ku, visual] of attnSpecs) {
  add({
    id,
    category: 'attention',
    minutes: 12,
    visual,
    tags: ['Attention', 'Transformer'],
    concepts: [en, 'Attention', 'Transformer'],
    resources: [
      paper('Attention Is All You Need', 'https://arxiv.org/abs/1706.03762'),
      paper('The Illustrated Transformer', 'https://jalammar.github.io/illustrated-transformer/'),
      paper('Harvard Annotated Transformer', 'http://nlp.seas.harvard.edu/annotated-transformer/'),
    ],
    title: L(fa, ar, en, ku),
    summary: L(`هستهٔ مدرن NLP: ${fa}.`, `جوهر NLP الحديث: ${ar}.`, `Modern NLP core: ${en}.`, `ناوکی NLPی مۆدێرن: ${ku}.`),
    narration: L(
      `این مرحله را با انیمیشن ببینید: ${fa}. همزمان توضیح کامل و منابع رسمی زیر آن آمده است.`,
      `شاهد الخطوة مع الرسوم: ${ar}. الشرح الكامل والمصادر أسفلها.`,
      `Watch this step animated: ${en}. Full explanation and official resources sit below.`,
      `ئەم هەنگاوە بە ئەنیمەیشن ببینە: ${ku}. ڕوونکردنەوە و سەرچاوەکان لە خوارەوەن.`,
    ),
    deepDive: L(
      `${fa} یکی از قطعات معماری است که تقریباً همه LLMهای امروزی روی آن سوارند. ایده: هر موقعیت می‌تواند به‌صورت موازی به بقیه نگاه کند، ارتباط را با Q/K بسنجد و محتوا را از V جمع کند. Multi-Head زیرفضاهای تخصصی می‌سازد؛ Position ترتیب را برمی‌گرداند؛ Encoder درک و Decoder تولید را ممکن می‌کند. برای جلوگیری از اشتباه، همیشه منابع اصلی (مقاله ۲۰۱۷ و شرح‌های مصور) را کنار تمرین نگه دارید.`,
      `${ar} جزء من البنية التي تعتمد عليها أغلب النماذج اللغوية. كل موضع ينظر للبقية بالتوازي عبر Q/K/V. الرؤوس المتعددة تخصص الفضاءات، والترميز الموضعي يعيد الترتيب. راجع الورقة الأصلية والشروح المصورة.`,
      `${en} is a building block behind almost every modern LLM. Each position can attend in parallel via Q/K/V. Multi-head specialization, positional signals, and encoder/decoder roles complete the picture. Keep the 2017 paper and illustrated guides beside practice.`,
      `${ku} یەکێکە لە پارچەکانی تەلارسازی کە زۆربەی LLMی ئەمڕۆ لەسەری وەستاون. هەر شوێنێک دەتوانێت بە هاوتەریب سەیری ئەوانی تر بکات لەڕێی Q/K/V.`,
    ),
    formula: formulas[id] ? L(formulas[id], formulas[id], formulas[id], formulas[id]) : undefined,
  })
}

// ——— LLMs (67-80)
const llmSpecs = [
  ['lm-objective', 'هدف مدل زبانی', 'هدف نموذج اللغة', 'LM Objective', 'ئامانجی مۆدێلی زمان'],
  ['gpt-decoder', 'خانواده GPT (Decoder-only)', 'عائلة GPT', 'GPT Family', 'خێزانی GPT'],
  ['bert-encoder', 'BERT و Encoder-only', 'BERT والمُرمِّز فقط', 'BERT Family', 'خێزانی BERT'],
  ['t5-encdec', 'T5 و Encoder–Decoder', 'T5', 'T5 Family', 'خێزانی T5'],
  ['pretrain-finetune', 'پیش‌آموزش و Fine-tune', 'التدريب المسبق والضبط', 'Pretrain & Finetune', 'پێشڕاهێنان و Fine-tune'],
  [' emergent-abilities', 'توانایی‌های ظاهرشونده', 'قدرات ناشئة', 'Emergent Abilities', 'تواناکانی سەرهەڵدەر'],
  ['context-window', 'پنجرهٔ زمینه', 'نافذة السياق', 'Context Window', 'پەنجەرەی دەوروبەر'],
  ['in-context-learning', 'یادگیری درون‌زمینه', 'التعلم في السياق', 'In-context Learning', 'فێربوون لە دەوروبەر'],
  ['prompting', 'Prompting مؤثر', 'التلقين الفعّال', 'Effective Prompting', 'Promptی کاریگەر'],
  ['rag', 'RAG', 'التوليد المعزز بالاسترجاع', 'RAG', 'RAG'],
  ['agents-tools', 'ایجنت و Tool-use', 'الوكلاء والأدوات', 'Agents & Tools', 'ئەجێنت و ئامراز'],
  ['scaling-laws', 'قوانین مقیاس', 'قوانين القياس', 'Scaling Laws', 'یاساکانی قەبارە'],
  ['mixture-of-experts', 'Mixture of Experts', 'خليط الخبراء', 'Mixture of Experts', 'Mixture of Experts'],
  ['multimodal-lm', 'مدل‌های چندرسانه‌ای', 'نماذج متعددة الوسائط', 'Multimodal LMs', 'مۆدێلی فرەمیدیایی'],
]

for (const [id, fa, ar, en, ku] of llmSpecs) {
  const cleanId = id.replace(/\s/g, '')
  add({
    id: cleanId,
    category: 'llms',
    minutes: 12,
    tags: ['LLM', 'GPT', 'BERT'],
    concepts: [en, 'Pretraining', 'Inference'],
    resources: [
      paper('GPT-3 paper', 'https://arxiv.org/abs/2005.14165'),
      paper('BERT paper', 'https://arxiv.org/abs/1810.04805'),
      paper('Hugging Face NLP Course', 'https://huggingface.co/learn/nlp-course'),
    ],
    title: L(fa, ar, en, ku),
    summary: L(`جهان LLM: ${fa}.`, `عالم النماذج الكبيرة: ${ar}.`, `LLM world: ${en}.`, `جیهانی LLM: ${ku}.`),
    narration: L(
      `از پیش‌آموزش تا کاربرد: ${fa} را با مثال و محدودیت‌های واقعی بررسی می‌کنیم.`,
      `من التدريب المسبق إلى التطبيق: ${ar}.`,
      `From pretraining to practice: ${en} with real constraints.`,
      `لە پێشڕاهێنان تا پراکتیک: ${ku}.`,
    ),
    deepDive: L(
      `${fa} بخشی از نقشهٔ مدل‌های زبانی بزرگ است. تفاوت خانواده‌ها (GPT/BERT/T5)، نقش داده و مقیاس، و الگوهای استفاده مثل prompting و RAG را باید جدا فهمید. منابع arXiv و مستندات Hugging Face برای جلوگیری از اطلاعات نادرست ضروری‌اند؛ همیشه نسخهٔ مدل و تاریخ مقاله را چک کنید.`,
      `${ar} جزء من خريطة النماذج الكبيرة. افصل بين العائلات وأنماط الاستخدام. راجع arXiv وHugging Face دائماً.`,
      `${en} is part of the LLM map. Separate families and usage patterns like prompting and RAG. Prefer arXiv and Hugging Face docs; check model version and paper date.`,
      `${ku} بەشێکە لە نەخشەی LLM. خێزانەکان و شێوازەکانی بەکارهێنان جیا بکەوە و سەرچاوەی متمانەپێکراو بەکاربهێنە.`,
    ),
  })
}

// ——— Tokenization (81-86)
const tokSpecs = [
  ['why-tokenize', 'چرا توکن‌سازی؟', 'لماذا التقطيع؟', 'Why Tokenize?', 'بۆچی تۆکن؟'],
  ['bpe', 'BPE', 'BPE', 'Byte-Pair Encoding', 'BPE'],
  ['wordpiece', 'WordPiece', 'WordPiece', 'WordPiece', 'WordPiece'],
  ['sentencepiece', 'SentencePiece', 'SentencePiece', 'SentencePiece', 'SentencePiece'],
  ['tokenizer-issues', 'مشکلات توکن‌سازی', 'مشكلات التقطيع', 'Tokenizer Pitfalls', 'کێشەکانی تۆکن'],
  ['multilingual-tok', 'توکن چندزبانه', 'تقطيع متعدد اللغات', 'Multilingual Tokenization', 'تۆکنی فرەزمان'],
]

for (const [id, fa, ar, en, ku] of tokSpecs) {
  add({
    id,
    category: 'tokenization',
    minutes: 9,
    tags: ['Tokenizer', 'BPE'],
    concepts: [en, 'Vocabulary', 'Subword'],
    resources: [
      paper('Neural Machine Translation of Rare Words with BPE', 'https://arxiv.org/abs/1508.07909'),
      paper('SentencePiece', 'https://arxiv.org/abs/1808.06226'),
      paper('HF Tokenizers', 'https://huggingface.co/docs/tokenizers'),
    ],
    title: L(fa, ar, en, ku),
    summary: L(`از متن تا شناسه: ${fa}.`, `من النص إلى المعرفات: ${ar}.`, `From text to ids: ${en}.`, 'لە دەقەوە بۆ id: ' + ku),
    narration: L(
      `توکن‌سازی مرز واژگان، هزینهٔ محاسبه و کیفیت چندزبانه را تعیین می‌کند.`,
      'التقطيع يحدد حدود المفردات والتكلفة وجودة تعدد اللغات.',
      'Tokenization sets vocabulary boundaries, compute cost, and multilingual quality.',
      'تۆکنکردن سنووری وشەکان و تێچوون و کوالیتی فرەزمان دیاری دەکات.',
    ),
    deepDive: L(
      `${fa} را جدی بگیرید: یک توکنایزر بد می‌تواند فارسی/عربی/کوردی را به قطعات بی‌معنا بشکند و هزینهٔ context را بالا ببرد. BPE و WordPiece و SentencePiece را با مثال واقعی مقایسه کنید و همیشه vocabulary size و special tokens را در مستندات مدل بخوانید.`,
      `${ar} مهم: المُقطِّع السيئ يضر العربية والفارسية والكردية. قارن BPE وWordPiece وSentencePiece واقرأ وثائق النموذج.`,
      `${en} matters: a bad tokenizer can shatter Persian/Arabic/Kurdish and inflate context cost. Compare BPE, WordPiece, SentencePiece and read each model’s tokenizer docs.`,
      `${ku} گرنگە: تۆکنایزەری خراپ کوردی/فارسی/عەرەبی دەشکێنێت. BPE و WordPiece و SentencePiece بەراورد بکە.`,
    ),
  })
}

// ——— Training (87-96)
const trainSpecs = [
  ['cross-entropy', 'Cross-Entropy', 'الإنتروبيا المتقاطعة', 'Cross-Entropy', 'Cross-Entropy'],
  ['lr-schedule', 'برنامه Learning Rate', 'جدول معدل التعلم', 'LR Schedules', 'خشتەی LR'],
  ['warmup-decay', 'Warmup و Decay', 'الإحماء والتضاؤل', 'Warmup & Decay', 'Warmup و Decay'],
  ['mixed-precision', 'Mixed Precision', 'الدقة المختلطة', 'Mixed Precision', 'Mixed Precision'],
  ['distributed-train', 'آموزش توزیع‌شده', 'التدريب الموزع', 'Distributed Training', 'ڕاهێنانی دابەشکراو'],
  ['data-quality', 'کیفیت داده', 'جودة البيانات', 'Data Quality', 'کوالیتی داتا'],
  ['curriculum', 'Curriculum Learning', 'التعلم المنهجي', 'Curriculum Learning', 'فێربوونی پلەبەپلە'],
  ['overfit-lm', 'Overfitting در LM', 'فرط التخصيص في LM', 'LM Overfitting', 'Overfitting لە LM'],
  ['checkpointing', 'Checkpointing', 'نقاط الحفظ', 'Checkpointing', 'Checkpoint'],
  ['hyperparams', 'هایپرپارامترها', 'المعلمات الفائقة', 'Hyperparameters', 'هایپەرپارامێتەر'],
]

for (const [id, fa, ar, en, ku] of trainSpecs) {
  add({
    id,
    category: 'training',
    minutes: 10,
    tags: ['Training', 'Optimization'],
    concepts: [en, 'Stability', 'Scale'],
    resources: [
      paper('Deep Learning Book – Optimization', 'https://www.deeplearningbook.org/contents/optimization.html'),
      paper('PyTorch AMP', 'https://pytorch.org/docs/stable/amp.html'),
    ],
    title: L(fa, ar, en, ku),
    summary: L(`آموزش پایدار: ${fa}.`, `تدريب مستقر: ${ar}.`, `Stable training: ${en}.`, `ڕاهێنانی جێگیر: ${ku}.`),
    narration: L(
      `بدون آموزش درست، معماری خوب هم نتیجه نمی‌دهد؛ تمرکز این مرحله روی ${fa} است.`,
      `بدون تدريب سليم لن تنفع البنية؛ نركز على ${ar}.`,
      `Without solid training, architecture alone fails; focus: ${en}.`,
      `بەبێ ڕاهێنانی دروست تەلارسازی باش سود نابەخشێت؛ سەرنج: ${ku}.`,
    ),
    deepDive: L(
      `${fa} را در کنار مانیتورینگ loss/val و پایداری عددی ببینید. در مقیاس LLM، انتخاب precision، شاردینگ، و کیفیت داده اغلب از تغییر کوچک معماری مهم‌تر است. منابع رسمی PyTorch/DeepSpeed را برای جزئیات اجرایی دنبال کنید.`,
      `${ar} مع مراقبة الخسارة والاستقرار العددي. على نطاق LLM تُعد الدقة وجودة البيانات حاسمة. راجع وثائق PyTorch/DeepSpeed.`,
      `${en} goes with loss/val monitoring and numeric stability. At LLM scale, precision, sharding, and data quality often beat tiny architecture tweaks. Follow PyTorch/DeepSpeed docs.`,
      `${ku} لەگەڵ چاودێری loss و جێگیری ژمارەیی ببینە. لە قەبارەی LLMدا کوالیتی داتا زۆر گرنگە.`,
    ),
  })
}

// ——— Generation (97-102)
const genSpecs = [
  ['greedy-decode', 'Greedy Decoding', 'التفكيك الجشع', 'Greedy Decoding', 'Greedy Decoding'],
  ['beam-search', 'Beam Search', 'بحث الحزم', 'Beam Search', 'Beam Search'],
  ['sampling', 'Temperature و Sampling', 'درجة الحرارة والعينة', 'Sampling & Temperature', 'Sampling و Temperature'],
  ['top-k-p', 'Top-k و Top-p', 'Top-k وTop-p', 'Top-k & Top-p', 'Top-k و Top-p'],
  ['repetition', 'تکرار و جریمه', 'التكرار والعقوبة', 'Repetition Penalties', 'سزای دووبارەبوونەوە'],
  ['structured-out', 'خروجی ساخت‌یافته', 'مخرجات منظمة', 'Structured Outputs', 'دەرچوونی ڕێکخراو'],
]

for (const [id, fa, ar, en, ku] of genSpecs) {
  add({
    id,
    category: 'generation',
    minutes: 9,
    tags: ['Decoding', 'Inference'],
    concepts: [en, 'Sampling', 'Control'],
    resources: [
      paper('Holtzman et al. Nucleus Sampling', 'https://arxiv.org/abs/1904.09751'),
      paper('HF Generation', 'https://huggingface.co/docs/transformers/generation_strategies'),
    ],
    title: L(fa, ar, en, ku),
    summary: L(`از logit تا متن: ${fa}.`, `من اللوجت إلى النص: ${ar}.`, 'From logits to text: ' + en, 'لە logitەوە بۆ دەق: ' + ku),
    narration: L(
      `نحوهٔ انتخاب توکن بعدی کیفیت، تنوع و قابلیت کنترل خروجی را عوض می‌کند.`,
      'اختيار الرمز التالي يغير الجودة والتنوع والتحكم.',
      'How we pick the next token changes quality, diversity, and control.',
      'هەڵبژاردنی تۆکنی داهاتوو کوالیتی و هەمەجۆری دەگۆڕێت.',
    ),
    deepDive: L(
      `${fa} را با مثال‌های کوتاه آزمایش ذهنی کنید: greedy پایدار ولی تکراری، sampling خلاق ولی پرریسک، nucleus معمولاً تعادل بهتری می‌دهد. برای کاربردهای دقیق (JSON، ابزار)، decoding ساخت‌یافته و constrained generation مهم است.`,
      `${ar}: الجشع مستقر لكنه تكراري، والعينة مبدعة لكن مخاطرة. للنخرجات الدقيقة استخدم قيوداً.`,
      `${en}: greedy is stable but dull; sampling is creative but risky; nucleus often balances both. For exact formats use constrained decoding.`,
      `${ku}: greedy جێگیرە بەڵام دووبارە؛ sampling داهێنەرانەیە بەڵام مەترسیدار. بۆ JSON decodingی سنووردار بەکاربهێنە.`,
    ),
  })
}

// ——— Finetuning (103-110)
const ftSpecs = [
  ['full-finetune', 'Fine-tune کامل', 'الضبط الكامل', 'Full Fine-tuning', 'Fine-tuneی تەواو'],
  ['lora', 'LoRA', 'LoRA', 'LoRA', 'LoRA'],
  ['qlora', 'QLoRA', 'QLoRA', 'QLoRA', 'QLoRA'],
  ['instruction-tune', 'Instruction Tuning', 'ضبط التعليمات', 'Instruction Tuning', 'Instruction Tuning'],
  ['sft-vs-pref', 'SFT در برابر Preference', 'SFT مقابل التفضيل', 'SFT vs Preference', 'SFT بەرامبەر Preference'],
  ['rlhf', 'RLHF', 'RLHF', 'RLHF', 'RLHF'],
  ['dpo', 'DPO', 'DPO', 'DPO', 'DPO'],
  ['catastrophic', 'فراموشی فاجعه‌بار', 'النسيان الكارثي', 'Catastrophic Forgetting', 'لەبیرچوونەوەی کارەساتبار'],
]

for (const [id, fa, ar, en, ku] of ftSpecs) {
  add({
    id,
    category: 'finetuning',
    minutes: 11,
    tags: ['Fine-tuning', 'Alignment'],
    concepts: [en, 'Adapters', 'Alignment'],
    resources: [
      paper('LoRA', 'https://arxiv.org/abs/2106.09685'),
      paper('QLoRA', 'https://arxiv.org/abs/2305.14314'),
      paper('RLHF InstructGPT', 'https://arxiv.org/abs/2203.02155'),
    ],
    title: L(fa, ar, en, ku),
    summary: L(`تطبیق مدل: ${fa}.`, `تكييف النموذج: ${ar}.`, `Adapting models: ${en}.`, 'گونجاندنی مۆدێل: ' + ku),
    narration: L(
      `چگونه مدل پایه را با دادهٔ کمتر به رفتار مطلوب نزدیک کنیم؟`,
      'كيف نقرب النموذج الأساسي من السلوك المطلوب ببيانات أقل؟',
      'How do we steer a base model toward desired behavior with less data?',
      'چۆن مۆدێلی بنەڕەتی بە داتای کەمتر بەرەو ڕەفتاری خوازراو دەبەین؟',
    ),
    deepDive: L(
      `${fa} یکی از مسیرهای عملی برای سفارشی‌سازی LLM است. LoRA/QLoRA هزینه را کم می‌کنند؛ Instruction tuning قالب پیروی از دستور را یاد می‌دهد؛ RLHF/DPO ترجیح انسان را وارد می‌کند. همیشه مجموعهٔ ارزیابی جدا و پایش regression داشته باشید.`,
      `${ar} مسار عملي لتخصيص LLM. LoRA يقلل التكلفة وRLHF/DPO يدخلان التفضيل البشري. احتفظ بمجموعة تقييم منفصلة.`,
      `${en} is a practical customization path. LoRA/QLoRA cut cost; instruction tuning teaches follow-through; RLHF/DPO inject human preference. Keep a held-out eval and watch regressions.`,
      `${ku} ڕێگایەکی پراکتیکییە بۆ گونجاندنی LLM. LoRA تێچوون کەم دەکاتەوە و RLHF/DPO پەسەندکردنی مرۆڤ دەهێنێتە ناو.`,
    ),
  })
}

// ——— Eval & safety (111-118)
const evalSpecs = [
  ['benchmarks', 'بنچمارک‌های رایج', 'المعايير الشائعة', 'Common Benchmarks', 'بێنچمارکە باوەکان'],
  ['human-eval', 'ارزیابی انسانی', 'التقييم البشري', 'Human Evaluation', 'هەڵسەنگاندنی مرۆیی'],
  ['hallucination', 'توهم مدل', 'الهلوسة', 'Hallucinations', 'هەڵەبەست'],
  ['toxicity', 'سمّیت و سوگیری', 'السمية والتحيز', 'Toxicity & Bias', 'ژەهراوی و لایەنگری'],
  ['privacy', 'حریم خصوصی در LM', 'الخصوصية في LM', 'Privacy in LMs', 'تایبەتمەندی لە LM'],
  ['prompt-injection', 'تزریق پرامپت', 'حقن الأوامر', 'Prompt Injection', 'تزریقی پرۆمپت'],
  ['guardrails', 'گاردریل‌ها', 'الحواجز الواقية', 'Guardrails', 'پارێزەرەکان'],
  ['red-teaming', 'Red Teaming', 'الفريق الأحمر', 'Red Teaming', 'Red Teaming'],
]

for (const [id, fa, ar, en, ku] of evalSpecs) {
  add({
    id,
    category: 'eval-safety',
    minutes: 10,
    tags: ['Eval', 'Safety'],
    concepts: [en, 'Risk', 'Measurement'],
    resources: [
      paper('HELM', 'https://crfm.stanford.edu/helm/'),
      paper('OWASP LLM Top 10', 'https://owasp.org/www-project-top-10-for-large-language-model-applications/'),
    ],
    title: L(fa, ar, en, ku),
    summary: L(`سنجش و ایمنی: ${fa}.`, `القياس والسلامة: ${ar}.`, `Measurement & safety: ${en}.`, 'پێوان و سەلامەتی: ' + ku),
    narration: L(
      `مدل خوب فقط با loss پایین تعریف نمی‌شود؛ ایمنی و قابلیت اعتماد هم متریک می‌خواهند.`,
      'النموذج الجيد لا يُعرّف بالخسارة وحدها؛ السلامة أيضاً تحتاج مقاييس.',
      'A good model is not just low loss; safety and trust need metrics too.',
      'مۆدێلی باش تەنها lossی نزم نییە؛ سەلامەتیش پێوانەی دەوێت.',
    ),
    deepDive: L(
      `${fa} را به فرایند محصول وصل کنید: بنچمارک، ارزیابی انسانی، تست خصمانه، و پایش پس از استقرار. منابع OWASP و HELM نقطهٔ شروع معتبرند. برای زبان‌های فارسی/عربی/کوردی حتماً مجموعهٔ ارزیابی بومی بسازید؛ بنچمارک انگلیسی کافی نیست.`,
      `${ar} اربطه بعملية المنتج. OWASP وHELM بدايات موثوقة. ابنِ تقييماً محلياً للعربية.`,
      `${en} belongs in the product loop: benchmarks, human eval, adversarial tests, post-deploy monitoring. OWASP and HELM are solid starting points. Build native eval sets for FA/AR/KU; English-only is not enough.`,
      `${ku} بیبەستەوە بە پرۆسەی بەرهەم. بۆ کوردی سێتی هەڵسەنگاندنی خۆماڵی دروست بکە.`,
    ),
  })
}

// ——— Architectures (119-126)
const archSpecs = [
  ['vision-transformer', 'Vision Transformer', 'محول الرؤية', 'Vision Transformer', 'Vision Transformer'],
  ['whisper-asr', 'مدل‌های گفتار (Whisper)', 'نماذج الكلام', 'Speech Models', 'مۆدێلی قسە'],
  ['diffusion-intro', 'آشنایی با Diffusion', 'مقدمة في الانتشار', 'Diffusion Intro', 'ناساندنی Diffusion'],
  ['sparse-attn', 'Attention تنک', 'انتباه متفرق', 'Sparse Attention', 'Attentionی دەگمەن'],
  ['long-context', 'معماری Long-context', 'بنى السياق الطويل', 'Long-context Arch', 'تەلارسازی Long-context'],
  ['encoder-decoder-when', 'کی Enc–Dec؟', 'متى Enc–Dec؟', 'When Enc–Dec?', 'کەی Enc–Dec؟'],
  ['state-space', 'State Space Models', 'نماذج فضاء الحالة', 'State Space Models', 'State Space Models'],
  ['retrieval-arch', 'معماری بازیابی‌محور', 'بنى الاسترجاع', 'Retrieval Architectures', 'تەلارسازی Retrieval'],
]

for (const [id, fa, ar, en, ku] of archSpecs) {
  add({
    id,
    category: 'architectures',
    minutes: 11,
    tags: ['Architecture'],
    concepts: [en, 'Systems', 'Tradeoffs'],
    resources: [
      paper('ViT', 'https://arxiv.org/abs/2010.11929'),
      paper('Mamba', 'https://arxiv.org/abs/2312.00752'),
      paper('Whisper', 'https://arxiv.org/abs/2212.04356'),
    ],
    title: L(fa, ar, en, ku),
    summary: L(`گسترش معماری: ${fa}.`, `توسيع البنى: ${ar}.`, `Architecture expansion: ${en}.`, 'فراوانکردنی تەلارسازی: ' + ku),
    narration: L(
      `ایدهٔ Attention فقط متن نیست؛ به بینایی، گفتار و توالی‌های خیلی بلند هم رسیده است.`,
      'الانتباه ليس للنص فقط؛ امتد للرؤية والكلام والسياق الطويل.',
      'Attention is not text-only; it reached vision, speech, and ultra-long context.',
      'Attention تەنها بۆ دەق نییە؛ گەیشتووەتە بینین و قسە و دەوروبەری درێژ.',
    ),
    deepDive: L(
      `${fa} نشان می‌دهد چطور بلوک Transformer یا جایگزین‌هایش با tradeoff حافظه/کیفیت/تأخیر انتخاب می‌شوند. قبل از انتخاب، محدودیت محصول (latency، هزینه، طول ورودی) را بنویسید و مقالهٔ مرجع همان معماری را بخوانید.`,
      `${ar} يوضح مقايضات الذاكرة والجودة والتأخير. اكتب قيود المنتج واقرأ الورقة المرجعية.`,
      `${en} shows how Transformer blocks or alternatives are chosen under memory/quality/latency tradeoffs. Write product constraints first, then read the canonical paper.`,
      `${ku} نیشان دەدات چۆن لەنێوان بیرگە/کوالیتی/latency هەڵدەبژێردرێت. سەرەتا سنووری بەرهەم بنووسە.`,
    ),
  })
}

// ——— Engineering (127-134) — ensure >= 100; we already have more
const engSpecs = [
  ['inference-opt', 'بهینه‌سازی Inference', 'تحسين الاستدلال', 'Inference Optimization', 'باشترکردنی Inference'],
  ['quantization', 'Quantization', 'التكميم', 'Quantization', 'Quantization'],
  ['kv-cache', 'KV Cache', 'ذاكرة KV', 'KV Cache', 'KV Cache'],
  ['batching', 'Batching پویا', 'الدُفعات الديناميكية', 'Continuous Batching', 'Batchingی بەردەوام'],
  ['serving', 'سروینگ مدل', 'تقديم النموذج', 'Model Serving', 'خزمەتگوزاری مۆدێل'],
  ['observability', 'Observability', 'القابلية للرصد', 'Observability', 'چاودێریکردن'],
  ['eval-in-ci', 'ارزیابی در CI', 'التقييم في CI', 'Eval in CI', 'هەڵسەنگاندن لە CI'],
  ['cost-latency', 'هزینه و تأخیر', 'التكلفة والتأخير', 'Cost & Latency', 'تێچوون و Latency'],
]

for (const [id, fa, ar, en, ku] of engSpecs) {
  add({
    id,
    category: 'engineering',
    minutes: 10,
    tags: ['MLOps', 'Serving'],
    concepts: [en, 'Production', 'Latency'],
    resources: [
      paper('vLLM', 'https://arxiv.org/abs/2309.06180'),
      paper('HF Text Generation Inference', 'https://github.com/huggingface/text-generation-inference'),
      paper('NVIDIA TensorRT-LLM', 'https://github.com/NVIDIA/TensorRT-LLM'),
    ],
    title: L(fa, ar, en, ku),
    summary: L(`از آزمایشگاه تا پروداکشن: ${fa}.`, `من المختبر إلى الإنتاج: ${ar}.`, 'Lab to production: ' + en, 'لە تاقیگەوە بۆ پرۆداکشن: ' + ku),
    narration: L(
      `مدل در پروداکشن با محدودیت هزینه، تأخیر و پایداری روبه‌روست.`,
      'في الإنتاج يظهر قيد التكلفة والتأخير والاستقرار.',
      'Production brings cost, latency, and reliability constraints.',
      'لە پرۆداکشنا تێچوون و latency و جێگیری سنوورن.',
    ),
    deepDive: L(
      `${fa} را با اندازه‌گیری واقعی وصل کنید: tokens/sec، p95 latency، هزینهٔ هر ۱۰۰۰ توکن، و نرخ خطا. KV cache، quantization و batching اهرم‌های اصلی‌اند. مستندات vLLM و TensorRT-LLM منابع اجرایی خوبی هستند.`,
      `${ar} مع قياس حقيقي: tokens/sec وp95 والتكلفة. KV cache والتكميم والدُفعات روافع أساسية.`,
      `${en} needs real metrics: tokens/sec, p95 latency, cost per 1K tokens, error rate. KV cache, quantization, and batching are primary levers. vLLM and TensorRT-LLM docs are practical references.`,
      `${ku} پێویستی بە پێوانەی ڕاستەقینە هەیە: tokens/sec و latency و تێچوون. KV cache و quantization اهرمی سەرەکین.`,
    ),
  })
}

// ——— Classic ML models
const classicMl = [
  ['linear-regression', 'رگرسیون خطی', 'الانحدار الخطي', 'Linear Regression', 'ڕیگرێشنی هێڵی'],
  ['logistic-regression', 'رگرسیون لجستیک', 'الانحدار اللوجستي', 'Logistic Regression', 'ڕیگرێشنی لۆجیستیک'],
  ['knn', 'K-Nearest Neighbors', 'أقرب الجيران', 'KNN', 'KNN'],
  ['naive-bayes', 'Naive Bayes', 'نايف بايز', 'Naive Bayes', 'Naive Bayes'],
  ['decision-tree', 'درخت تصمیم', 'شجرة القرار', 'Decision Tree', 'درەختی بڕیار'],
  ['random-forest', 'Random Forest', 'الغابة العشوائية', 'Random Forest', 'Random Forest'],
  ['gradient-boosting', 'Gradient Boosting', 'التعزيز التدرجي', 'Gradient Boosting', 'Gradient Boosting'],
  ['xgboost', 'XGBoost / LightGBM / CatBoost', 'XGBoost وLightGBM', 'XGBoost Family', 'خێزانی XGBoost'],
  ['svm', 'ماشین بردار پشتیبان (SVM)', 'آلات المتجهات الداعمة', 'Support Vector Machines', 'SVM'],
  ['kmeans', 'K-Means', 'K-Means', 'K-Means Clustering', 'K-Means'],
  ['hierarchical-cluster', 'خوشه‌بندی سلسله‌مراتبی', 'التجميع الهرمي', 'Hierarchical Clustering', 'کۆمەڵەکردنی پلەبەپلە'],
  ['dbscan', 'DBSCAN', 'DBSCAN', 'DBSCAN', 'DBSCAN'],
  ['pca-classic', 'PCA', 'تحليل المكونات', 'PCA', 'PCA'],
  ['lda-classic', 'LDA / QDA', 'LDA/QDA', 'LDA & QDA', 'LDA و QDA'],
  ['gaussian-process', 'فرآیند گاوسی', 'العملية الغاوسية', 'Gaussian Processes', 'پرۆسەی گاوسی'],
  ['hmm', 'مدل مخفی مارکوف', 'نموذج ماركوف المخفي', 'Hidden Markov Models', 'HMM'],
  ['crf', 'Conditional Random Fields', 'الحقول العشوائية الشرطية', 'CRF', 'CRF'],
  ['ensemble-stacking', 'Ensemble و Stacking', 'التجميع والتكديس', 'Ensembles & Stacking', 'Ensemble و Stacking'],
]

for (const [id, fa, ar, en, ku] of classicMl) {
  add({
    id,
    category: 'classic-ml',
    minutes: 11,
    tags: ['Classic ML', 'Models'],
    concepts: [en, 'Baseline', 'Tabular'],
    resources: [
      paper('scikit-learn User Guide', 'https://scikit-learn.org/stable/user_guide.html'),
      paper('ISL Book', 'https://www.statlearning.com/'),
      paper('XGBoost docs', 'https://xgboost.readthedocs.io/'),
    ],
    title: L(fa, ar, en, ku),
    summary: L(`مدل کلاسیک: ${fa}.`, `نموذج كلاسيكي: ${ar}.`, `Classic model: ${en}.`, `مۆدێلی کلاسیکی: ${ku}.`),
    narration: L(
      `${fa} هنوز برای خطوط پایه، دادهٔ جدولی و سیستم‌های سبک حیاتی است.`,
      `${ar} ما زال أساسياً للخطوط الأساسية والبيانات الجدولية.`,
      `${en} remains essential for baselines, tabular data, and lightweight systems.`,
      `${ku} هێشتا بۆ baseline و داتای خشتەیی گرنگە.`,
    ),
    deepDive: L(
      `${fa} را با فرض‌ها، متریک مناسب، و مقایسه با مدل‌های پیچیده‌تر یاد بگیرید. در بسیاری از محصولات واقعی، یک مدل کلاسیک خوب از یک شبکهٔ عصبی ضعیف قابل‌اعتمادتر و ارزان‌تر است.`,
      `${ar} مع الافتراضات والمقياس والمقارنة. غالباً يتفوق نموذج كلاسيكي جيد على شبكة ضعيفة.`,
      `${en}: learn assumptions, right metrics, and fair comparisons. A strong classic model often beats a weak neural net on tabular problems.`,
      `${ku}: گریمانەکان و پێوانەکان فێربە. زۆرجار مۆدێلی کلاسیکی باش لە تۆڕی لاواز باشترە.`,
    ),
  })
}

// ——— Deep learning history timeline
const dlHistory = [
  ['hist-1943-mcculloch', '۱۹۴۳: McCulloch–Pitts', '١٩٤٣: McCulloch–Pitts', '1943: McCulloch–Pitts', '١٩٤٣: McCulloch–Pitts'],
  ['hist-1958-perceptron', '۱۹۵۸: Perceptron', '١٩٥٨: البرسبترون', '1958: Perceptron', '١٩٥٨: Perceptron'],
  ['hist-1969-ai-winter', '۱۹۶۹: نقد Perceptron و زمستان AI', '١٩٦٩: نقد البرسبترون', '1969: XOR critique & AI winter', '١٩٦٩: ڕەخنە و زستانی AI'],
  ['hist-1986-backprop', '۱۹۸۶: بازگشت Backprop', '١٩٨٦: عودة الانتشار العكسي', '1986: Backprop revival', '١٩٨٦: گەڕانەوەی Backprop'],
  ['hist-1989-cnn-lecun', '۱۹۸۹–۱۹۹۸: LeNet و CNN', '١٩٨٩–١٩٩٨: LeNet وCNN', '1989–1998: LeNet & CNNs', '١٩٨٩–١٩٩٨: LeNet و CNN'],
  ['hist-1997-lstm', '۱۹۹۷: LSTM', '١٩٩٧: LSTM', '1997: LSTM', '١٩٩٧: LSTM'],
  ['hist-2006-deep-belief', '۲۰۰۶: Deep Belief Nets', '٢٠٠٦: شبكات الاعتقاد العميق', '2006: Deep Belief Nets', '٢٠٠٦: Deep Belief Nets'],
  ['hist-2012-alexnet', '۲۰۱۲: AlexNet و ImageNet', '٢٠١٢: AlexNet', '2012: AlexNet breakthrough', '٢٠١٢: AlexNet'],
  ['hist-2014-gan-seq2seq', '۲۰۱۴: GAN و Seq2Seq+Attention', '٢٠١٤: GAN وSeq2Seq', '2014: GANs & Seq2Seq Attention', '٢٠١٤: GAN و Seq2Seq'],
  ['hist-2015-resnet', '۲۰۱۵: ResNet', '٢٠١٥: ResNet', '2015: ResNet', '٢٠١٥: ResNet'],
  ['hist-2017-transformer', '۲۰۱۷: Attention Is All You Need', '٢٠١٧: المحول', '2017: Transformer paper', '٢٠١٧: Transformer'],
  ['hist-2018-bert-gpt', '۲۰۱۸: BERT و GPT-1', '٢٠١٨: BERT وGPT', '2018: BERT & GPT-1', '٢٠١٨: BERT و GPT'],
  ['hist-2020-gpt3', '۲۰۲۰: GPT-3 و عصر مقیاس', '٢٠٢٠: GPT-3', '2020: GPT-3 scaling era', '٢٠٢٠: GPT-3'],
  ['hist-2022-chatgpt', '۲۰۲۲: ChatGPT و Alignment عمومی', '٢٠٢٢: ChatGPT', '2022: ChatGPT moment', '٢٠٢٢: ChatGPT'],
  ['hist-2023-multimodal', '۲۰۲۳: چندرسانه‌ای و عامل‌ها', '٢٠٢٣: متعدد الوسائط', '2023: Multimodal & agents', '٢٠٢٣: فرەمیدیایی و ئەجێنت'],
  ['hist-2024-2025-reason', '۲۰۲۴–۲۰۲۵: مدل‌های استدلال', '٢٠٢٤–٢٠٢٥: نماذج الاستدلال', '2024–2025: Reasoning models', '٢٠٢٤–٢٠٢٥: مۆدێلی ئاوەز'],
]

for (const [id, fa, ar, en, ku] of dlHistory) {
  add({
    id,
    category: 'dl-history',
    minutes: 8,
    tags: ['History', 'Timeline'],
    concepts: [en, 'Timeline', 'Milestones'],
    resources: [
      paper('Deep Learning Book', 'https://www.deeplearningbook.org/'),
      paper('Attention Is All You Need', 'https://arxiv.org/abs/1706.03762'),
      paper('AlexNet / ImageNet CNN', 'https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks'),
    ],
    title: L(fa, ar, en, ku),
    summary: L(`نقطه عطف تاریخچه: ${fa}.`, `محطة تاريخية: ${ar}.`, `History milestone: ${en}.`, `خاڵی مێژوویی: ${ku}.`),
    narration: L(
      `این ایستگاه زمانی نشان می‌دهد ایدهٔ فعلی از کجا آمده و چرا مهم شد.`,
      'توضح هذه المحطة من أين جاءت الفكرة الحالية ولماذا صارت مهمة.',
      'This timeline stop shows where today’s ideas came from and why they mattered.',
      'ئەم وێستگە کاتییە نیشان دەدات بیرۆکەی ئەمڕۆ لە کوێوە هاتووە.',
    ),
    deepDive: L(
      `${fa} را در بافت قبل/بعدش ببینید: چه مسئله‌ای حل شد، چه محدودیتی باقی ماند، و کدام مقاله یا سیستم نقطهٔ عطف بود. تاریخچه کمک می‌کند هیاهوی بازاری را از پیشرفت واقعی جدا کنید.`,
      `${ar} في سياقه السابق واللاحق. التاريخ يفصل الضجيج عن التقدم الحقيقي.`,
      `${en}: place it before/after neighboring milestones—what problem it solved, what remained hard, which paper/system marked the turn.`,
      `${ku}: لەگەڵ پێش/دوای خۆی بیبینە. مێژوو هایپ لە پێشکەوتنی ڕاستەقینە جیا دەکاتەوە.`,
    ),
  })
}

// ——— Modern LLM families & methods
const modernLlms = [
  ['gpt1-gpt2', 'GPT-1 و GPT-2', 'GPT-1 وGPT-2', 'GPT-1 & GPT-2', 'GPT-1 و GPT-2'],
  ['gpt3-instruct', 'GPT-3 و InstructGPT', 'GPT-3 وInstructGPT', 'GPT-3 & InstructGPT', 'GPT-3 و InstructGPT'],
  ['chatgpt-gpt4', 'ChatGPT و GPT-4', 'ChatGPT وGPT-4', 'ChatGPT & GPT-4', 'ChatGPT و GPT-4'],
  ['gpt4o-realtime', 'GPT-4o و مدل‌های بلادرنگ', 'GPT-4o واللحظي', 'GPT-4o & realtime', 'GPT-4o و ڕاستەوخۆ'],
  ['o1-o3-reasoning', 'o1 / o3: استدلال زنجیره‌ای', 'o1/o3 للاستدلال', 'o1/o3 Reasoning Models', 'o1/o3 مۆدێلی ئاوەز'],
  ['claude-family', 'خانواده Claude', 'عائلة Claude', 'Claude Family', 'خێزانی Claude'],
  ['gemini-family', 'خانواده Gemini', 'عائلة Gemini', 'Gemini Family', 'خێزانی Gemini'],
  ['llama-family', 'LLaMA / Llama 2 / 3 / 4', 'عائلة LLaMA', 'LLaMA Family', 'خێزانی LLaMA'],
  ['mistral-mixtral', 'Mistral و Mixtral (MoE)', 'Mistral وMixtral', 'Mistral & Mixtral', 'Mistral و Mixtral'],
  ['deepseek-qwen', 'DeepSeek و Qwen', 'DeepSeek وQwen', 'DeepSeek & Qwen', 'DeepSeek و Qwen'],
  ['how-gpt-works', 'روش کار مدل‌های GPT امروزی', 'كيف تعمل نماذج GPT', 'How modern GPT models work', 'چۆنیەتی کارکردنی GPTی ئەمڕۆ'],
  ['pretrain-data-mix', 'دادهٔ پیش‌آموزش و Data Mix', 'بيانات التدريب المسبق', 'Pretraining data mix', 'تێکەڵەی داتای پێشڕاهێنان'],
  ['posttrain-stack', 'پشته Post-training امروزی', 'مكدس ما بعد التدريب', 'Modern post-training stack', 'کۆمەڵەی post-training'],
  ['tool-use-modern', 'Tool-use و Function Calling', 'استدعاء الأدوات', 'Tool use & function calling', 'Tool-use و Function Calling'],
  ['long-context-modern', 'زمینه بلند در مدل‌های فعلی', 'السياق الطويل حالياً', 'Long context today', 'دەوروبەری درێژی ئەمڕۆ'],
  ['reasoning-testtime', 'استدلال در زمان تست', 'الحوسبة وقت الاختبار', 'Test-time compute', 'هەژماری کاتی تاقیکردنەوە'],
  ['synthetic-data', 'دادهٔ مصنوعی برای LLM', 'البيانات الاصطناعية', 'Synthetic data for LLMs', 'داتای دەستکرد بۆ LLM'],
  ['open-vs-closed', 'مدل باز در برابر بسته', 'مفتوح مقابل مغلق', 'Open vs closed models', 'کراوە بەرامبەر داخراو'],
  ['evals-lmsys', 'ارزیابی‌های روز: Arena و SWE-bench', 'تقييمات حديثة', 'Modern evals & arenas', 'هەڵسەنگاندنی نوێ'],
  ['future-agents', 'مسیر بعدی: عامل‌های قابل اتکا', 'المسار القادم: وكلاء موثوقون', 'Next: reliable agents', 'داهاتوو: ئەجێنتی متمانەپێکراو'],
]

for (const [id, fa, ar, en, ku] of modernLlms) {
  add({
    id,
    category: 'modern-llms',
    minutes: 12,
    tags: ['Modern LLM', 'GPT', 'Frontier'],
    concepts: [en, 'Frontier models', 'Systems'],
    resources: [
      paper('GPT-3', 'https://arxiv.org/abs/2005.14165'),
      paper('InstructGPT', 'https://arxiv.org/abs/2203.02155'),
      paper('Llama 2', 'https://arxiv.org/abs/2307.09288'),
      paper('OpenAI docs', 'https://platform.openai.com/docs'),
    ],
    title: L(fa, ar, en, ku),
    summary: L(`نقشه مدل‌های روز: ${fa}.`, `خريطة النماذج الحالية: ${ar}.`, `Current model map: ${en}.`, `نەخشەی مۆدێلی ئەمڕۆ: ${ku}.`),
    narration: L(
      `این موضوع روی وضعیت واقعی اکوسیستم LLM تمرکز دارد: معماری، آموزش، و الگوی استفاده.`,
      'يركز على واقع منظومة LLM: البنية والتدريب وأنماط الاستخدام.',
      'Focuses on the real LLM ecosystem: architecture, training, and usage patterns.',
      'سەرنج لەسەر واقیعی LLM: تەلارسازی، ڕاهێنان، و شێوازی بەکارهێنان.',
    ),
    deepDive: L(
      `${fa}: سه لایه را جدا کنید — ۱) پیش‌آموزش پایه، ۲) post-training (SFT/Preference/Reasoning)، ۳) محصول (tools، RAG، safety، eval). مدل‌های GPT، Claude، Gemini، LLaMA و DeepSeek در جزئیات فرق دارند ولی همین اسکلت مشترک را دارند. همیشه تاریخ انتشار، اندازهٔ زمینه، و نوع دسترسی را چک کنید.`,
      `${ar}: افصل بين التدريب المسبق وpost-training والمنتج. العائلات تختلف في التفاصيل لكنها تشترك في الهيكل.`,
      `${en}: separate (1) base pretraining, (2) post-training, (3) product layer. GPT/Claude/Gemini/LLaMA/DeepSeek differ in details but share this skeleton.`,
      `${ku}: سێ چین جیا بکەوە — پێشڕاهێنان، post-training، و بەرهەم.`,
    ),
  })
}

// ——— Newest 2025–2026 models & algorithms
const newest = [
  ['frontier-gpt5', 'GPT-5 و خانواده Frontier OpenAI', 'GPT-5 وعائلة OpenAI', 'GPT-5 & OpenAI frontier', 'GPT-5 و OpenAI'],
  ['claude-4-family', 'Claude 4 / Sonnet و Opus جدید', 'Claude 4', 'Claude 4 family', 'Claude 4'],
  ['gemini-2-5', 'Gemini 2.5 و مدل‌های Google', 'Gemini 2.5', 'Gemini 2.5 family', 'Gemini 2.5'],
  ['deepseek-r1', 'DeepSeek-R1 و استدلال باز', 'DeepSeek-R1', 'DeepSeek-R1', 'DeepSeek-R1'],
  ['qwen3-family', 'Qwen3 و مدل‌های Alibaba', 'Qwen3', 'Qwen3 family', 'Qwen3'],
  ['llama4-family', 'Llama 4 و اکوسیستم Meta', 'Llama 4', 'Llama 4 family', 'Llama 4'],
  ['grok-xai', 'Grok و مدل‌های xAI', 'Grok وxAI', 'Grok / xAI', 'Grok'],
  ['mla-attention', 'MLA: Multi-head Latent Attention', 'MLA', 'Multi-head Latent Attention', 'MLA'],
  ['flashattn3', 'FlashAttention-3', 'FlashAttention-3', 'FlashAttention-3', 'FlashAttention-3'],
  ['speculative-decoding', 'Speculative Decoding', 'التفكيك التخميني', 'Speculative Decoding', 'Speculative Decoding'],
  ['grpo-algo', 'GRPO و بهینه‌سازی ترجیح گروهی', 'GRPO', 'GRPO preference optimization', 'GRPO'],
  ['dit-diffusion', 'DiT: Diffusion Transformer', 'DiT', 'Diffusion Transformer (DiT)', 'DiT'],
  ['video-gen-2026', 'تولید ویدئو با مدل‌های ۲۰۲۶', 'توليد الفيديو 2026', '2026 video generation models', 'بەرهەمهێنانی ڤیدیۆی ٢٠٢٦'],
  ['agent-computer-use', 'Computer-use Agents', 'وكلاء استخدام الحاسوب', 'Computer-use agents', 'ئەجێنتی کۆمپیوتەر'],
  ['onnx-runtime-edge', 'استقرار لبه‌ای و ONNX/TensorRT', 'النشر الطرفي', 'Edge serving ONNX/TensorRT', 'Edge و ONNX'],
]

for (const [id, fa, ar, en, ku] of newest) {
  add({
    id,
    category: 'modern-llms',
    minutes: 10,
    tags: ['2026', 'Frontier', 'New'],
    concepts: [en, 'State of the art', 'Practice'],
    interactive: id.includes('attn') || id.includes('flash') ? 'attention-focus' : 'quiz',
    formula: L(
      'سیستم روز ≈ Prefill + Decode + Tools + Guardrails',
      'النظام الحالي ≈ Prefill + Decode + Tools + Guardrails',
      'Modern stack ≈ Prefill + Decode + Tools + Guardrails',
      'کۆمەڵەی نوێ ≈ Prefill + Decode + Tools + Guardrails',
    ),
    resources: [
      paper('OpenAI docs', 'https://platform.openai.com/docs'),
      paper('Anthropic docs', 'https://docs.anthropic.com/'),
      paper('Google AI docs', 'https://ai.google.dev/'),
      paper('DeepSeek', 'https://github.com/deepseek-ai'),
    ],
    title: L(fa, ar, en, ku),
    summary: L(`جدیدترین جریان: ${fa}.`, `أحدث مسار: ${ar}.`, `Latest wave: ${en}.`, `نوێترین شەپۆل: ${ku}.`),
    deepDive: L(
      `${fa} را با سه سؤال چک کن: چه داده‌ای؟ چه post-training؟ چه محدودیت محصولی (قیمت، تأخیر، ایمنی)؟ منابع رسمی فروشنده را همیشه به شایعه ترجیح بده.`,
      `${ar}: تحقق من البيانات وpost-training وقيود المنتج. فضل الوثائق الرسمية.`,
      `${en}: check data, post-training, and product constraints (cost/latency/safety). Prefer vendor docs over rumors.`,
      `${ku}: داتا، post-training، و سنووری بەرهەم بپشکنە.`,
    ),
  })
}

const out = `/* Auto-generated by scripts/generate-topics.mjs — do not edit by hand */
import type { Category, Topic } from '../../types/course'

export const categories: Category[] = ${JSON.stringify(categories, null, 2)}

export const topics: Topic[] = ${JSON.stringify(topics, null, 2)}

export const topicCount = topics.length

export function getTopic(id: string) {
  return topics.find((t) => t.id === id)
}

export function getTopicsByCategory(categoryId: string) {
  return topics.filter((t) => t.category === categoryId)
}

export function searchTopics(query: string, locale: keyof Topic['title']) {
  const q = query.trim().toLowerCase()
  if (!q) return topics
  return topics.filter((t) => {
    const blob = [
      t.title[locale],
      t.summary[locale],
      t.narration[locale],
      ...t.tags,
      ...t.concepts,
      t.id,
    ]
      .join(' ')
      .toLowerCase()
    return blob.includes(q)
  })
}
`

writeFileSync(join(__dirname, '../src/data/topics/catalog.ts'), out, 'utf8')
console.log(`Generated ${topics.length} topics across ${categories.length} categories`)
