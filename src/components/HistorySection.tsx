import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";

import "../theme/HistorySection.css";

type HistorySectionProps = {
  title: string;
};

function HistorySection({ title }: HistorySectionProps) {
  return (
    /* Combiné : Styles internes (.history-section) + Structure Tailwind */
    <IonCard className="history-section w-full rounded-[6px] mt-4 box-border font-['Inter',sans-serif]">
      
      {/* Header en Flexbox avec Tailwind */}
      <IonCardHeader className="flex flex-row items-center justify-between p-0 pt-[14px] px-[12px]">
        
        {/* Titre entièrement stylisé en Tailwind */}
        <IonCardTitle className="m-0 font-['Inter',sans-serif] text-[18px] font-extrabold text-black tracking-[-0.4px]">
          {title}
        </IonCardTitle>

        {/* Bouton : Variables complexes (.view-all-button) + Typographie Tailwind */}
        <IonButton
          className="view-all-button m-0 p-0 font-['Inter',sans-serif] text-[11px] font-extrabold"
          fill="clear"
          size="small"
        >
          VIEW ALL
        </IonButton>
      </IonCardHeader>

      {/* Contenu de la carte stylisé en Tailwind */}
      <IonCardContent className="min-h-[110px] mt-4 p-0 pb-[14px] px-[12px]">
        {/* Ici on pourra mettre les photos des produits qu'on veut */}
      </IonCardContent>
    </IonCard>
  );
}

export default HistorySection;