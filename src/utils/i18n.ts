export type LanguageCode = "fr" | "vi" | "en";

const LANGUAGE_STORAGE_KEY = "foodsafe_language";

export const languages: Array<{
  code: LanguageCode;
  label: string;
  flag: string;
}> = [
  {
    code: "fr",
    label: "Français",
    flag: new URL("../assets/Flag_of_France.svg.png", import.meta.url).href,
  },
  {
    code: "vi",
    label: "Vietnamien",
    flag: new URL("../assets/Flag_of_Vietnam.svg.png", import.meta.url).href,
  },
  {
    code: "en",
    label: "Anglais",
    flag: new URL("../assets/Flag_of_the_United_Kingdom.svg.png", import.meta.url).href,
  },
];

const defaultLanguage: LanguageCode = "en";

export type TranslationKey =
  | "appNameFood"
  | "appNameSafe"
  | "scanHistory"
  | "reportHistory"
  | "viewAll"
  | "noRecentItems"
  | "historyPageTitle"
  | "historyNoReports"
  | "historyNoScans"
  | "scannerTitle"
  | "educationTitle"
  | "searchPlaceholder"
  | "warningSignGuides"
  | "cardTitle"
  | "cardSubtitle"
  | "reportDetailsTitle"
  | "loading"
  | "reportNotFound"
  | "notesTitle"
  | "noNotesProvided"
  | "cancel"
  | "createReport"
  | "submit"
  | "productName"
  | "riskLevel"
  | "addNotes"
  | "suspected"
  | "unsafe"
  | "safe"
  | "appMenuHome"
  | "appMenuCamera"
  | "appMenuEducation"
  | "appMenuHistory"
  | "selectLanguage"
  | "loginTitle"
  | "registerTitle"
  | "email"
  | "password"
  | "confirmPassword"
  | "loginButton"
  | "registerButton"
  | "noAccount"
  | "hasAccount"
  | "loginError"
  | "registerError"
  | "registerSuccess"
  | "passwordMismatch"
  | "logout"
  | "allFieldsRequired"
  | "passwordTooShort"
  | "emailInvalid"
  | "emailNotConfirmed"
  | "userAlreadyExists"
  // ── QR/Traceability ────────────────
  | "scanQR"
  | "photoReport"
  | "lookingUp"
  | "productNotFound"
  | "scanSuccessful"
  | "batchInfo"
  | "producer"
  | "qualityControl"
  | "coldChainIntegrity"
  | "containsAllergens"
  | "distributionTrail"
  | "recallBannerTitle"
  | "recallNumber"
  | "recallClass"
  | "recallReason"
  | "recallAction"
  | "recallHotline"
  | "batchId"
  | "productionDate"
  | "harvestDate"
  | "bestBy"
  | "expiresIn"
  | "expiredAgo"
  | "statusValid"
  | "statusExpiringSoon"
  | "statusExpired"
  | "statusRecall"
  | "coldChainPass"
  | "coldChainWarning"
  | "coldChainFail"
  | "readings"
  | "violations"
  | "dangerZone"
  | "lastInspection"
  | "countryOfOrigin"
  // ── Report enrichment ──────────────
  | "category"
  | "warningSigns"
  | "storeName"
  | "barcode"
  | "reportedToStore"
  | "yes"
  | "no"
  // ── History tabs ───────────────────
  | "tabReports"
  | "tabScans"
  // ── Chatbot ────────────────────────
  | "appMenuAssistant"
  | "chatPlaceholder"
  | "chatTitle"
  | "chatSend"
  | "botTyping"
  | "chatWelcome"
  | "chatExample1"
  | "chatExample2"
  | "smartSuggestions"
  // ── Alerts / Toasts ─────────────────
  | "productNameRequired"
  | "reportImageUploadError"
  | "reportSubmitError"
  | "reportSubmitSuccess"
  | "scanSaveError"
  // ── FDA Recall Alerts ────────────────
  | "appMenuRecalls"
  | "recallsPageTitle"
  | "recallAlertsSection"
  | "recallAlertsSubtitle"
  | "viewRecalls"
  | "noActiveRecallAlerts"
  | "noRecallsFound"
  | "recallsLoadError"
  | "recallsOfflineNotice"
  | "recallSeverityHigh"
  | "recallSeverityMedium"
  | "recallSeverityLow"
  | "recallFirm"
  | "recallDate"
  | "recallDistributionPattern"
  | "recallStatus"
  | "dismiss"
  | "refresh";

const translations: Record<LanguageCode, Record<TranslationKey, string>> = {
  fr: {
    appNameFood: "Food",
    appNameSafe: "Safe.",
    scanHistory: "Historique des scans",
    reportHistory: "Historique des rapports",
    viewAll: "Voir tout",
    noRecentItems: "Aucun élément récent.",
    historyPageTitle: "Historique",
    historyNoReports: "Aucun rapport pour le moment.",
    historyNoScans: "Aucun scan pour le moment.",
    scannerTitle: "Scanner",
    educationTitle: "Éducation",
    searchPlaceholder: "Rechercher",
    warningSignGuides: "Guide des panneaux d'avertissement",
    cardTitle: "Titre de la carte",
    cardSubtitle: "Sous-titre de la carte",
    reportDetailsTitle: "Détails du rapport",
    loading: "Chargement...",
    reportNotFound: "Rapport introuvable.",
    notesTitle: "Notes",
    noNotesProvided: "Aucune note fournie.",
    cancel: "Annuler",
    createReport: "Créer un rapport",
    submit: "Envoyer",
    productName: "Nom du produit",
    riskLevel: "Niveau de risque",
    addNotes: "Ajouter des notes",
    suspected: "Suspect",
    unsafe: "Dangereux",
    safe: "Sûr",
    appMenuHome: "Accueil",
    appMenuCamera: "Caméra",
    appMenuEducation: "Éducation",
    appMenuHistory: "Historique",
    selectLanguage: "Choisir une langue",
    loginTitle: "Connexion",
    registerTitle: "Inscription",
    email: "Adresse e-mail",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    loginButton: "Se connecter",
    registerButton: "S'inscrire",
    noAccount: "Pas encore de compte ?",
    hasAccount: "Déjà un compte ?",
    loginError: "Email ou mot de passe incorrect.",
    registerError: "Erreur lors de l'inscription.",
    registerSuccess: "Compte créé ! Vérifiez votre e-mail pour confirmer.",
    passwordMismatch: "Les mots de passe ne correspondent pas.",
    logout: "Déconnexion",
    allFieldsRequired: "Veuillez remplir tous les champs.",
    passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères.",
    emailInvalid: "Adresse e-mail invalide.",
    emailNotConfirmed: "Veuillez confirmer votre e-mail avant de vous connecter.",
    userAlreadyExists: "Un compte existe déjà avec cette adresse e-mail.",
    // QR/Traceability
    scanQR: "Scanner QR",
    photoReport: "Photo Rapport",
    lookingUp: "Recherche du produit…",
    productNotFound: "Produit non trouvé",
    scanSuccessful: "Scan réussi",
    batchInfo: "Informations du lot",
    producer: "Producteur",
    qualityControl: "Contrôle qualité",
    coldChainIntegrity: "Intégrité chaîne du froid",
    containsAllergens: "Contient des allergènes",
    distributionTrail: "Parcours de distribution",
    recallBannerTitle: "Produit rappelé — Ne pas consommer",
    recallNumber: "N° de rappel",
    recallClass: "Classe",
    recallReason: "Motif",
    recallAction: "Action requise",
    recallHotline: "Hotline",
    batchId: "ID du lot",
    productionDate: "Date de production",
    harvestDate: "Date de récolte",
    bestBy: "À consommer avant le",
    expiresIn: "Expire dans",
    expiredAgo: "Expiré depuis",
    statusValid: "Valide",
    statusExpiringSoon: "Expire bientôt",
    statusExpired: "Expiré",
    statusRecall: "Rappelé",
    coldChainPass: "Conforme",
    coldChainWarning: "Attention",
    coldChainFail: "Non conforme",
    readings: "Lectures",
    violations: "Violations",
    dangerZone: "Zone de danger",
    lastInspection: "Dernière inspection",
    countryOfOrigin: "Pays d'origine",
    // Report enrichment
    category: "Catégorie",
    warningSigns: "Signes d'alerte",
    storeName: "Nom du magasin",
    barcode: "Code-barres",
    reportedToStore: "Signalé au magasin",
    yes: "Oui",
    no: "Non",
    // History tabs
    tabReports: "Rapports",
    tabScans: "Scans",
    // Chatbot
    appMenuAssistant: "Assistant",
    chatPlaceholder: "Posez votre question...",
    chatTitle: "Assistant IA",
    chatSend: "Envoyer",
    botTyping: "L'assistant écrit...",
    chatWelcome: "Bonjour ! Je suis votre assistant de sécurité alimentaire. Posez-moi vos questions sur les règles de conservation, les rappels de produits, ou les bonnes pratiques d'hygiène.",
    chatExample1: "Température de cuisson du bœuf haché ?",
    chatExample2: "Combien de temps conserver le riz cuit ?",
    smartSuggestions: "Suggestions intelligentes",
    // Alerts / Toasts
    productNameRequired: "Merci de renseigner le nom du produit.",
    reportImageUploadError: "Erreur lors de l'envoi de la photo. Réessayez.",
    reportSubmitError: "Impossible d'envoyer le rapport. Réessayez.",
    reportSubmitSuccess: "Rapport envoyé avec succès !",
    scanSaveError: "Scan effectué, mais non sauvegardé dans l'historique.",
    // FDA Recall Alerts
    appMenuRecalls: "Rappels",
    recallsPageTitle: "Alertes de rappel",
    recallAlertsSection: "Rappels alimentaires",
    recallAlertsSubtitle: "Alertes récentes de la FDA",
    viewRecalls: "Voir les rappels",
    noActiveRecallAlerts: "Aucune alerte de rappel majeure en ce moment.",
    noRecallsFound: "Aucun rappel trouvé.",
    recallsLoadError: "Impossible de charger les rappels FDA.",
    recallsOfflineNotice: "Affichage des données mises en cache (hors ligne).",
    recallSeverityHigh: "Risque élevé",
    recallSeverityMedium: "Risque modéré",
    recallSeverityLow: "Risque faible",
    recallFirm: "Entreprise",
    recallDate: "Date du rappel",
    recallDistributionPattern: "Distribution",
    recallStatus: "Statut",
    dismiss: "Ignorer",
    refresh: "Actualiser",
  },
  vi: {
    appNameFood: "Food",
    appNameSafe: "Safe.",
    scanHistory: "Lịch sử quét",
    reportHistory: "Lịch sử báo cáo",
    viewAll: "Xem tất cả",
    noRecentItems: "Không có mục gần đây.",
    historyPageTitle: "Lịch sử",
    historyNoReports: "Chưa có báo cáo.",
    historyNoScans: "Chưa có quét nào.",
    scannerTitle: "Quét",
    educationTitle: "Giáo dục",
    searchPlaceholder: "Tìm kiếm",
    warningSignGuides: "Hướng dẫn biển báo cảnh báo",
    cardTitle: "Tiêu đề thẻ",
    cardSubtitle: "Phụ đề thẻ",
    reportDetailsTitle: "Chi tiết báo cáo",
    loading: "Đang tải...",
    reportNotFound: "Không tìm thấy báo cáo.",
    notesTitle: "Ghi chú",
    noNotesProvided: "Không có ghi chú.",
    cancel: "Hủy",
    createReport: "Tạo báo cáo",
    submit: "Gửi",
    productName: "Tên sản phẩm",
    riskLevel: "Mức độ rủi ro",
    addNotes: "Thêm ghi chú",
    suspected: "Nghi ngờ",
    unsafe: "Không an toàn",
    safe: "An toàn",
    appMenuHome: "Trang chủ",
    appMenuCamera: "Máy ảnh",
    appMenuEducation: "Giáo dục",
    appMenuHistory: "Lịch sử",
    selectLanguage: "Chọn ngôn ngữ",
    loginTitle: "Đăng nhập",
    registerTitle: "Đăng ký",
    email: "Địa chỉ email",
    password: "Mật khẩu",
    confirmPassword: "Xác nhận mật khẩu",
    loginButton: "Đăng nhập",
    registerButton: "Đăng ký",
    noAccount: "Chưa có tài khoản?",
    hasAccount: "Đã có tài khoản?",
    loginError: "Email hoặc mật khẩu không đúng.",
    registerError: "Lỗi khi đăng ký.",
    registerSuccess: "Tạo tài khoản thành công! Kiểm tra email để xác nhận.",
    passwordMismatch: "Mật khẩu không khớp.",
    logout: "Đăng xuất",
    allFieldsRequired: "Vui lòng điền đầy đủ thông tin.",
    passwordTooShort: "Mật khẩu phải có ít nhất 6 ký tự.",
    emailInvalid: "Địa chỉ email không hợp lệ.",
    emailNotConfirmed: "Vui lòng xác nhận email trước khi đăng nhập.",
    userAlreadyExists: "Tài khoản đã tồn tại với email này.",
    // QR/Traceability
    scanQR: "Quét QR",
    photoReport: "Báo cáo ảnh",
    lookingUp: "Đang tìm kiếm sản phẩm…",
    productNotFound: "Không tìm thấy sản phẩm",
    scanSuccessful: "Quét thành công",
    batchInfo: "Thông tin lô hàng",
    producer: "Nhà sản xuất",
    qualityControl: "Kiểm soát chất lượng",
    coldChainIntegrity: "Tính toàn vẹn chuỗi lạnh",
    containsAllergens: "Chứa chất gây dị ứng",
    distributionTrail: "Lộ trình phân phối",
    recallBannerTitle: "Sản phẩm bị thu hồi — Không tiêu thụ",
    recallNumber: "Số thu hồi",
    recallClass: "Phân loại",
    recallReason: "Lý do",
    recallAction: "Hành động yêu cầu",
    recallHotline: "Đường dây nóng",
    batchId: "Mã lô hàng",
    productionDate: "Ngày sản xuất",
    harvestDate: "Ngày thu hoạch",
    bestBy: "Hạn sử dụng",
    expiresIn: "Hết hạn trong",
    expiredAgo: "Đã hết hạn",
    statusValid: "Hợp lệ",
    statusExpiringSoon: "Sắp hết hạn",
    statusExpired: "Đã hết hạn",
    statusRecall: "Thu hồi",
    coldChainPass: "Đạt",
    coldChainWarning: "Cảnh báo",
    coldChainFail: "Không đạt",
    readings: "Số đo",
    violations: "Vi phạm",
    dangerZone: "Vùng nguy hiểm",
    lastInspection: "Kiểm tra gần nhất",
    countryOfOrigin: "Quốc gia xuất xứ",
    // Report enrichment
    category: "Danh mục",
    warningSigns: "Dấu hiệu cảnh báo",
    storeName: "Tên cửa hàng",
    barcode: "Mã vạch",
    reportedToStore: "Đã báo cáo cửa hàng",
    yes: "Có",
    no: "Không",
    // History tabs
    tabReports: "Báo cáo",
    tabScans: "Quét",
    // Chatbot
    appMenuAssistant: "Trợ lý",
    chatPlaceholder: "Hỏi câu hỏi của bạn...",
    chatTitle: "Trợ lý AI",
    chatSend: "Gửi",
    botTyping: "Trợ lý đang viết...",
    chatWelcome: "Xin chào! Tôi là trợ lý an toàn thực phẩm của bạn. Hãy hỏi tôi về các quy tắc bảo quản, thu hồi sản phẩm hoặc thực hành vệ sinh.",
    chatExample1: "Nhiệt độ nấu chín thịt bò xay là bao nhiêu?",
    chatExample2: "Cơm nấu chín để tủ lạnh được bao lâu?",
    smartSuggestions: "Gợi ý thông minh",
    // Alerts / Toasts
    productNameRequired: "Vui lòng nhập tên sản phẩm.",
    reportImageUploadError: "Lỗi khi tải ảnh lên. Vui lòng thử lại.",
    reportSubmitError: "Không thể gửi báo cáo. Vui lòng thử lại.",
    reportSubmitSuccess: "Gửi báo cáo thành công!",
    scanSaveError: "Đã quét xong nhưng không lưu được vào lịch sử.",
    // FDA Recall Alerts
    appMenuRecalls: "Thu hồi",
    recallsPageTitle: "Cảnh báo thu hồi",
    recallAlertsSection: "Thu hồi thực phẩm",
    recallAlertsSubtitle: "Cảnh báo mới nhất từ FDA",
    viewRecalls: "Xem các vụ thu hồi",
    noActiveRecallAlerts: "Hiện không có cảnh báo thu hồi lớn nào.",
    noRecallsFound: "Không tìm thấy vụ thu hồi nào.",
    recallsLoadError: "Không thể tải dữ liệu thu hồi từ FDA.",
    recallsOfflineNotice: "Đang hiển thị dữ liệu đã lưu trước đó (ngoại tuyến).",
    recallSeverityHigh: "Rủi ro cao",
    recallSeverityMedium: "Rủi ro trung bình",
    recallSeverityLow: "Rủi ro thấp",
    recallFirm: "Công ty",
    recallDate: "Ngày thu hồi",
    recallDistributionPattern: "Phân phối",
    recallStatus: "Trạng thái",
    dismiss: "Bỏ qua",
    refresh: "Làm mới",
  },
  en: {
    appNameFood: "Food",
    appNameSafe: "Safe.",
    scanHistory: "Scan History",
    reportHistory: "Report History",
    viewAll: "View All",
    noRecentItems: "No recent items.",
    historyPageTitle: "History",
    historyNoReports: "No reports yet.",
    historyNoScans: "No scans yet.",
    scannerTitle: "Scanner",
    educationTitle: "Education",
    searchPlaceholder: "Search",
    warningSignGuides: "Warning Sign Guides",
    cardTitle: "Card Title",
    cardSubtitle: "Card Subtitle",
    reportDetailsTitle: "Report Details",
    loading: "Loading...",
    reportNotFound: "Report not found.",
    notesTitle: "Notes",
    noNotesProvided: "No notes provided.",
    cancel: "Cancel",
    createReport: "Create a report",
    submit: "Submit",
    productName: "Product Name",
    riskLevel: "Risk Level",
    addNotes: "Add notes",
    suspected: "Suspected",
    unsafe: "Unsafe",
    safe: "Safe",
    appMenuHome: "Home",
    appMenuCamera: "Camera",
    appMenuEducation: "Education",
    appMenuHistory: "History",
    selectLanguage: "Choose a language",
    loginTitle: "Log In",
    registerTitle: "Sign Up",
    email: "Email address",
    password: "Password",
    confirmPassword: "Confirm password",
    loginButton: "Log In",
    registerButton: "Sign Up",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    loginError: "Invalid email or password.",
    registerError: "An error occurred during registration.",
    registerSuccess: "Account created! Check your email to confirm.",
    passwordMismatch: "Passwords do not match.",
    logout: "Log Out",
    allFieldsRequired: "Please fill in all fields.",
    passwordTooShort: "Password must be at least 6 characters.",
    emailInvalid: "Invalid email address.",
    emailNotConfirmed: "Please confirm your email before logging in.",
    userAlreadyExists: "An account already exists with this email.",
    // QR/Traceability
    scanQR: "Scan QR",
    photoReport: "Photo Report",
    lookingUp: "Looking up product…",
    productNotFound: "Product not found",
    scanSuccessful: "Scan successful",
    batchInfo: "Batch Information",
    producer: "Producer",
    qualityControl: "Quality Control",
    coldChainIntegrity: "Cold Chain Integrity",
    containsAllergens: "Contains Allergens",
    distributionTrail: "Distribution Trail",
    recallBannerTitle: "Product Recalled — Do Not Consume",
    recallNumber: "Recall #",
    recallClass: "Class",
    recallReason: "Reason",
    recallAction: "Action Required",
    recallHotline: "Hotline",
    batchId: "Batch ID",
    productionDate: "Production Date",
    harvestDate: "Harvest Date",
    bestBy: "Best By / Use By",
    expiresIn: "Expires in",
    expiredAgo: "Expired",
    statusValid: "In Date",
    statusExpiringSoon: "Expires Soon",
    statusExpired: "Expired",
    statusRecall: "RECALLED",
    coldChainPass: "Pass",
    coldChainWarning: "Warning",
    coldChainFail: "Fail",
    readings: "Readings",
    violations: "Violations",
    dangerZone: "Danger Zone",
    lastInspection: "Last inspection",
    countryOfOrigin: "Country of Origin",
    // Report enrichment
    category: "Category",
    warningSigns: "Warning Signs",
    storeName: "Store Name",
    barcode: "Barcode",
    reportedToStore: "Reported to Store",
    yes: "Yes",
    no: "No",
    // History tabs
    tabReports: "Reports",
    tabScans: "Scans",
    // Chatbot
    appMenuAssistant: "Assistant",
    chatPlaceholder: "Ask your question...",
    chatTitle: "AI Assistant",
    chatSend: "Send",
    botTyping: "Assistant is typing...",
    chatWelcome: "Hello! I am your food safety assistant. Ask me questions about storage rules, product recalls, or hygiene best practices.",
    chatExample1: "What internal temp should I cook ground beef to?",
    chatExample2: "How long can I keep cooked rice in the fridge?",
    smartSuggestions: "Smart suggestions",
    // Alerts / Toasts
    productNameRequired: "Please enter a product name.",
    reportImageUploadError: "Error uploading the photo. Please try again.",
    reportSubmitError: "Couldn't submit the report. Please try again.",
    reportSubmitSuccess: "Report submitted successfully!",
    scanSaveError: "Scan completed, but couldn't be saved to history.",
    // FDA Recall Alerts
    appMenuRecalls: "Recalls",
    recallsPageTitle: "Recall Alerts",
    recallAlertsSection: "Food Recalls",
    recallAlertsSubtitle: "Latest alerts from the FDA",
    viewRecalls: "View Recalls",
    noActiveRecallAlerts: "No major recall alerts right now.",
    noRecallsFound: "No recalls found.",
    recallsLoadError: "Couldn't load FDA recall data.",
    recallsOfflineNotice: "Showing cached data (offline).",
    recallSeverityHigh: "High Risk",
    recallSeverityMedium: "Medium Risk",
    recallSeverityLow: "Low Risk",
    recallFirm: "Company",
    recallDate: "Recall Date",
    recallDistributionPattern: "Distribution",
    recallStatus: "Status",
    dismiss: "Dismiss",
    refresh: "Refresh",
  },
};

export function getLanguage(): LanguageCode {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === "fr" || stored === "vi" || stored === "en") {
    return stored;
  }

  return defaultLanguage;
}

export function setLanguage(code: LanguageCode) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
}

export function getCurrentLanguage() {
  return languages.find((item) => item.code === getLanguage()) ?? languages[0];
}

export function t(key: TranslationKey, lang: LanguageCode = getLanguage()) {
  return translations[lang][key] ?? key;
}
