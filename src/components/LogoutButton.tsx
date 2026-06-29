import { IonButton, IonIcon } from "@ionic/react";
import { logOutOutline } from "ionicons/icons";
import { useAuth } from "../contexts/AuthContext";
import { t, getLanguage } from "../utils/i18n";
import { useHistory } from "react-router-dom";

function LogoutButton() {
  const { signOut } = useAuth();
  const lang = getLanguage();
  const history = useHistory();

  const handleLogout = async () => {
    await signOut();
    history.replace("/login");
  };

  return (
    <IonButton 
      fill="clear" 
      onClick={handleLogout} 
      className="m-0"
      style={{
        '--color': '#ef4444',
        '--padding-start': '8px',
        '--padding-end': '8px',
        height: '32px',
        fontSize: '13px'
      } as React.CSSProperties}
    >
      <IonIcon slot="start" icon={logOutOutline} className="mr-1" style={{ fontSize: '18px' }} />
      {t("logout", lang)}
    </IonButton>
  );
}

export default LogoutButton;
