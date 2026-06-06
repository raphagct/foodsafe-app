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

interface CreateReportModalProps {
  isOpen: boolean;
  photoUrl: string | null;
  onClose: (wasSubmitted?: boolean) => void;
}

function CreateReportModal({ isOpen, photoUrl, onClose }: CreateReportModalProps) {
  const router = useIonRouter();
  const [productName, setProductName] = useState("");
  const [riskLevel, setRiskLevel] = useState("unsafe");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset le formulaire à chaque ouverture
  useEffect(() => {
    if (isOpen) {
      setProductName("");
      setRiskLevel("unsafe");
      setNotes("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!productName.trim()) {
      alert("Veuillez entrer un nom de produit.");
      return;
    }

    setIsSubmitting(true);

    const newReport = {
      id: Date.now().toString(),
      photoUrl,
      productName,
      riskLevel,
      notes,
      date: new Date().toISOString()
    };

    const existingData = localStorage.getItem("foodsafe_reports");
    const reports = existingData ? JSON.parse(existingData) : [];
    
    // Ajouter au début de la liste
    reports.unshift(newReport);
    localStorage.setItem("foodsafe_reports", JSON.stringify(reports));
    
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
                <IonSelectOption value="suspected">Suspected</IonSelectOption>
                <IonSelectOption value="unsafe">Unsafe</IonSelectOption>
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
