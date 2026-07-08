import { IonPopover } from "@ionic/react";
import { getCurrentLanguage, languages, setLanguage, t } from "../utils/i18n";

type LanguageCode = "fr" | "vi" | "en";

const LANG_SHORT: Record<LanguageCode, string> = {
  fr: "FRA",
  en: "ENG",
  vi: "VIE",
};

function ChevronIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#aaa"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#555"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LanguageButton() {
  const currentLanguage = getCurrentLanguage();
  const currentCode = currentLanguage.code as LanguageCode;

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    window.location.reload();
  };

  return (
    <>
      <button
        id="language-trigger"
        type="button"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "#fff",
          border: "0.5px solid #e0e0e0",
          borderRadius: 999,
          boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
          cursor: "pointer",
          padding: "7px 12px 7px 10px",
          /* Mobile touch fixes */
          minHeight: 44,
          minWidth: 44,
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
          position: "relative",
          zIndex: 10,
          userSelect: "none",
        }}
      >
        <img
          src={currentLanguage.flag}
          alt={currentLanguage.label}
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            objectFit: "cover",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.07)",
            pointerEvents: "none",
          }}
        />
        <span style={{ fontSize: 13, fontWeight: 500, color: "#111", letterSpacing: "0.02em", pointerEvents: "none" }}>
          {LANG_SHORT[currentCode]}
        </span>
        <span style={{ pointerEvents: "none", display: "inline-flex" }}>
          <ChevronIcon />
        </span>
      </button>

      <IonPopover
        trigger="language-trigger"
        triggerAction="click"
        side="bottom"
        alignment="center"
        showBackdrop={false}
        dismissOnSelect={true}
        className="lang-picker-popover"
      >
        <style>{`
          .lang-picker-popover {
            --width: 220px;
            --border-radius: 18px;
            --box-shadow: 0 8px 28px rgba(0,0,0,0.11);
            --background: #fff;
          }
          .lang-picker-popover::part(content) {
            border-radius: 18px;
            border: 0.5px solid #e0e0e0;
            padding: 5px;
          }
        `}</style>

        <p style={{ margin: 0, padding: "6px 12px 4px", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: "#bbb", textTransform: "uppercase" }}>
          {t("selectLanguage", currentCode)}
        </p>

        {languages.map((language) => {
          const code = language.code as LanguageCode;
          const isSelected = code === currentCode;

          return (
            <button
              key={code}
              type="button"
              onClick={() => handleSelect(code)}
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                gap: 11,
                padding: "8px 11px",
                borderRadius: 12,
                background: isSelected ? "#f0f0f0" : "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                minHeight: 44,
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <img
                src={language.flag}
                alt={language.label}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.07)",
                }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: isSelected ? "#444" : "#111", letterSpacing: "0.04em", lineHeight: 1.2 }}>
                  {LANG_SHORT[code]}
                </p>
                <p style={{ margin: "1px 0 0", fontSize: 11, color: "#999", lineHeight: 1.3 }}>
                  {language.label}
                </p>
              </div>
              {isSelected && (
                <span style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: "#e2e2e2",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <CheckIcon />
                </span>
              )}
            </button>
          );
        })}
      </IonPopover>
    </>
  );
}

export default LanguageButton;