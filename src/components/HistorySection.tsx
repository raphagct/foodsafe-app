import { IonButton, IonCard, IonCardContent } from "@ionic/react";
import "../theme/HistorySection.css";

type HistorySectionProps = {
  title: string;
};

function HistorySection({ title }: HistorySectionProps) {
  return (
    <IonCard className="history-section">
      <div className="history-header">
        <h2 className="history-title">{title}</h2>

        <IonButton
          className="view-all-button"
          fill="clear"
          size="small"
        >
          VIEW ALL
        </IonButton>
      </div>

      <IonCardContent className="history-content">
        {/* Ici on pourra mettre les photos des produits qu'on veut */}
      </IonCardContent>
    </IonCard>
  );
}

export default HistorySection;