import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

function SignOutIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function LogoutButton() {
  const { signOut } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    await signOut();
    history.replace("/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      title="Déconnexion"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 38,
        height: 38,
        borderRadius: "50%",
        background: "#ffffff",
        border: "0.5px solid #e0e0e0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
        color: "#475569",
        cursor: "pointer",
        padding: 0,
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        transition: "all 0.15s ease",
      }}
    >
      <SignOutIcon />
    </button>
  );
}

export default LogoutButton;
