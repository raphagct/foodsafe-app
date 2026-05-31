import {IonButton, IonIcon} from "@ionic/react";
import { globeOutline } from "ionicons/icons";

import "../theme/LanguageButton.css";

function LanguageButton() {
  return (
    <IonButton className="language-button" shape="round">
      <IonIcon className="text-[26px]" slot="icon-only" icon={globeOutline} />
    </IonButton>
  );
}

export default LanguageButton;