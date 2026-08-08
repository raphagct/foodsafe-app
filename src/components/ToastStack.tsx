import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IonIcon } from "@ionic/react";
import {
  checkmarkCircle,
  closeCircle,
  warningOutline,
  informationCircleOutline,
  closeOutline,
} from "ionicons/icons";
import "./ToastStack.css";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: number;
  type: ToastType;
  title?: string;
  message: string;
  duration: number;
}

const TYPE_STYLES: Record<
  ToastType,
  { icon: string; iconColor: string; iconBg: string; iconBorder: string }
> = {
  success: { icon: checkmarkCircle, iconColor: "#159947", iconBg: "#F0FDF4", iconBorder: "#DCFCE7" },
  error: { icon: closeCircle, iconColor: "#EF4444", iconBg: "#FEF2F2", iconBorder: "#FEE2E2" },
  warning: { icon: warningOutline, iconColor: "#F59E0B", iconBg: "#FFFBEB", iconBorder: "#FDE68A" },
  info: { icon: informationCircleOutline, iconColor: "#3B82F6", iconBg: "#EFF6FF", iconBorder: "#DBEAFE" },
};

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  const [isLeaving, setIsLeaving] = useState(false);
  const style = TYPE_STYLES[toast.type];

  useEffect(() => {
    const leaveTimer = setTimeout(() => setIsLeaving(true), toast.duration);
    return () => clearTimeout(leaveTimer);
  }, [toast.duration]);

  useEffect(() => {
    if (!isLeaving) return;
    const removeTimer = setTimeout(() => onDismiss(toast.id), 220);
    return () => clearTimeout(removeTimer);
  }, [isLeaving, onDismiss, toast.id]);

  return (
    <div
      className={`toast-card ${isLeaving ? "toast-card-leave" : "toast-card-enter"}`}
      onClick={() => setIsLeaving(true)}
      role="alert"
    >
      <div className="toast-card-inner">
        <div
          className="toast-icon"
          style={{ background: style.iconBg, border: `1px solid ${style.iconBorder}`, color: style.iconColor }}
        >
          <IonIcon icon={style.icon} />
        </div>
        <div className="toast-text">
          {toast.title && <p className="toast-title">{toast.title}</p>}
          <p className="toast-message">{toast.message}</p>
        </div>
        <button
          type="button"
          className="toast-close"
          onClick={(e) => {
            e.stopPropagation();
            setIsLeaving(true);
          }}
        >
          <IonIcon icon={closeOutline} />
        </button>
      </div>
      <div className="toast-progress-track">
        <div
          className="toast-progress-bar"
          style={{ background: style.iconColor, animationDuration: `${toast.duration}ms` }}
        />
      </div>
    </div>
  );
}

function ToastStack({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  return createPortal(
    <div className="toast-stack">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body
  );
}

export default ToastStack;
