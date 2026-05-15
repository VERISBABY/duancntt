(function () {
  'use strict';

  // 0. i18n DICTIONARY 
  // The translation map. Each top-level key holds two strings: one for English
  // (`en`) and one for Vietnamese (`vi`). Keys appear in DOM via the data-i18n
  // family of attributes; see applyI18n() for the lookup behaviour.
  //
  // Strings may contain trusted HTML (only used with data-i18n-html). All
  // strings are author-controlled — no user input enters this map.
  //
  // Tone & register conventions for the Vietnamese half:
  //  • Formal academic register, addressing a clinical / research audience.
  //  • Technical terms (model names, layer names, numeric hyperparameters)
  //    stay in their original Latin script.
  //  • Field-specific anglicisms common in Vietnamese ML literature stay
  //    untranslated (e.g. backbone, pipeline, encoder) where the Vietnamese
  //    equivalent would be either obscure or longer than helpful.
  const I18N = {
    /* Navigation */
    'nav.problem':       { en: 'Problem',         vi: 'Vấn đề' },
    'nav.method':        { en: 'Method',          vi: 'Phương pháp' },
    'nav.data':          { en: 'Data',            vi: 'Dữ liệu' },
    'nav.results':       { en: 'Results',         vi: 'Kết quả' },
    'nav.samples':       { en: 'Predictions',     vi: 'Dự đoán' },
    'nav.reproduce':     { en: 'Reproducibility', vi: 'Tái lập' },
    'nav.cta':           { en: 'Cite this work →',vi: 'Trích dẫn →' },
    /* The language toggle shows the *destination* language as its label.
       When site is in EN, button says "Tiếng Việt"; in VI, says "English". */
    'nav.langSwitch':    { en: 'Tiếng Việt',     vi: 'English' },
    'nav.langSwitchAria':{ en: 'Switch language to Vietnamese',
                           vi: 'Chuyển sang tiếng Anh' },
    'nav.toggleOpen':    { en: 'Open navigation menu',
                           vi: 'Mở menu điều hướng' },

    /* Hero */
    'hero.xrayLabel':    { en: 'INPUT · CHEST X-RAY',
                           vi: 'ĐẦU VÀO · X-QUANG NGỰC' },
    'hero.questionTag':  { en: 'QUESTION · VIETNAMESE',
                           vi: 'CÂU HỎI · TIẾNG VIỆT' },
    'hero.eyebrow':      { en: 'Undergraduate IT Project · Ton Duc Thang University · 2025–2026',
                           vi: 'Dự án CNTT · Trường Đại học Tôn Đức Thắng · 2025–2026' },
    'hero.title':        { en: 'Advancing Vietnamese<br><em>Visual Question Answering</em><br><span class="hero__title-tail">for healthcare.</span>',
                           vi: 'Phát triển <em>Hệ thống Hỏi&nbsp;đáp Hình ảnh</em><br>Y khoa <span class="hero__title-tail">cho tiếng Việt.</span>' },
    'hero.lede':         { en: 'An end-to-end Vietnamese Medical VQA system designed to answer free-form clinical questions regarding diverse medical imagery (including chest X-rays, brain MRIs, etc...). Built on a custom architecture combines <strong>two frozen vision encoders (BiomedCLIP and DINOv3)</strong> with a Vietnamese clinical language model (<strong>ViHealthBERT</strong>) and a <strong>Qwen2.5-3B</strong> generative backbone, bridged via a <strong>Multi-Scale Cross-Attention</strong> mechanism. Additionally, we introduce <strong>specialized medical data processing procedures</strong>, including a corpus-derived dynamic-programming syllable re-segmenter and a novel <strong>Clinical-Token Priority Loss (CTPL)</strong> function.',
                           vi: 'Hệ thống VQA y tế tiếng Việt hoàn chỉnh được thiết kế để trả lời các câu hỏi lâm sàng dạng tự do liên quan đến nhiều loại hình ảnh y tế khác nhau (bao gồm X-quang ngực, MRI não, v.v...). Hệ thống được xây dựng trên kiến ​​trúc tùy chỉnh kết hợp <strong>hai bộ mã hóa hình ảnh cố định (BiomedCLIP và DINOv3)</strong> với mô hình ngôn ngữ lâm sàng tiếng Việt (<strong>ViHealthBERT</strong>) và hệ thống tạo sinh <strong>Qwen2.5-3B</strong>, được kết nối thông qua cơ chế <strong>Chú ý chéo đa tỷ lệ (Multi-Scale Cross-Attention)</strong>. Ngoài ra, chúng tôi giới thiệu các <strong>quy trình xử lý dữ liệu y tế chuyên biệt</strong>, bao gồm bộ phân đoạn lại âm tiết lập trình động dựa trên ngữ liệu và hàm <strong>Mất mát ưu tiên mã thông báo lâm sàng (CTPL)</strong> mới.' },
    'hero.affiliation':  { en: 'Faculty of Information Technology — Ton Duc Thang University, Ho Chi Minh City, Vietnam',
                           vi: 'Khoa Công nghệ Thông tin — Trường Đại học Tôn Đức Thắng, Thành phố Hồ Chí Minh, Việt Nam' },
    'hero.ctaResults':   { en: 'See the results',     vi: 'Xem kết quả' },
    'hero.ctaAuthors':   { en: 'Author links',        vi: 'Liên hệ tác giả' },
    'hero.metricsCaption':{ en: 'Test set · 800 samples · beam-4 decoding',
                            vi: 'Tập kiểm thử · 800 mẫu · giải mã beam-4' },
    'hero.deltaR':       { en: '+14.07 over Qwen2.5-VL', vi: '+14.07 so với Qwen2.5-VL' },
    'hero.deltaB':       { en: '+14.47 over Qwen2.5-VL', vi: '+14.47 so với Qwen2.5-VL' },
    'hero.deltaM':       { en: '+11.57 over Qwen2.5-VL', vi: '+11.57 so với Qwen2.5-VL' },
    'hero.mdrTag':       { en: 'clinical recall',  vi: 'recall lâm sàng' },
    'hero.metricsFootnote':{ en: 'Comparison: our beam-4 score vs Qwen2.5-VL-3B (zero-shot, greedy decoding). Under matched greedy decoding our system reaches 53.06 / 24.65 / 64.58 — also above every baseline.',
                             vi: 'So sánh: điểm beam-4 của hệ thống vs Qwen2.5-VL-3B (zero-shot, giải mã tham lam). Cùng phương thức giải mã tham lam, hệ thống đạt 53,06 / 24,65 / 64,58 — vẫn vượt mọi baseline.' },
    'hero.bottomRule':   { en: 'chest X-ray · Vietnamese clinical questions · free-form answers',
                           vi: 'X-quang ngực · câu hỏi lâm sàng tiếng Việt · câu trả lời tự do' },

    /* Section 01 — Problem */
    'problem.kicker':    { en: '01 — The gap', vi: '01 — Khoảng trống' },
    'problem.title':     { en: 'Vietnamese clinicians are reading the same images as everyone else. They\u2019re asking questions in their own language. Today\u2019s medical AI barely listens.',
                           vi: 'Bác sĩ Việt Nam đọc cùng những hình ảnh như mọi nơi khác. Họ đặt câu hỏi bằng tiếng mẹ đẻ. AI y khoa hiện nay gần như không lắng nghe.' },
    'problem.cell1':     { en: 'chest-X-ray Q–A pairs we translated from MIMIC-CXR and VQA-RAD, a combined Vietnamese dataset that has never existed before.',
                           vi: 'cặp câu hỏi-trả lời X-quang ngực được dịch từ MIMIC-CXR và VQA-RAD, một bộ dữ liệu kết hợp Tiếng Việt chưa từng tồn tại trước đây.' },
    'problem.cell2':     { en: 'NVIDIA T4 GPU. The entire training pipeline fits within the memory of a free Kaggle session.',
                           vi: 'GPU NVIDIA T4. Toàn bộ pipeline huấn luyện vừa vặn trong bộ nhớ của một phiên Kaggle miễn phí.' },
    'problem.cell3':     { en: 'parameters: our budget, against published vision-language models ranging from 2B to 4B that we benchmark zero-shot.',
                           vi: 'tham số: ngân sách của chúng tôi, đối đầu với các mô hình thị giác-ngôn ngữ từ 2B đến 4B mà chúng tôi đánh giá zero-shot.' },
    'problem.prose1':    { en: 'Vietnamese is an analytic language with unmarked word boundaries: spaces separate <em>syllables</em>, not semantic words. Multilingual encoders trained on space-separated languages systematically degrade on Vietnamese clinical text — the very text that contains the patient\u2019s symptoms, the radiologist\u2019s impression, and the question a doctor actually wants answered.',
                           vi: 'Tiếng Việt là ngôn ngữ phân tích với ranh giới từ không được đánh dấu: dấu cách phân tách <em>âm tiết</em>, chứ không phải từ ngữ-nghĩa. Các encoder đa ngôn ngữ được huấn luyện trên các ngôn ngữ phân-tách-bằng-dấu-cách suy giảm chất lượng có hệ thống khi xử lý văn bản lâm sàng tiếng Việt — chính là văn bản chứa triệu chứng bệnh nhân, nhận định của bác sĩ X-quang, và câu hỏi mà bác sĩ thực sự cần lời giải.' },
    'problem.prose2':    { en: 'Our hypothesis: <strong>a small system built specifically for Vietnamese medical language will outperform much larger general-purpose models on Vietnamese medical tasks.</strong> This project tests it.',
                           vi: 'Giả thuyết của chúng tôi: <strong>một hệ thống nhỏ được xây dựng riêng cho ngôn ngữ y khoa tiếng Việt sẽ vượt qua các mô hình đa-năng lớn hơn nhiều trên các nhiệm vụ y khoa tiếng Việt.</strong> Đồ án này kiểm chứng giả thuyết đó.' },

    /* Section 02 — Method */
    'method.kicker':     { en: '02 — Method',                              vi: '02 — Phương pháp' },
    'method.title':      { en: 'Four modules. One T4 GPU. A pipeline shaped by Vietnamese clinical text.',
                           vi: 'Bốn mô-đun. Một GPU T4. Một pipeline được định hình bởi văn bản lâm sàng tiếng Việt.' },
    'method.archiAlt':   { en: 'Architecture overview: chest X-ray and Vietnamese question flow through IEM, QEM, MSCAv2, and TAM modules to produce a Vietnamese answer.',
                           vi: 'Tổng quan kiến trúc: X-quang ngực và câu hỏi tiếng Việt đi qua các mô-đun IEM, QEM, MSCAv2 và TAM để sinh ra câu trả lời tiếng Việt.' },
    'method.archiCaption':{en: '<span class="archi__caption-num">Figure 1</span> End-to-end architecture. Frozen biomedical encoders feed a custom cross-attention adapter; a 4-bit quantized Qwen2.5-3B generates the answer. Only the colored modules are trainable.',
                          vi: '<span class="archi__caption-num">Hình 1</span> Kiến trúc đầu-cuối. Các encoder y-sinh đông cứng đưa đặc trưng vào một adapter cross-attention tùy chỉnh; Qwen2.5-3B lượng tử hóa 4-bit sinh ra câu trả lời. Chỉ các mô-đun có màu là được huấn luyện.' },
    'method.iemNum':     { en: 'Figure 2 · Image-Embedding Module (IEM)',
                           vi: 'Hình 2 · Mô-đun Embedding Hình ảnh (IEM)' },
    'method.iemTitle':   { en: 'Two frozen vision encoders, one trainable bridge.',
                           vi: 'Hai encoder thị giác đông cứng, một cầu nối có thể huấn luyện.' },
    'method.iemAlt':     { en: 'IEM diagram showing an augmented chest X-ray feeding two frozen vision encoders (BiomedCLIP and DINOv3) in parallel, with DINOv3 features passing through a trainable projection (dim_proj). The two streams merge into two outputs: enhanced_global (low-frequency context) and enhanced_local (fine-grained anatomy).',
                           vi: 'Sơ đồ IEM thể hiện một X-quang ngực đã được augment đi vào hai encoder thị giác đông cứng (BiomedCLIP và DINOv3) song song, với đặc trưng từ DINOv3 đi qua một projection có thể huấn luyện (dim_proj). Hai luồng hợp nhất thành hai đầu ra: enhanced_global (ngữ cảnh tần số thấp) và enhanced_local (giải phẫu chi tiết).' },
    'method.iemBody':    { en: 'The augmented X-ray flows through <strong>BiomedCLIP ViT-B/16</strong> and <strong>DINOv3 ViT-S/16</strong> in parallel. BiomedCLIP contributes domain-aligned <em>biomedical-text-trained</em> features at the global level; DINOv3 contributes self-supervised <em>structural</em> features at the patch level, projected by the trainable <code>dim_proj</code> layer to match the shared 768-dimensional space. The module emits two heterogeneous outputs — <code>enhanced_global</code> for low-frequency context and <code>enhanced_local</code> for fine-grained anatomical regions — which the MSCA adapter consumes downstream. Keeping both encoders frozen is what makes single-T4 training feasible.',
                           vi: 'X-quang đã augment đi qua <strong>BiomedCLIP ViT-B/16</strong> và <strong>DINOv3 ViT-S/16</strong> song song. BiomedCLIP đóng góp đặc trưng được căn chỉnh theo lĩnh vực, <em>huấn luyện với văn bản y-sinh</em>, ở cấp độ toàn cục; DINOv3 đóng góp đặc trưng <em>cấu trúc</em> tự-giám-sát ở cấp độ patch, được lớp <code>dim_proj</code> có-thể-huấn-luyện chiếu vào không gian 768 chiều chung. Mô-đun phát ra hai đầu ra dị-chủng — <code>enhanced_global</code> cho ngữ cảnh tần-số-thấp và <code>enhanced_local</code> cho các vùng giải phẫu chi tiết — mà adapter MSCA sẽ tiêu thụ ở các bước sau. Việc đông cứng cả hai encoder là điều cho phép huấn luyện trên một GPU T4 duy nhất.' },
    'method.p1Title':    { en: 'A Vietnamese-aware text pipeline.',
                           vi: 'Một pipeline văn bản hiểu tiếng Việt.' },
    'method.p1Body':     { en: 'A dynamic-programming syllable re-segmenter splits concatenated tokens (<code>timtrungthất</code> → <code>tim trung thất</code>) before tokenization, followed by Underthesea word segmentation and Unicode NFC normalization. This single intervention drives the largest measured gain in our ablation.',
                           vi: 'Một bộ tách lại âm tiết bằng quy hoạch động chia các token bị ghép (<code>timtrungthất</code> → <code>tim trung thất</code>) trước khi tokenize, sau đó là tách từ bằng Underthesea và chuẩn hóa Unicode NFC. Riêng can thiệp này tạo ra mức cải thiện đo-được lớn nhất trong nghiên cứu ablation của chúng tôi.' },
    'method.p1L1':       { en: 'Custom DP re-segmenter, corpus-derived word frequencies',
                           vi: 'Bộ tách-lại DP tùy chỉnh, tần suất từ rút từ ngữ liệu' },
    'method.p1L2':       { en: 'ViHealthBERT encoder with LoRA r=8',
                           vi: 'Encoder ViHealthBERT với LoRA r=8' },
    'method.p1L3':       { en: 'Semantically safe augmentation for clinical text',
                           vi: 'Augmentation giữ-nguyên-ngữ-nghĩa cho văn bản lâm sàng' },
    'method.p2Title':    { en: 'A dual vision backbone for medical evidence.',
                           vi: 'Backbone thị giác kép cho chứng cứ y khoa.' },
    'method.p2Body':     { en: 'BiomedCLIP provides domain-aligned features; DINOv3 provides self-supervised global structure. Both encoders stay frozen, only a small trainable projection head bridges them to the language stack, keeping training tractable on a single T4.',
                           vi: 'BiomedCLIP cung cấp đặc trưng được căn-chỉnh-theo-lĩnh-vực; DINOv3 cung cấp cấu trúc toàn cục tự-giám-sát. Cả hai encoder đều đông cứng, chỉ một đầu projection nhỏ có-thể-huấn-luyện nối chúng với stack ngôn ngữ, giúp huấn luyện khả thi trên một T4 duy nhất.' },
    'method.p2L1':       { en: 'BiomedCLIP ViT-B/16 (frozen) · 224×224 input',
                           vi: 'BiomedCLIP ViT-B/16 (đông cứng) · đầu vào 224×224' },
    'method.p2L2':       { en: 'DINOv3 ViT-S/16 (frozen) · self-supervised general features',
                           vi: 'DINOv3 ViT-S/16 (đông cứng) · đặc trưng tổng quát tự-giám-sát' },
    'method.p2L3':       { en: 'Trainable <code>dim_proj</code> · 384 → 768',
                           vi: 'Lớp <code>dim_proj</code> có thể huấn luyện · 384 → 768' },
    'method.p3Title':    { en: 'Clinical-token priority for what matters.',
                           vi: 'Ưu tiên token lâm sàng cho điều thực sự quan trọng.' },
    'method.p3Body':     { en: 'Standard cross-entropy weights every token equally. CTPL identifies the top-1500 clinically meaningful Vietnamese tokens (anatomy, pathology, negators) and up-weights them by <code>w<sub>clin</sub> = 1.8</code> during training, so the loss is paying attention to the same words a radiologist would.',
                           vi: 'Cross-entropy chuẩn đặt trọng số bằng nhau cho mọi token. CTPL xác định top-1500 token tiếng Việt có ý nghĩa lâm sàng (giải phẫu, bệnh lý, từ phủ định) và tăng trọng số chúng lên <code>w<sub>clin</sub> = 1.8</code> trong quá trình huấn luyện, để hàm loss chú ý vào đúng những từ mà một bác sĩ X-quang sẽ chú ý.' },
    'method.p3L1':       { en: 'Clinical-Token Priority Loss (novel contribution)',
                           vi: 'Clinical-Token Priority Loss (đóng góp mới)' },
    'method.p3L2':       { en: 'Label smoothing <code>ε = 0.05</code>',
                           vi: 'Làm trơn nhãn <code>ε = 0,05</code>' },
    'method.p3L3':       { en: 'MSCAv2: 3 layers × 8 heads × dim 256',
                           vi: 'MSCAv2: 3 lớp × 8 head × dim 256' },

    /* Section 03 — Data processing */
    'data.kicker':       { en: '03 — Data processing', vi: '03 — Xử lý dữ liệu' },
    'data.title':        { en: 'Specialized preprocessing for <em>chest imagery</em> and <em>Vietnamese clinical text.</em>',
                           vi: 'Tiền xử lý chuyên biệt cho <em>hình ảnh ngực</em> và <em>văn bản lâm sàng tiếng Việt.</em>' },
    'data.sub':          { en: 'Off-the-shelf preprocessing fails on medical X-rays (low dynamic range, embedded annotations) and on Vietnamese clinical text (concatenated syllables from imperfect translation, foreign drug names, medical abbreviations that no general-purpose tokenizer knows). Each pipeline below was custom-built to handle the edge cases we found in our translated VQA-RAD + MIMIC-CXR corpus.',
                           vi: 'Tiền xử lý có sẵn thất bại trên X-quang y khoa (dải động thấp, chú thích nhúng) và trên văn bản lâm sàng tiếng Việt (các âm tiết bị ghép do dịch không hoàn hảo, tên thuốc ngoại, viết tắt y khoa mà không tokenizer đa-năng nào biết). Mỗi pipeline dưới đây được xây-dựng-riêng để xử lý các trường hợp biên mà chúng tôi gặp trong ngữ liệu VQA-RAD + MIMIC-CXR đã dịch.' },
    'data.imgKicker':    { en: '3.1 · Image enhancement', vi: '3.1 · Tăng cường hình ảnh' },
    'data.imgTitle':     { en: 'CLAHE plus photometric perturbation surfaces anatomical detail.',
                           vi: 'CLAHE kết hợp nhiễu loạn quang trắc làm lộ rõ chi tiết giải phẫu.' },
    'data.imgLede':      { en: 'Chest X-rays from MIMIC-CXR vary widely in contrast and exposure. During training we apply <strong>LongestMaxSize + PadIfNeeded</strong> (geometry), <strong>Rotate ±3°</strong>, <strong>BrightnessContrast ±10 %</strong>, <strong>CLAHE</strong> (clip 2.0, tile 8×8), and <strong>GaussNoise</strong> is a sequence tuned to be aggressive enough to regularize the frozen encoders, but conservative enough that no clinical finding is erased.',
                           vi: 'X-quang ngực từ MIMIC-CXR rất chênh lệch về độ tương phản và phơi sáng. Trong huấn luyện, chúng tôi áp dụng <strong>LongestMaxSize + PadIfNeeded</strong> (hình học), <strong>Rotate ±3°</strong>, <strong>BrightnessContrast ±10 %</strong>, <strong>CLAHE</strong> (clip 2,0, tile 8×8), và <strong>GaussNoise</strong> là một chuỗi được tinh chỉnh đủ mạnh để regularize các encoder đông-cứng, nhưng đủ giữ-gìn để không xóa đi bất kỳ phát hiện lâm sàng nào.' },
    'data.imgFigAlt':    { en: 'Side-by-side comparison of a chest X-ray before and after enhancement. The left panel shows the original image with low contrast and washed-out detail; the right panel shows the same image after CLAHE and photometric perturbation, with sharper anatomical structures and more visible features.',
                           vi: 'So sánh cạnh-cạnh một ảnh X-quang ngực trước và sau khi tăng cường. Khung trái cho thấy ảnh gốc với độ tương phản thấp và chi tiết bị mờ; khung phải cho thấy chính ảnh đó sau CLAHE và nhiễu loạn quang trắc, với cấu trúc giải phẫu sắc nét hơn và đặc trưng dễ thấy hơn.' },
    'data.imgCaption':   { en: '<span class="dataproc-figure__num">Figure 3</span> Here\u2019s an example of an image before and after enhancement. We can see that the image on the right, after enhancement processing, looks clearer with more detail and object features, helping to identify abnormalities and improve diagnostic accuracy.',
                           vi: '<span class="dataproc-figure__num">Hình 3</span> Đây là một ví dụ về một ảnh trước và sau khi tăng cường. Có thể thấy ảnh bên phải, sau khi xử lý tăng cường, trông rõ hơn với nhiều chi tiết và đặc trưng đối tượng hơn, giúp nhận diện các bất thường và cải thiện độ chính xác chẩn đoán.' },
    'data.txtKicker':    { en: '3.2 · Vietnamese text preprocessing',
                           vi: '3.2 · Tiền xử lý văn bản tiếng Việt' },
    'data.txtTitle':     { en: 'A pipeline shaped by every edge case in real clinical Vietnamese.',
                           vi: 'Một pipeline được định hình bởi mọi trường hợp biên của tiếng Việt lâm sàng thực tế.' },
    'data.txtLede':      { en: 'The translation pass from English to Vietnamese left the corpus full of small, hard-to-detect failures: dropped spaces, abbreviated short-forms, mixed-language drug names. Rather than hand-patching each, we built a <strong>lexicon-driven pipeline</strong> with a 41,579-entry syllable dictionary, regex-based abbreviation expansion, and a novel <strong>dynamic-programming re-segmenter</strong> that can split arbitrary concatenations into valid Vietnamese syllables, or leave them alone when no valid split exists.',
                           vi: 'Bước dịch từ tiếng Anh sang tiếng Việt để lại trong ngữ liệu vô số lỗi nhỏ, khó phát hiện: dấu cách bị bỏ, viết-tắt rút gọn, tên thuốc trộn ngôn ngữ. Thay vì vá thủ công từng trường hợp, chúng tôi xây một <strong>pipeline dẫn-bởi-từ-điển</strong> với từ điển âm tiết 41.579 mục, mở rộng viết tắt dựa trên regex, và một <strong>bộ tách-lại bằng quy hoạch động</strong> mới, có thể tách các chuỗi ghép tùy ý thành những âm tiết tiếng Việt hợp lệ, hoặc để nguyên khi không có cách tách hợp lệ.' },
    'data.txtFigAlt':    { en: 'Two-stage text preprocessing pipeline. Stage 0 is the source: English VQA-RAD and MIMIC-CXR translated to Vietnamese. Data-prep time (yellow, runs once for both Q and A): build syllable lexicon, Unicode NFC, abbreviation expansion, DP syllable re-segmenter, underthesea word tokenization, then store as train/val/test CSV. Train-time (blue, every batch, question only): synonym replace, word dropout, template swap, stochastic router. Output feeds the QEM module.',
                           vi: 'Pipeline tiền xử lý văn bản hai-giai-đoạn. Giai đoạn 0 là nguồn: VQA-RAD và MIMIC-CXR tiếng Anh được dịch sang tiếng Việt. Thời điểm chuẩn-bị-dữ-liệu (vàng, chạy một lần cho cả Q và A): xây từ điển âm tiết, Unicode NFC, mở rộng viết tắt, bộ tách-lại âm tiết DP, tokenize từ bằng underthesea, sau đó lưu thành CSV train/val/test. Thời điểm huấn luyện (xanh, mỗi batch, chỉ câu hỏi): thay thế từ đồng nghĩa, dropout từ, hoán đổi mẫu, router ngẫu nhiên. Đầu ra đi vào mô-đun QEM.' },
    'data.txtCaption':   { en: '<span class="dataproc-figure__num">Figure 4</span> Two-stage architecture. <strong>Data-prep time</strong> (yellow) runs once over the entire corpus and applies to both questions and answers; its output is cached to CSV. <strong>Train-time</strong> (blue) augments only the question, per batch, via a stochastic router that selects at most one technique, preserving the ground-truth answer.',
                           vi: '<span class="dataproc-figure__num">Hình 4</span> Kiến trúc hai-giai-đoạn. <strong>Giai đoạn chuẩn-bị-dữ-liệu</strong> (vàng) chạy một lần trên toàn ngữ liệu, áp dụng cho cả câu hỏi và câu trả lời; đầu ra được cache thành CSV. <strong>Giai đoạn huấn luyện</strong> (xanh) chỉ augment câu hỏi theo từng batch, qua một router ngẫu nhiên chọn nhiều nhất một kỹ thuật, giữ nguyên câu trả lời tham chiếu.' },
    'data.casesTitle':   { en: 'Six cases from our test suite, every technique, every edge case.',
                           vi: 'Sáu trường hợp từ bộ test, đủ mọi kỹ thuật, mọi trường hợp biên.' },
    'data.casesSub':     { en: 'Each card shows the raw input (the kind of text we actually receive from translation) and the output our pipeline produces. Underscores in the processed form mark multi-syllable words that the Underthesea tokenizer joined for ViHealthBERT, e.g. <code>ung_thư</code> = \u201Ccancer\u201D as one semantic unit.',
                           vi: 'Mỗi thẻ thể hiện đầu vào thô (loại văn bản chúng tôi thực sự nhận được từ bước dịch) và đầu ra mà pipeline của chúng tôi tạo ra. Các dấu gạch dưới trong dạng đã xử lý đánh dấu những từ đa-âm-tiết mà tokenizer Underthesea đã nối lại cho ViHealthBERT, ví dụ <code>ung_thư</code> = \u201Cung thư\u201D như một đơn vị ngữ nghĩa.' },

    /* The 6 textcase tags + notes. The Vietnamese demo data (raw / out lines)
       stays untranslated — it IS the demonstration. */
    'case.raw':          { en: 'Raw input',      vi: 'Đầu vào thô' },
    'case.out':          { en: 'After pipeline', vi: 'Sau pipeline' },
    'case.tagAbbr':      { en: 'Abbreviation expansion',    vi: 'Mở rộng viết tắt' },
    'case.tagMri':       { en: 'MRI / CT tokens',           vi: 'Token MRI / CT' },
    'case.tagArtifact':  { en: 'Translation artifact (concatenated)',
                           vi: 'Lỗi từ bước dịch (bị ghép)' },
    'case.tagUnseen':    { en: 'Never-seen concatenation (graceful)',
                           vi: 'Chuỗi-ghép chưa từng thấy (xử lý mềm)' },
    'case.tagMixed':     { en: 'Mixed problems',  vi: 'Vấn đề hỗn hợp' },
    'case.tagForeign':   { en: 'Foreign medical term (left alone)',
                           vi: 'Thuật ngữ y khoa ngoại (giữ nguyên)' },
    'case.noteAbbr':     { en: 'Short-forms <code>HA</code>, <code>BN</code>, and <code>mmHg</code> are expanded to their full Vietnamese clinical terms by a curated regex rule set, then Underthesea joins multi-syllable medical terms with underscores.',
                           vi: 'Các từ viết tắt <code>HA</code>, <code>BN</code> và <code>mmHg</code> được mở rộng thành dạng đầy đủ trong tiếng Việt lâm sàng bằng một bộ luật regex đã được tuyển chọn, sau đó Underthesea nối các thuật ngữ y khoa đa-âm-tiết bằng dấu gạch dưới.' },
    'case.noteMri':      { en: 'Foreign acronyms (<code>MRI</code>, <code>CT</code>, <code>EKG</code>) survive intact \u2014 the syllable validator rejects them because they lack Vietnamese vowels. Underthesea then binds them to their Vietnamese head noun (<code>MRI_não</code>) so the encoder reads \u201CMRI-of-brain\u201D as a single semantic unit.',
                           vi: 'Các viết-tắt ngoại (<code>MRI</code>, <code>CT</code>, <code>EKG</code>) được giữ nguyên \u2014 bộ kiểm-tra âm tiết loại bỏ chúng vì thiếu nguyên âm tiếng Việt. Underthesea sau đó nối chúng với danh-từ-chính tiếng Việt đi kèm (<code>MRI_não</code>) để encoder đọc \u201CMRI của não\u201D như một đơn vị ngữ nghĩa duy nhất.' },
    'case.noteArtifact': { en: 'GPT-4o occasionally drops a space, gluing two syllables (<code>tim</code> + <code>trung</code> → <code>timtrung</code>). The DP re-segmenter walks the syllable lexicon and finds the valid split, after which Underthesea correctly joins <code>trung_thất</code> (\u201Cmediastinum\u201D) as one clinical concept.',
                           vi: 'GPT-4o thỉnh thoảng bỏ mất một dấu cách, ghép hai âm tiết lại (<code>tim</code> + <code>trung</code> → <code>timtrung</code>). Bộ tách-lại DP duyệt từ điển âm tiết và tìm ra cách tách hợp lệ, sau đó Underthesea nối đúng <code>trung_thất</code> (\u201Ctrung thất\u201D) thành một khái niệm lâm sàng.' },
    'case.noteUnseen':   { en: 'A 23-character mash-up that appears in no dictionary. Left-to-right longest-match backtracking through the 41,579-syllable lexicon yields six clean syllables \u2014 <strong>no rule was hardcoded for this input</strong>. The number <code>3</code> is also separated from the trailing syllable by the normalization step.',
                           vi: 'Một chuỗi 23 ký tự bị ghép không xuất hiện trong từ điển nào. Việc backtracking khớp-dài-nhất từ trái sang phải qua từ điển 41.579 âm tiết cho ra sáu âm tiết sạch \u2014 <strong>không có luật nào được mã hóa cứng cho đầu vào này</strong>. Số <code>3</code> cũng được tách khỏi âm tiết phía trước nhờ bước chuẩn hóa.' },
    'case.noteMixed':    { en: 'Two abbreviations (<code>BN</code>, <code>XQ</code>) and two distinct concatenations (<code>hìnhảnhphổi</code>, <code>tổnthươngnão</code>) in the same sentence. Each stage of the pipeline fires independently in order, with no interference, producing a fully segmented and tokenized output.',
                           vi: 'Hai từ viết tắt (<code>BN</code>, <code>XQ</code>) và hai chuỗi ghép khác nhau (<code>hìnhảnhphổi</code>, <code>tổnthươngnão</code>) trong cùng một câu. Mỗi tầng của pipeline kích hoạt độc lập theo thứ tự, không can thiệp lẫn nhau, sinh ra một đầu ra được tách và tokenize đầy đủ.' },
    'case.noteForeign':  { en: 'Drug names like <code>paclitaxel</code> and <code>carboplatin</code> contain letters (<code>p</code>, <code>c</code> clusters) that are not valid Vietnamese syllables. The lexicon-validated splitter sees no valid split exists and <strong>gracefully leaves the token unchanged</strong> \u2014 no false splits, no data corruption.',
                           vi: 'Tên thuốc như <code>paclitaxel</code> và <code>carboplatin</code> chứa các chữ cái (cụm <code>p</code>, <code>c</code>) không phải âm tiết tiếng Việt hợp lệ. Bộ tách được kiểm-chứng-bằng-từ-điển thấy không có cách tách hợp lệ và <strong>để nguyên token một cách an toàn</strong> \u2014 không tách sai, không hỏng dữ liệu.' },

    /* Section 04 — Results */
    'results.kicker':    { en: '04 — Results', vi: '04 — Kết quả' },
    'results.title':     { en: 'Across every metric on the 800-sample held-out test set, our 3B-parameter system beats every published baseline.',
                           vi: 'Trên mọi metric của tập kiểm-thử 800 mẫu, hệ thống 3B-tham-số của chúng tôi vượt mọi baseline đã công bố.' },
    'results.sub':       { en: 'Zero-shot baselines evaluated under identical Vietnamese prompts and greedy decoding. Our system uses the same protocol; the rightmost column shows beam-4 decoding.',
                           vi: 'Các baseline zero-shot được đánh giá với prompt tiếng Việt giống hệt và giải mã tham lam. Hệ thống của chúng tôi dùng cùng giao thức; cột ngoài cùng bên phải thể hiện giải mã beam-4.' },
    'results.legendOurs':{ en: 'Our model', vi: 'Mô hình của chúng tôi' },
    'results.chartFootnote':{ en: 'All values are percentages or ratios scaled to a 0–100 axis. Table 3 of the report.',
                              vi: 'Tất cả các giá trị là phần trăm hoặc tỉ số đưa về trục 0–100. Bảng 3 trong báo cáo.' },
    'results.ablationTitle':{ en: 'Ablation — what each component contributes',
                              vi: 'Ablation — mỗi thành phần đóng góp gì' },
    'results.ablationSub':  { en: 'Validation split, 6 epochs, identical hyperparameters except the variable under test.',
                              vi: 'Tập validation, 6 epoch, các siêu-tham-số giống hệt nhau ngoại trừ biến đang khảo sát.' },
    'results.thVariant': { en: 'Variant',        vi: 'Biến thể' },
    'results.thVision':  { en: 'Vision encoder', vi: 'Encoder thị giác' },
    'results.thText':    { en: 'Text pipeline',  vi: 'Pipeline văn bản' },
    'results.ablationInsight':{ en: 'The text pipeline (Vietnamese-aware re-segmentation + augmentation) is the single largest driver of measured gains. Dual vision is <em>necessary but not sufficient</em>: adding DINOv3 without the text pipeline actually <em>decreases</em> ROUGE-L (E1 vs E0). The components are <strong>multiplicative</strong>, not additive.',
                              vi: 'Pipeline văn bản (tách-lại hiểu-tiếng-Việt + augmentation) là động lực đơn lẻ lớn nhất tạo ra các cải thiện đo-được. Thị giác kép là <em>cần nhưng chưa đủ</em>: thêm DINOv3 mà không có pipeline văn bản thực ra <em>làm giảm</em> ROUGE-L (E1 vs E0). Các thành phần <strong>nhân lên nhau</strong>, không cộng vào nhau.' },

    /* Section 05 — Predictions */
    'samples.kicker':    { en: '05 — Predictions', vi: '05 — Dự đoán' },
    'samples.title':     { en: 'Six predictions from the held-out test set — never seen during training.',
                           vi: 'Sáu dự đoán từ tập kiểm thử — chưa từng thấy trong huấn luyện.' },
    'samples.sub':       { en: 'Each panel pairs the input chest X-ray with the Vietnamese question, the radiologist\u2019s reference answer (green) and our model\u2019s prediction (red), plus per-sample ROUGE-L, Token-F1, and MDR.',
                           vi: 'Mỗi khung ghép cặp ảnh X-quang ngực đầu vào với câu hỏi tiếng Việt, câu trả lời tham chiếu của bác sĩ X-quang (xanh) và câu dự đoán của mô hình (đỏ), cùng ROUGE-L, Token-F1 và MDR cho từng mẫu.' },
    'samples.scrollAria':{ en: 'Scroll horizontally to view all six prediction panels',
                           vi: 'Vuốt ngang để xem cả sáu khung dự đoán' },
    'samples.alt':       { en: 'Six sample predictions from the held-out test set: chest X-rays paired with Vietnamese clinical questions, reference answers, model predictions, and per-sample metrics.',
                           vi: 'Sáu mẫu dự đoán từ tập kiểm-thử: các ảnh X-quang ngực ghép cặp với câu hỏi lâm sàng tiếng Việt, câu trả lời tham chiếu, dự đoán của mô hình và các chỉ số cho từng mẫu.' },
    'samples.hint':      { en: 'swipe to view all 6 panels',
                           vi: 'vuốt để xem cả 6 khung' },
    'samples.caption':   { en: '<span class="samples__caption-num">Figure 5</span> Free-form generation captures clinical intent across diverse query types from binary screening (\u201Cis there evidence of pleural effusion?\u201D) to localization (\u201Cwhere is the consolidation?\u201D) to descriptive impressions (\u201Cwhat does the report say about the heart size?\u201D).',
                           vi: '<span class="samples__caption-num">Hình 5</span> Sinh văn bản dạng tự do nắm bắt được ý định lâm sàng trên nhiều loại truy vấn từ sàng lọc nhị phân (\u201Ccó bằng chứng tràn dịch màng phổi không?\u201D) đến định vị (\u201Cvị trí đông đặc ở đâu?\u201D) đến mô tả ấn tượng (\u201Cbáo cáo nói gì về kích thước tim?\u201D).' },

    /* Section 06 — Reproducibility */
    'repro.kicker':      { en: '06 — Reproducibility', vi: '06 — Tái lập' },
    'repro.title':       { en: 'Trained on one T4 GPU, 12 epochs. Every hyperparameter accounted for.',
                           vi: 'Đã huấn luyện trên một GPU T4, 12 epoch. Mọi siêu-tham-số được công bố đầy đủ.' },
    'repro.sub':         { en: 'Source notebooks, hyperparameter table, and training environment details will be released alongside the published paper.',
                           vi: 'Notebook nguồn, bảng siêu-tham-số và chi tiết môi trường huấn luyện sẽ được phát hành cùng bài báo công bố.' },
    'repro.archi':       { en: 'Architecture',  vi: 'Kiến trúc' },
    'repro.input':       { en: 'Input',         vi: 'Đầu vào' },
    'repro.peft':        { en: 'PEFT',          vi: 'PEFT' },
    'repro.optim':       { en: 'Optimization',  vi: 'Tối ưu hóa' },
    'repro.train':       { en: 'Training',      vi: 'Huấn luyện' },
    'repro.data':        { en: 'Data',          vi: 'Dữ liệu' },
    'repro.visualEnc':   { en: 'Visual encoders',  vi: 'Encoder thị giác' },
    'repro.qEnc':        { en: 'Question encoder', vi: 'Encoder câu hỏi' },
    'repro.llm':         { en: 'LLM backbone',     vi: 'Backbone LLM' },
    'repro.msca':        { en: 'MSCA',             vi: 'MSCA' },
    'repro.mscaPool':    { en: 'MSCA pool',        vi: 'MSCA pool' },
    'repro.imgSize':     { en: 'Image size',       vi: 'Kích thước ảnh' },
    'repro.augs':        { en: 'Augmentations',    vi: 'Augmentation' },
    'repro.tokenLim':    { en: 'Token limits',     vi: 'Giới hạn token' },
    'repro.tamLayout':   { en: 'TAM input layout', vi: 'Bố cục đầu vào TAM' },
    'repro.qemLora':     { en: 'QEM LoRA',         vi: 'QEM LoRA' },
    'repro.tamLora':     { en: 'TAM LoRA',         vi: 'TAM LoRA' },
    'repro.tamTargets':  { en: 'TAM targets',      vi: 'Mục tiêu TAM' },
    'repro.opt':         { en: 'Optimizer',        vi: 'Optimizer' },
    'repro.peakLr':      { en: 'Peak LR (continuation)', vi: 'LR đỉnh (tiếp nối)' },
    'repro.sched':       { en: 'Scheduler',        vi: 'Lịch học' },
    'repro.ctpl':        { en: 'CTPL',             vi: 'CTPL' },
    'repro.ctplVocab':   { en: 'CTPL vocab',       vi: 'Từ vựng CTPL' },
    'repro.epochs':      { en: 'Epochs',           vi: 'Số epoch' },
    'repro.batch':       { en: 'Batch',            vi: 'Batch' },
    'repro.precision':   { en: 'Precision',        vi: 'Độ chính xác' },
    'repro.eval':        { en: 'Eval',             vi: 'Đánh giá' },
    'repro.hwSeed':      { en: 'Hardware · seed',  vi: 'Phần cứng · seed' },
    'repro.source':      { en: 'Source',           vi: 'Nguồn' },
    'repro.translation': { en: 'Translation',      vi: 'Bản dịch' },
    'repro.size':        { en: 'Size',             vi: 'Kích thước' },
    'repro.splits':      { en: 'Splits',           vi: 'Phân chia' },
    'repro.strat':       { en: 'Stratification',   vi: 'Phân tầng' },

    /* Footer */
    'footer.authors':    { en: 'Authors',          vi: 'Tác giả' },
    'footer.authorMeta1':{ en: 'Lead author · Data pipeline, modeling, experiments, report',
                           vi: 'Tác giả chính · Pipeline dữ liệu, xây mô hình, thí nghiệm, báo cáo' },
    'footer.authorMeta2':{ en: 'Co-author · Basic text pre-processing, dataset translation',
                           vi: 'Đồng tác giả · Tiền-xử-lý văn bản cơ bản, dịch dữ liệu' },
    'footer.citeAs':     { en: 'Cite as',          vi: 'Trích dẫn dưới dạng' },
    'footer.copyBtn':    { en: 'Copy BibTeX',      vi: 'Sao chép BibTeX' },
    'footer.builtAt':    { en: 'Built at <span class="footer__institution">Ton Duc Thang University</span> · Faculty of Information Technology',
                           vi: 'Thực hiện tại <span class="footer__institution">Trường Đại học Tôn Đức Thắng</span> · Khoa Công nghệ Thông tin' },
  };


  // Capability detection ─────────────────────────────────────────────────
  const PREFERS_REDUCED_MOTION =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HAS_HOVER =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const CURSOR_FX_ENABLED = HAS_HOVER && !PREFERS_REDUCED_MOTION;


  // ─── 9. i18n ENGINE ───────────────────────────────────────────────────
  // Persists the user's choice in localStorage under the key 'vqaLang'.
  // Falls back to browser language detection on first visit: any visitor
  // whose primary navigator.language begins with 'vi' lands on Vietnamese,
  // everyone else on English. This matches the user's request: "I am in
  // Vietnam, so the website will be entirely in Vietnamese".
  const LANG_KEY = 'vqaLang';

  function detectInitialLang() {
    try {
      const stored = localStorage.getItem(LANG_KEY);
      if (stored === 'en' || stored === 'vi') return stored;
    } catch (e) { /* localStorage may be blocked — ignore */ }
    // Best-effort detection from the browser's preferred languages list.
    const langs = navigator.languages || [navigator.language || 'en'];
    for (const l of langs) {
      if (typeof l === 'string' && l.toLowerCase().startsWith('vi')) return 'vi';
    }
    return 'en';
  }

  /**
   * Apply translations to the entire document for the given language.
   * Handles three attribute styles:
   *   data-i18n="<key>"       → set textContent
   *   data-i18n-html="<key>"  → set innerHTML (trusted strings only)
   *   data-i18n-attr="attr:key,attr:key" → set HTML attributes (alt, aria-*)
   *
   * Missing keys fall through to the existing DOM text — so the page is
   * never blanked by a typo in I18N. We log warnings to the console only.
   */
  function applyI18n(lang) {
    // Plain text replacement
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const entry = I18N[key];
      if (!entry || !entry[lang]) {
        if (!entry) console.warn('[i18n] missing key:', key);
        return;
      }
      el.textContent = entry[lang];
    });

    // HTML replacement (for strings containing inline tags)
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      const entry = I18N[key];
      if (!entry || !entry[lang]) {
        if (!entry) console.warn('[i18n] missing html key:', key);
        return;
      }
      el.innerHTML = entry[lang];
    });

    // Attribute replacement — comma-separated list of "attr:key"
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const spec = el.getAttribute('data-i18n-attr');
      spec.split(',').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (!attr || !key) return;
        const entry = I18N[key];
        if (!entry || !entry[lang]) {
          if (!entry) console.warn('[i18n] missing attr key:', key);
          return;
        }
        el.setAttribute(attr, entry[lang]);
      });
    });

    // Update <html lang> for screen readers and font fallback selection.
    document.documentElement.lang = lang;
    // Update the toggle button's accessible state.
    const tog = document.getElementById('nav-lang');
    if (tog) {
      tog.setAttribute('data-current-lang', lang);
    }
  }

  function setLang(lang) {
    if (lang !== 'en' && lang !== 'vi') return;
    applyI18n(lang);
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }
  }

  // Initial language application happens IMMEDIATELY at script execution
  // so the user never sees a flash of the wrong language. Because the
  // script tag is at the end of <body>, the DOM is already parsed.
  const initialLang = detectInitialLang();
  applyI18n(initialLang);

  // Wire up the toggle: tap → swap to the other language.
  const langBtn = document.getElementById('nav-lang');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const cur = document.documentElement.lang === 'vi' ? 'vi' : 'en';
      setLang(cur === 'vi' ? 'en' : 'vi');
    });
  }


  // ─── 1. Reveal-on-scroll ──────────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    reveals.forEach((el) => obs.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }


  // 2. Animated count-up
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  function animateCount(el, target, decimals, duration) {
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      const value = target * eased;
      el.textContent = value.toFixed(decimals);
      if (t < 1) requestAnimationFrame(step);
      else      el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(step);
  }
  const metricsBlock = document.querySelector('.metrics');
  if (metricsBlock) {
    const countOnce = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          metricsBlock.querySelectorAll('.metric__value').forEach((el, i) => {
            const target = parseFloat(el.dataset.target);
            const decimals = parseInt(el.dataset.decimals || '0', 10);
            el.textContent = (0).toFixed(decimals);
            setTimeout(() => animateCount(el, target, decimals, 1400), i * 180);
          });
          countOnce.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    countOnce.observe(metricsBlock);
  }


  // 3. Hiệu ứng Chart bar
  const chart = document.getElementById('chart');
  if (chart) {
    const chartObs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          requestAnimationFrame(() => chart.classList.add('is-animated'));
          chartObs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    chartObs.observe(chart);
  }


  // 4. Nav background on scroll
  const nav = document.getElementById('nav');
  if (nav) {
    let ticking = false;
    function updateNav() {
      const scrolled = window.scrollY > 32;
      nav.classList.toggle('is-scrolled', scrolled);
      ticking = false;
    }
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(updateNav);
          ticking = true;
        }
      },
      { passive: true }
    );
    updateNav();
  }


  // ─── 5. BibTeX copy-to-clipboard ──────────────────────────────────────
  document.querySelectorAll('[data-copy-target]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const pre = btn.parentElement.querySelector('.footer__bib code');
      if (!pre) return;
      // Localized feedback text — read out of I18N on each click rather than
      // baked into the listener so the right phrasing is used at click time.
      const lang = document.documentElement.lang === 'vi' ? 'vi' : 'en';
      const COPIED  = lang === 'vi' ? 'Đã sao chép ✓' : 'Copied ✓';
      const DEFAULT = (I18N['footer.copyBtn'] && I18N['footer.copyBtn'][lang]) || 'Copy BibTeX';
      try {
        await navigator.clipboard.writeText(pre.textContent.trim());
        btn.textContent = COPIED;
        btn.classList.add('is-copied');
        setTimeout(() => {
          btn.textContent = DEFAULT;
          btn.classList.remove('is-copied');
        }, 2000);
      } catch (err) {
        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(pre);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });
  });


  // ─── 6. Smooth-scroll nav links ──────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = nav ? nav.offsetHeight : 0;
      const y = target.getBoundingClientRect().top + window.scrollY - offset + 4;
      window.scrollTo({ top: y, behavior: 'smooth' });
      if (document.body.classList.contains('nav--open')) closeMobileNav();
    });
  });


  // ─── 7. Mobile nav drawer ─────────────────────────────────────────────
  const navToggle   = document.getElementById('nav-toggle');
  const navMenu     = document.getElementById('nav-menu');
  const navBackdrop = document.getElementById('nav-backdrop');
  const navCta      = document.querySelector('.nav__cta');
  const MOBILE_NAV_BP = 920;

  // Save original positions so the relocate-on-mobile move is reversible.
  let ctaOriginalParent      = navCta ? navCta.parentElement : null;
  let ctaOriginalNextSibling = navCta ? navCta.nextSibling   : null;
  // The lang toggle also lives in the bar on desktop; on mobile we relocate
  // it to the drawer footer just like the CTA so users can switch language
  // from the open menu (and so it isn't taking up bar real estate).
  let langOriginalParent      = langBtn ? langBtn.parentElement : null;
  let langOriginalNextSibling = langBtn ? langBtn.nextSibling   : null;

  function syncDrawerExtras() {
    const isMobile = window.innerWidth <= MOBILE_NAV_BP;
    [ [navCta, ctaOriginalParent, ctaOriginalNextSibling],
      [langBtn, langOriginalParent, langOriginalNextSibling] ].forEach(([el, parent, sibling]) => {
      if (!el || !navMenu) return;
      if (isMobile) {
        if (el.parentElement !== navMenu) {
          navMenu.appendChild(el);
          el.dataset.inDrawer = 'true';
        }
      } else {
        if (el.dataset.inDrawer === 'true' && parent) {
          parent.insertBefore(el, sibling);
          delete el.dataset.inDrawer;
        }
      }
    });
  }

  function openMobileNav() {
    document.body.classList.add('nav--open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'true');
      const lang = document.documentElement.lang === 'vi' ? 'vi' : 'en';
      navToggle.setAttribute('aria-label',
        lang === 'vi' ? 'Đóng menu điều hướng' : 'Close navigation menu');
    }
  }
  function closeMobileNav() {
    document.body.classList.remove('nav--open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      const lang = document.documentElement.lang === 'vi' ? 'vi' : 'en';
      navToggle.setAttribute('aria-label',
        lang === 'vi' ? 'Mở menu điều hướng' : 'Open navigation menu');
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (document.body.classList.contains('nav--open')) closeMobileNav();
      else                                               openMobileNav();
    });
  }
  if (navBackdrop) navBackdrop.addEventListener('click', closeMobileNav);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav--open')) {
      closeMobileNav();
    }
  });

  let resizeRaf = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      syncDrawerExtras();
      if (window.innerWidth > MOBILE_NAV_BP &&
          document.body.classList.contains('nav--open')) {
        closeMobileNav();
      }
    });
  });
  syncDrawerExtras();


  // ─── 8. Mouse effects ─────────────────────────────────────────────────
  if (CURSOR_FX_ENABLED) {
    setupCursorSpotlight();
    setupTilt();
  }

  function setupCursorSpotlight() {
    const root = document.documentElement;
    const body = document.body;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let curX = targetX;
    let curY = targetY;
    let rafId = 0;
    let everMoved = false;

    function tick() {
      curX += (targetX - curX) * 0.22;
      curY += (targetY - curY) * 0.22;
      root.style.setProperty('--mx', curX + 'px');
      root.style.setProperty('--my', curY + 'px');
      if (Math.abs(curX - targetX) > 0.5 || Math.abs(curY - targetY) > 0.5) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    }

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!everMoved) {
        body.classList.add('cursor-ready');
        everMoved = true;
      }
      if (!rafId) rafId = requestAnimationFrame(tick);
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      body.classList.remove('cursor-ready');
    });
    document.addEventListener('mouseenter', () => {
      if (everMoved) body.classList.add('cursor-ready');
    });
  }

  function setupTilt() {
    const TILT_MAX = 6;
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      let raf = 0;
      let pendingX = 0;
      let pendingY = 0;
      function apply() {
        el.style.setProperty('--tilt-rx', pendingX.toFixed(2) + 'deg');
        el.style.setProperty('--tilt-ry', pendingY.toFixed(2) + 'deg');
        raf = 0;
      }
      el.addEventListener('mouseenter', () => el.classList.add('is-tilting'));
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width)  - 0.5;
        const ny = ((e.clientY - r.top)  / r.height) - 0.5;
        pendingX = -ny * 2 * TILT_MAX;
        pendingY =  nx * 2 * TILT_MAX;
        if (!raf) raf = requestAnimationFrame(apply);
      }, { passive: true });
      el.addEventListener('mouseleave', () => {
        pendingX = 0; pendingY = 0;
        el.classList.remove('is-tilting');
        if (!raf) raf = requestAnimationFrame(apply);
      });
    });
  }

})();
