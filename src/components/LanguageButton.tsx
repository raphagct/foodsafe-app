import { IonButton, IonIcon } from "@ionic/react";
import { globeOutline } from "ionicons/icons";

function LanguageButton() {
  return (
    <IonButton className="[--background:white] [--color:black] [--box-shadow:none] size-11 m-0" shape="round">
      <IonIcon className="text-[26px]" slot="icon-only" icon={globeOutline} />
    </IonButton>
  );
}

export default LanguageButton;
