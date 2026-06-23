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
  | "selectLanguage";

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
