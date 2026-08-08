import { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonInput,
  IonButton,
  IonModal,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonToggle,
  IonItem,
  IonLabel,
  IonChip,
  IonIcon,
  useIonRouter,
} from "@ionic/react";
import { checkmarkCircle } from "ionicons/icons";
import { supabase } from "../../services/supabaseClient";
import { t, getLanguage } from "../../utils/i18n";
import { REPORT_CATEGORIES, WARNING_SIGNS } from "../../types/report";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

interface CreateReportModalProps {
  isOpen: boolean;
  photoUrl: string | null;
  onClose: (wasSubmitted?: boolean) => void;
}

function CreateReportModal({ isOpen, photoUrl, onClose }: CreateReportModalProps) {
  const router = useIonRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [productName, setProductName] = useState("");
  const [riskLevel, setRiskLevel] = useState("UNSAFE");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [storeName, setStoreName] = useState("");
  const [barcodeScanned, setBarcodeScanned] = useState("");
  const [selectedWarningSigns, setSelectedWarningSigns] = useState<string[]>([]);
  const [reportedToStore, setReportedToStore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentLanguage = getLanguage();

  const resetForm = () => {
    setProductName("");
    setRiskLevel("UNSAFE");
    setCategory("");
    setNotes("");
    setStoreName("");
    setBarcodeScanned("");
    setSelectedWarningSigns([]);
    setReportedToStore(false);
    setIsSubmitting(false);
  };

  const toggleWarningSign = (key: string) => {
    setSelectedWarningSigns(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = async () => {
    if (!productName.trim()) {
      showToast({ type: "warning", message: t("productNameRequired", currentLanguage) });
      return;
    }

    if (!user) {
      console.error("No authenticated user; cannot submit report.");
      return;
    }

    setIsSubmitting(true);

    let imageUrl = "https://placehold.co/400x300?text=No+Image";

    if (photoUrl) {
      try {
        const [header, base64Data] = photoUrl.split(",");
        const mimeMatch = header.match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
        const byteString = atob(base64Data);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mime });
        const fileName = `report_${new Date().getTime()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("report-images")
          .upload(fileName, blob, {
            contentType: blob.type || "image/jpeg",
            upsert: false,
          });

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          showToast({ type: "error", message: t("reportImageUploadError", currentLanguage) });
          setIsSubmitting(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("report-images")
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      } catch (err) {
        console.error("Image processing error:", err);
        showToast({ type: "error", message: t("reportImageUploadError", currentLanguage) });
        setIsSubmitting(false);
        return;
      }
    }

    const { error } = await supabase.from("report").insert({
      user_id: user.id,
      product_name: productName.trim(),
      risk_level: riskLevel,
      category: category || null,
      description: notes.trim() || t("noNotesProvided", currentLanguage),
      image_url: imageUrl,
      warning_signs_json: selectedWarningSigns.length > 0 ? JSON.stringify(selectedWarningSigns) : null,
      store_name: storeName.trim() || null,
      barcode_scanned: barcodeScanned.trim() || null,
      reported_to_store: reportedToStore,
      tags_json: null,
    });

    if (error) {
      console.error("Error submitting report:", error);
      showToast({ type: "error", message: t("reportSubmitError", currentLanguage) });
      setIsSubmitting(false);
      return;
    }

    showToast({
      type: "success",
      title: t("reportSubmitSuccess", currentLanguage),
      message: productName.trim(),
    });
    onClose(true);
    router.push("/tabs/history", "root", "replace");
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={() => {
        if (!isSubmitting) {
          onClose(false);
        }
      }}
      onDidPresent={resetForm}
    >
      <IonHeader>
        <IonToolbar className="py-2 px-2">
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => onClose(false)}>
              {t("cancel", currentLanguage)}
            </IonButton>
          </IonButtons>
          <IonTitle className="font-bold">{t("createReport", currentLanguage)}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {photoUrl && (
          <img
            alt={t("productName", currentLanguage)}
            src={photoUrl}
            className="w-full h-48 object-cover"
          />
        )}

        <div className="flex flex-col p-4 gap-4">
          {/* Product Name + Risk Level */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-[var(--color-surface)] rounded-xl px-3 py-0.5 border border-gray-100">
              <IonInput
                label={t("productName", currentLanguage)}
                labelPlacement="floating"
                counter={true}
                maxlength={30}
                className="font-semibold text-sm"
                value={productName}
                onIonInput={(e) => setProductName(e.detail.value!)}
              />
            </div>

            <div className="flex-1 bg-[var(--color-surface)] rounded-xl px-3 py-1 border border-gray-100">
              <IonSelect
                label={t("riskLevel", currentLanguage)}
                labelPlacement="floating"
                interface="popover"
                value={riskLevel}
                onIonChange={(e) => setRiskLevel(e.detail.value)}
                className="font-semibold text-sm"
              >
                <IonSelectOption value="SUSPECTED">{t("suspected", currentLanguage)}</IonSelectOption>
                <IonSelectOption value="UNSAFE">{t("unsafe", currentLanguage)}</IonSelectOption>
                <IonSelectOption value="SAFE">{t("safe", currentLanguage)}</IonSelectOption>
              </IonSelect>
            </div>
          </div>

          {/* Category */}
          <div className="bg-[var(--color-surface)] rounded-xl px-3 py-1 border border-gray-100">
            <IonSelect
              label={t("category", currentLanguage)}
              labelPlacement="floating"
              interface="action-sheet"
              value={category}
              onIonChange={(e) => setCategory(e.detail.value)}
              className="font-semibold text-sm"
            >
              {REPORT_CATEGORIES.map(cat => (
                <IonSelectOption key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </IonSelectOption>
              ))}
            </IonSelect>
          </div>

          {/* Warning Signs */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 px-1">
              {t("warningSigns", currentLanguage)}
            </p>
            <div className="flex flex-wrap gap-2">
              {WARNING_SIGNS.map(ws => {
                const isSelected = selectedWarningSigns.includes(ws.key);
                return (
                  <IonChip
                    key={ws.key}
                    color={isSelected ? (ws.severity === "HIGH" ? "danger" : "warning") : "medium"}
                    outline={!isSelected}
                    onClick={() => toggleWarningSign(ws.key)}
                    style={{
                      paddingStart: "12px",
                      paddingEnd: "14px",
                      height: "34px",
                      borderRadius: "999px",
                    }}
                    className="text-xs font-semibold m-0"
                  >
                    {isSelected && <IonIcon icon={checkmarkCircle} />}
                    <IonLabel>{ws.label}</IonLabel>
                  </IonChip>
                );
              })}
            </div>
          </div>

          {/* Store Name + Barcode */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-[var(--color-surface)] rounded-xl px-3 py-0.5 border border-gray-100">
              <IonInput
                label={t("storeName", currentLanguage)}
                labelPlacement="floating"
                className="font-semibold text-sm"
                value={storeName}
                onIonInput={(e) => setStoreName(e.detail.value!)}
              />
            </div>
            <div className="flex-1 bg-[var(--color-surface)] rounded-xl px-3 py-0.5 border border-gray-100">
              <IonInput
                label={t("barcode", currentLanguage)}
                labelPlacement="floating"
                className="font-semibold text-sm"
                value={barcodeScanned}
                onIonInput={(e) => setBarcodeScanned(e.detail.value!)}
              />
            </div>
          </div>

          {/* Reported to store toggle */}
          <IonItem lines="none" className="[--background:var(--color-surface)] rounded-xl border border-gray-100 py-0.5">
            <IonLabel className="font-semibold text-sm">{t("reportedToStore", currentLanguage)}</IonLabel>
            <IonToggle
              slot="end"
              checked={reportedToStore}
              onIonChange={(e) => setReportedToStore(e.detail.checked)}
              color="success"
            />
          </IonItem>

          {/* Notes */}
          <div className="bg-[var(--color-surface)] rounded-xl px-3 py-1 border border-gray-100">
            <IonTextarea
              label={t("addNotes", currentLanguage)}
              labelPlacement="floating"
              placeholder={t("addNotes", currentLanguage)}
              autoGrow={true}
              rows={3}
              className="font-medium text-sm"
              value={notes}
              onIonInput={(e) => setNotes(e.detail.value!)}
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-13 rounded-2xl font-bold text-white text-base shadow-md transition-all active:scale-[0.98] mt-2 flex items-center justify-center cursor-pointer"
            style={{
              background: isSubmitting ? "#86efac" : "#159947",
              boxShadow: "0 4px 14px rgba(21, 153, 71, 0.25)",
              border: "none",
            }}
          >
            {t("submit", currentLanguage)}
          </button>
        </div>
      </IonContent>
    </IonModal>
  );
}

export default CreateReportModal;
