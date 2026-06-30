export type LanguageCode = "fr" | "vi" | "en";

export const LANGUAGE_STORAGE_KEY = "foodsafe_language";

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

export const defaultLanguage: LanguageCode = "fr";

export type TranslationKey =
  | "appNameFood"
  | "appNameSafe"
  | "scanHistory"
  | "reportHistory"
  | "viewAll"
  | "noRecentItems"
  | "historyPageTitle"
  | "historyNoReports"
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
  | "userAlreadyExists";

export const translations: Record<LanguageCode, Record<TranslationKey, string>> = {
  fr: {
    appNameFood: "Food",
    appNameSafe: "Safe.",
    scanHistory: "Historique des scans",
    reportHistory: "Historique des rapports",
    viewAll: "Voir tout",
    noRecentItems: "Aucun élément récent.",
    historyPageTitle: "Historique",
    historyNoReports: "Aucun rapport pour le moment.",
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
