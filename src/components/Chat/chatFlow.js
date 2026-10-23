export const LANGUAGES = ["en", "ar"];

export const DEFAULT_LANGUAGE = "en";

export const HEADER_SUBTITLE = { en: "by Refine", ar: "من Refine" };

export const PROJECT_NAME = "Eden House The Park";
export const PROJECT_SHORT_NAME = "Eden House The Park";

// The call number is the one published in the page's contact section.
// WhatsApp is left blank until sales confirms it: Chat.js hides or
// disables the WhatsApp buttons when it is empty. Either can be set
// with NEXT_PUBLIC_CALL_NUMBER / NEXT_PUBLIC_WHATSAPP_NUMBER.
export const DEFAULT_CALL_NUMBER = "+97144230167";
export const DEFAULT_WHATSAPP_NUMBER = "";

export const DEFAULT_PHONE_COUNTRY = "AE";
export const PINNED_PHONE_COUNTRIES = ["AE", "SA", "RU", "GB", "IN", "EG"];

// Calling codes for the pinned chips, so choosing one does not need the
// phone library loaded. Must cover every code in PINNED_PHONE_COUNTRIES.
export const PINNED_PHONE_CALLING_CODES = {
  AE: "971",
  SA: "966",
  RU: "7",
  GB: "44",
  IN: "91",
  EG: "20",
};

export const TEASER = {
  enabled: true,
  delaySeconds: 15,
  scrollPercent: 40,
  text: {
    en: "Want the {{project_short}} project's payment plan?",
    ar: "هل تريد الاطلاع على خطة الدفع لمشروع {{project_short}}؟",
  },
};

export const BUSINESS_HOURS = {
  timezone: "Asia/Dubai",
  workdays: [1, 2, 3, 4, 5],
  day_start: "09:00",
  day_end: "18:00",
};

export const ROLES = [
  {
    id: "buyer",
    label: { en: "Buyer / Investor", ar: "مشترٍ / مستثمر" },
  },
  {
    id: "broker",
    label: { en: "Broker / Agent", ar: "وسيط / وكيل عقاري" },
  },
];

export const SEARCH_STAGES = [
  {
    id: "actively_looking",
    label: {
      en: "Actively looking & ready to book",
      ar: "أبحث بجدية وجاهز للحجز",
    },
    brokerLabel: {
      en: "Yes — actively closing",
      ar: "نعم — أعمل على إتمام صفقة",
    },
  },
  {
    id: "shortlisting",
    label: { en: "Shortlisting options", ar: "أضع قائمة مختصرة بالخيارات" },
    brokerLabel: {
      en: "Yes — shortlisting for them",
      ar: "نعم — أضع قائمة مختصرة له",
    },
  },
  {
    id: "gathering_info",
    label: { en: "Gathering information", ar: "أجمع المعلومات" },
    brokerLabel: { en: "Building my knowledge", ar: "أبني معرفتي بالمشروع" },
  },
  {
    id: "not_planning",
    label: { en: "Not planning yet", ar: "لا أخطط بعد" },
    brokerLabel: { en: "Just registering", ar: "أسجل فقط" },
  },
];

// Eden House The Park has two- and three-bedroom homes only.
export const UNIT_TYPES = [
  { id: "2br", label: { en: "2 Bedroom", ar: "غرفتا نوم" } },
  { id: "3br", label: { en: "3 Bedroom", ar: "ثلاث غرف نوم" } },
];

export const BUDGET_BRACKETS = [
  {
    id: "500k_1m",
    label: { en: "AED 500K – AED 1M", ar: "500 ألف – مليون درهم" },
  },
  { id: "1m_2m", label: { en: "AED 1M – AED 2M", ar: "1–2 مليون درهم" } },
  { id: "2m_3m", label: { en: "AED 2M – AED 3M", ar: "2–3 ملايين درهم" } },
  {
    id: "3m_plus",
    label: { en: "AED 3M and Above", ar: "3 ملايين درهم فأكثر" },
  },
];

export const CLOSE_RULES = {
  inHours: {
    actively_looking: "talk_now",
    shortlisting: "talk_now",
    gathering_info: "nurture",
    not_planning: "nurture",
  },
  outOfHours: {
    actively_looking: "schedule",
    shortlisting: "schedule",
    gathering_info: "nurture",
    not_planning: "nurture",
  },
};

export function getCloseVariant(searchStage, isInHours) {
  const rules = isInHours ? CLOSE_RULES.inHours : CLOSE_RULES.outOfHours;
  return rules[searchStage] ?? "nurture";
}

export const BUTTON_ORDER_BY_STAGE = {
  actively_looking: ["call", "whatsapp"],
  shortlisting: ["whatsapp", "call"],
};

export const SLOT_WINDOWS = [
  { id: "morning", start: "10:00", end: "12:00", durationHours: 2 },
  { id: "afternoon", start: "16:00", end: "18:00", durationHours: 2 },
];

export const BROKER_LINKS = [
  {
    label: { en: "📝 Agency registration", ar: "📝 تسجيل الوكالات" },
    url: "https://bit.ly/Refine_Agency_Registration",
  },
  {
    label: { en: "🏗 All projects", ar: "🏗 جميع المشاريع" },
    url: "https://portfolio.refinedubai.com/",
  },
];

export const WHATSAPP_TEMPLATES = {
  hot: {
    en: "Hi, I'm {{first_name}}. I'm interested in a {{unit_type_label}} at {{project_name}} and ready to move. #EDENHOUSETHEPARK",
    ar: "مرحباً، أنا {{first_name}}. مهتم بوحدة {{unit_type_label}} في {{project_name}} وجاهز للمتابعة. #EDENHOUSETHEPARK",
  },
  nurture: {
    en: "Hi, I'm {{first_name}}. Please send me the {{project_name}} brochure. #EDENHOUSETHEPARK",
    ar: "مرحباً، أنا {{first_name}}. أرجو إرسال بروشور {{project_name}}. #EDENHOUSETHEPARK",
  },
  broker: {
    en: "Hi, I'm {{first_name}} from {{company}} — interested in partnering on {{project_name}}. #EDENHOUSETHEPARKPARTNER",
    ar: "مرحباً، أنا {{first_name}} من {{company}} — مهتم بالشراكة في مشروع {{project_name}}. #EDENHOUSETHEPARKPARTNER",
  },
  hot_broker: {
    en: "Hi, I'm {{first_name}} from {{company}}. I have a client for a {{unit_type_label}} at {{project_name}}. #EDENHOUSETHEPARKPARTNER",
    ar: "مرحباً، أنا {{first_name}} من {{company}}. لديّ عميل مهتم بوحدة {{unit_type_label}} في {{project_name}}. #EDENHOUSETHEPARKPARTNER",
  },
  nurture_broker: {
    en: "Hi, I'm {{first_name}} from {{company}}. Please send me the {{project_name}} broker pack. #EDENHOUSETHEPARKPARTNER",
    ar: "مرحباً، أنا {{first_name}} من {{company}}. أرجو إرسال حزمة الوسيط لمشروع {{project_name}}. #EDENHOUSETHEPARKPARTNER",
  },
};

export const STRINGS = {
  en: {
    agentName: "Refine",
    onlineBadge: "We Are Online",
    teaserText: TEASER.text.en,
    introTitle: "Reach Out To Us",
    introSubtitle: "Let Us Know How We Can Help You",
    textUsButton: "Text Us",
    closeChatAria: "Close chat",
    openChatAria: "Open chat",
    minimiseChatAria: "Minimise chat",
    toggleHoverLabel: "Talk to Us",

    // Greetings from the Eden House copy deck (items 95 and 96): floor
    // plans, not prices.
    greetingTitle: "Hi there, thanks for visiting {{project_name}} by Refine.",
    greetingSubtitle:
      "Answer a few quick questions and I'll get you the floor plans, the payment plan and a direct line to our team.",

    roleQuestion: "I'm here as a…",

    stageQuestion: "What best describes your current buying intent?",
    stageQuestionBroker:
      "Do you have a client for {{project_short}} right now?",

    bedroomsQuestion: "How many bedrooms are you interested in?",
    bedroomsQuestionBroker: "Which unit types are your clients asking for?",

    budgetQuestion: "What is your budget?",
    budgetQuestionBroker: "Typical client budget?",

    companyQuestion: "What's your company name?",
    companyPlaceholder: "Enter your company name...",
    companyError: "Please enter your company name.",

    nameQuestion: "What's your name?",
    firstNameFieldLabel: "First name",
    lastNameFieldLabel: "Last name",
    firstNamePlaceholder: "Enter your first name...",
    lastNamePlaceholder: "Enter your last name...",
    nameError: "Please enter your name (at least 2 characters).",

    phoneQuestion: "Your phone number:",
    phonePlaceholder: "Phone number with country code...",
    phoneError:
      "That number doesn't look complete — please include your country code.",
    continueCta: "Continue",

    consentText:
      "By continuing, you agree to be contacted by Refine about this project.",
    consentError: "Please confirm you agree to be contacted before continuing.",

    emailQuestion: "And your email address:",
    emailPlaceholder: "Enter your email address...",
    emailError: "Please enter a valid email.",

    submittingText: "Submitting your enquiry...",
    submitFallbackText: "All saved — our team will reach out shortly.",

    thanksLine: "Thanks, {{first_name}} — your details are in.",

    talkNowText: "🟢 Our expert is online now — get your answers right away.",
    talkNowTextBroker:
      "🟢 Our expert is online now — get availability, prices and commission details right away.",
    callButtonLabel: "📞 Call now",
    whatsappButtonLabel: "💬 WhatsApp",

    scheduleText:
      "Our experts are back Mon–Fri, 9 AM–6 PM. When should we call you?",
    slotTodayLabel: "Today",
    slotTomorrowLabel: "Tomorrow",
    slotAnytimeLabel: "Anytime",
    slotConfirmText: "Booked ✅ We'll call you {{slot_label}}.",
    scheduleWhatsappLabel: "💬 Message us — we reply at 9",

    nurtureText:
      "We'll send you the {{project_name}} brochure and payment plan on WhatsApp.",
    nurtureTextBroker:
      "We'll send you the broker pack — brochure, payment plan and registration link — on WhatsApp.",
    nurtureWhatsappLabel: "📲 Get it on WhatsApp",
    nurtureWhatsappLabelBroker: "📲 Get the broker pack",

    referenceLabel: "Reference:",
    startNewEnquiry: "Start New Enquiry",

    errorTitle: "Submission Not Completed",
    errorFallback: "We could not submit your enquiry. Please try again.",
    tryAgain: "Try Again",
    editDetails: "Edit Details",

    lastNameQuestion: "And your last name?",
    whatsappUnavailable: "WhatsApp is not configured yet.",
    callUnavailable: "Call is not configured yet.",

    metaBot: "Refine • Just Now",
    metaVisitor: "You • Just Now",
  },

  ar: {
    agentName: "Refine",
    onlineBadge: "نحن متصلون الآن",
    teaserText: TEASER.text.ar,
    introTitle: "تواصل معنا",
    introSubtitle: "أخبرنا كيف يمكننا مساعدتك",
    textUsButton: "راسلنا",
    closeChatAria: "إغلاق المحادثة",
    openChatAria: "فتح المحادثة",
    minimiseChatAria: "تصغير المحادثة",
    toggleHoverLabel: "تحدث معنا",

    greetingTitle: "مرحباً، شكراً لزيارتك {{project_name}} من Refine.",
    greetingSubtitle:
      "أجب عن بضعة أسئلة سريعة وسأزودك بالمخططات وخطة الدفع وخط تواصل مباشر مع فريقنا.",

    roleQuestion: "أنا هنا بصفتي…",

    stageQuestion: "ما الذي يصف نيتك الشرائية الحالية بشكل أفضل؟",
    stageQuestionBroker: "هل لديك عميل لمشروع {{project_short}} حالياً؟",

    bedroomsQuestion: "كم عدد غرف النوم التي تهمك؟",
    bedroomsQuestionBroker: "ما أنواع الوحدات التي يطلبها عملاؤك؟",

    budgetQuestion: "ما هي ميزانيتك؟",
    budgetQuestionBroker: "ما الميزانية المعتادة لعملائك؟",

    companyQuestion: "ما اسم شركتك؟",
    companyPlaceholder: "أدخل اسم شركتك...",
    companyError: "يرجى إدخال اسم شركتك.",

    nameQuestion: "ما اسمك؟",
    firstNameFieldLabel: "الاسم الأول",
    lastNameFieldLabel: "اسم العائلة",
    firstNamePlaceholder: "أدخل اسمك الأول...",
    lastNamePlaceholder: "أدخل اسم عائلتك...",
    nameError: "يرجى إدخال اسمك (حرفان على الأقل).",

    phoneQuestion: "رقم هاتفك:",
    phonePlaceholder: "رقم الهاتف مع رمز الدولة...",
    phoneError: "يبدو أن الرقم غير مكتمل — يرجى إدخال رمز الدولة.",
    continueCta: "متابعة",

    consentText:
      "بالمتابعة، أنت توافق على أن يتواصل معك فريق Refine بخصوص هذا المشروع.",
    consentError: "يرجى تأكيد موافقتك على التواصل قبل الاستمرار.",

    emailQuestion: "وبريدك الإلكتروني:",
    emailPlaceholder: "أدخل بريدك الإلكتروني...",
    emailError: "يرجى إدخال بريد إلكتروني صحيح.",

    submittingText: "جارٍ إرسال طلبك...",
    submitFallbackText: "تم الحفظ — سيتواصل معك فريقنا قريباً.",

    thanksLine: "شكراً {{first_name}} — تم استلام بياناتك.",

    talkNowText: "🟢 خبيرنا متواجد الآن — احصل على إجاباتك فوراً.",
    talkNowTextBroker:
      "🟢 خبيرنا متواجد الآن — احصل على التوفر والأسعار وتفاصيل العمولة فوراً.",
    callButtonLabel: "📞 اتصل الآن",
    whatsappButtonLabel: "💬 واتساب",

    scheduleText:
      "خبراؤنا متاحون من الاثنين إلى الجمعة، من 9 صباحاً حتى 6 مساءً. متى نتصل بك؟",
    slotTodayLabel: "اليوم",
    slotTomorrowLabel: "غداً",
    slotAnytimeLabel: "أي وقت",
    slotConfirmText: "تم الحجز ✅ سنتصل بك {{slot_label}}.",
    scheduleWhatsappLabel: "💬 راسلنا الآن — سنرد في التاسعة صباحاً",

    nurtureText: "سنرسل لك بروشور {{project_name}} وخطة الدفع عبر واتساب.",
    nurtureTextBroker:
      "سنرسل لك حزمة الوسيط — البروشور وخطة الدفع ورابط التسجيل — عبر واتساب.",
    nurtureWhatsappLabel: "📲 استلمه عبر واتساب",
    nurtureWhatsappLabelBroker: "📲 استلم حزمة الوسيط",

    referenceLabel: "الرقم المرجعي:",
    startNewEnquiry: "بدء طلب جديد",

    errorTitle: "لم يتم إرسال الطلب",
    errorFallback: "لم نتمكن من إرسال طلبك. يرجى المحاولة مرة أخرى.",
    tryAgain: "حاول مرة أخرى",
    editDetails: "تعديل التفاصيل",

    lastNameQuestion: "وما اسم عائلتك؟",
    whatsappUnavailable: "خدمة واتساب غير مُفعّلة حالياً.",
    callUnavailable: "خدمة الاتصال غير مُفعّلة حالياً.",

    metaBot: "Refine • الآن",
    metaVisitor: "أنت • الآن",
  },
};

export function findLabel(items, id, language) {
  const item = items.find((entry) => entry.id === id);
  return item ? item.label[language] : id;
}

export function fillTemplate(template, values) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{{${key}}}`, value ?? ""),
    template,
  );
}
