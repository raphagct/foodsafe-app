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
  useIonRouter,
} from "@ionic/react";
import { supabase } from "../../services/supabaseClient";
import { t, getLanguage } from "../../utils/i18n";

interface CreateReportModalProps {
  isOpen: boolean;
  photoUrl: string | null;
  onClose: (wasSubmitted?: boolean) => void;
}

function CreateReportModal({ isOpen, photoUrl, onClose }: CreateReportModalProps) {
  const router = useIonRouter();
  const [productName, setProductName] = useState("");
  const [riskLevel, setRiskLevel] = useState("Unsafe");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentLanguage = getLanguage();

  const resetForm = () => {
    setProductName("");
    setRiskLevel("Unsafe");
    setNotes("");
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    if (!productName.trim()) {
      alert(t("productName", currentLanguage));
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
          alert(t("submit", currentLanguage));
          setIsSubmitting(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("report-images")
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      } catch (err) {
        console.error("Image processing error:", err);
        alert(t("submit", currentLanguage));
        setIsSubmitting(false);
        return;
      }
    }

    const { error } = await supabase.from("report").insert({
      product_name: productName.trim(),
      risk_level: riskLevel,
      description: notes.trim() || t("noNotesProvided", currentLanguage),
      image_url: imageUrl,
    });

    if (error) {
      console.error("Error submitting report:", error);
      alert(t("submit", currentLanguage));
      setIsSubmitting(false);
      return;
    }

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

        <div className="flex flex-col p-6 gap-6">
          <div className="flex flex-row items-center gap-4">
            <div className="flex-1 bg-[var(--color-surface)] rounded-xl px-4 ">
              <IonInput
                label={t("productName", currentLanguage)}
                labelPlacement="floating"
                counter={true}
                maxlength={20}
                className="font-semibold"
                value={productName}
                onIonInput={(e) => setProductName(e.detail.value!)}
              ></IonInput>
            </div>

            <div className="flex-1 bg-[var(--color-surface)] rounded-xl px-4 py-3">
              <IonSelect
                label={t("riskLevel", currentLanguage)}
                labelPlacement="floating"
                interface="popover"
                value={riskLevel}
                onIonChange={(e) => setRiskLevel(e.detail.value)}
                className="font-semibold"
              >
                <IonSelectOption value="Suspected">{t("suspected", currentLanguage)}</IonSelectOption>
                <IonSelectOption value="Unsafe">{t("unsafe", currentLanguage)}</IonSelectOption>
              </IonSelect>
            </div>
          </div>
          <div className="bg-[var(--color-surface)] rounded-xl px-4 py-2">
            <IonTextarea
              label={t("addNotes", currentLanguage)}
              labelPlacement="floating"
              placeholder={t("addNotes", currentLanguage)}
              autoGrow={true}
              rows={5}
              className="font-medium"
              value={notes}
              onIonInput={(e) => setNotes(e.detail.value!)}
            ></IonTextarea>
          </div>

          <IonButton
            expand="block"
            shape="round"
            className="h-14 font-bold mt-2"
            onClick={handleSubmit}
          >
            {t("submit", currentLanguage)}
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
}

export default CreateReportModal;
