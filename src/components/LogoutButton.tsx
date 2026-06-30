import { IonButton, IonIcon } from "@ionic/react";
import { logOutOutline } from "ionicons/icons";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

function LogoutButton() {
  const { signOut } = useAuth();
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
      shape="round"
      style={{
        '--color': '#ef4444',
        '--padding-start': '0px',
        '--padding-end': '0px',
        width: '34px',
        height: '34px',
        minHeight: '34px',
        '--background': 'rgba(239, 68, 68, 0.08)',
        '--background-hover': 'rgba(239, 68, 68, 0.15)',
        '--border-radius': '50%',
      } as React.CSSProperties}
    >
      <IonIcon slot="icon-only" icon={logOutOutline} style={{ fontSize: '18px' }} />
    </IonButton>
  );
}

export default LogoutButton;
