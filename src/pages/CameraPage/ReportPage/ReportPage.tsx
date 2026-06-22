import { useState, useEffect } from "react";
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
import { supabase } from "../../../utils/supabase";

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

  // Reset le formulaire à chaque ouverture
  useEffect(() => {
    if (isOpen) {
      setProductName("");
      setRiskLevel("Unsafe");
      setNotes("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!productName.trim()) {
      alert("Veuillez entrer un nom de produit.");
      return;
    }

    setIsSubmitting(true);

    // 1. Upload la photo dans Supabase Storage
    let imageUrl = "https://placehold.co/400x300?text=No+Image";

    if (photoUrl) {
      try {
        // Convertir le dataUrl base64 en Blob pour l'upload
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
        const fileName = `report_${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("report-images")
          .upload(fileName, blob, {
            contentType: blob.type || "image/jpeg",
            upsert: false,
          });

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          alert("Failed to upload image. Please try again.");
          setIsSubmitting(false);
          return;
        }

        // 2. Récupérer l'URL publique
        const { data: urlData } = supabase.storage
          .from("report-images")
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      } catch (err) {
        console.error("Image processing error:", err);
        alert("Failed to process image.");
        setIsSubmitting(false);
        return;
      }
    }

    // 3. Insérer le report avec l'URL de l'image
    const { error } = await supabase.from("report").insert({
      product_name: productName.trim(),
      risk_level: riskLevel,
      description: notes.trim() || "No description provided.",
      image_url: imageUrl,
    });

    if (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
      setIsSubmitting(false);
      return;
    }

    onClose(true);

    // Rediriger proprement vers l'historique en remplaçant la pile de navigation
    router.push("/tabs/history", "root", "replace");
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={() => {
      // Seulement si on a pas cliqué sur submit, c'est une vraie annulation
      if (!isSubmitting) {
        onClose(false);
      }
    }}>
      <IonHeader>
        <IonToolbar className="py-2 px-2">
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => onClose(false)}>Cancel</IonButton>
          </IonButtons>
          <IonTitle className="font-bold">Create a report</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {photoUrl && (
          <img
            alt="Captured product"
            src={photoUrl}
            className="w-full h-48 object-cover"
          />
        )}

        <div className="flex flex-col p-6 gap-6">
          <div className="flex flex-row items-center gap-4">
            <div className="flex-1 bg-[var(--color-surface)] rounded-xl px-4 ">
              <IonInput
                label="Product Name"
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
                label="Risk Level"
                labelPlacement="floating"
                interface="popover"
                value={riskLevel}
                onIonChange={(e) => setRiskLevel(e.detail.value)}
                className="font-semibold"
              >
                <IonSelectOption value="Suspected">Suspected</IonSelectOption>
                <IonSelectOption value="Unsafe">Unsafe</IonSelectOption>
              </IonSelect>
            </div>
          </div>
          <div className="bg-[var(--color-surface)] rounded-xl px-4 py-2">
            <IonTextarea
              label="Add notes"
              labelPlacement="floating"
              placeholder="Describe the issue..."
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
            Submit
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
}

export default CreateReportModal;
