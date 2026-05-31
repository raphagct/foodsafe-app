import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import "../pages/HistoryPage/HistoryPage.css";

type HistorySectionProps = {
  title: string;
};

function HistorySection({ title }: HistorySectionProps) {
  return (
    <IonCard className="history-section w-full rounded-[6px] mt-4 box-border">
      <IonCardHeader className="flex flex-row items-center justify-between p-0 pt-[14px] px-[12px]">
        <IonCardTitle className="m-0 text-[18px] font-extrabold text-black tracking-[-0.4px]">
          {title}
        </IonCardTitle>

        <IonButton
          className="view-all-button m-0 p-0 text-[11px] font-extrabold"
          fill="clear"
          size="small"
        >
          VIEW ALL
        </IonButton>
      </IonCardHeader>

      <IonCardContent className="min-h-[110px] mt-4 p-0 pb-[14px] px-[12px]"></IonCardContent>
    </IonCard>
  );
}

export default HistorySection;
