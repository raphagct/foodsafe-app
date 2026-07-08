import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  useIonRouter,
} from "@ionic/react";
import "../modules/history/HistoryPage.css";
import { t, getLanguage } from "../utils/i18n";

type HistoryItem = {
  id: string;
  photoUrl?: string | null;
  productName: string;
  batchId?: string | null;
  isRecall?: boolean;
  expiryStatus?: string;
  scannedAt?: string;
};

type HistorySectionProps = {
  title: string;
  items?: HistoryItem[];
  type?: "scan" | "report";
};

function HistorySection({ title, items = [], type }: HistorySectionProps) {
  const router = useIonRouter();
  const displayItems = items.slice(0, 4);
  const currentLanguage = getLanguage();

  const handleViewAll = () => {
    router.push("/tabs/history");
  };

  const handleItemClick = (item: HistoryItem) => {
    if (type === "scan") {
      if (item.batchId) {
        router.push(`/tabs/camera/traceability/${item.batchId}`);
      } else {
        router.push("/tabs/history");
      }
    } else {
      router.push(`/tabs/history/report/${item.id}`);
    }
  };

  const getStatusBadge = (item: HistoryItem) => {
    if (item.isRecall) {
      return { bg: "#fee2e2", color: "#991b1b", label: "RAPPEL", icon: "🚨" };
    }
    if (item.expiryStatus === "EXPIRED") {
      return { bg: "#fef9c3", color: "#854d0e", label: "EXPIRÉ", icon: "⚠️" };
    }
    return { bg: "#dcfce7", color: "#166534", label: "VALIDE", icon: "✅" };
  };

  return (
    <IonCard className="history-section w-full rounded-[14px] mt-4 box-border shadow-sm border border-gray-100">
      <IonCardHeader className="flex flex-row items-center justify-between p-0 pt-[14px] px-[14px]">
        <IonCardTitle className="m-0 text-[17px] font-extrabold text-black tracking-[-0.4px]">
          {title}
        </IonCardTitle>

        <IonButton
          className="view-all-button m-0 p-0 text-[12px] font-bold text-[var(--color-primary)]"
          fill="clear"
          size="small"
          onClick={handleViewAll}
        >
          {t("viewAll", currentLanguage)}
        </IonButton>
      </IonCardHeader>

      <IonCardContent className="min-h-[115px] mt-3 p-0 pb-[14px] px-[14px]">
        {displayItems.length > 0 ? (
          <div className="flex gap-3.5 overflow-x-auto pb-1">
            {displayItems.map((item) => {
              const status = getStatusBadge(item);
              return (
                <div
                  key={item.id}
                  className="flex-shrink-0 flex flex-col items-center cursor-pointer group"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="w-[84px] h-[84px] rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs relative bg-gray-50 flex items-center justify-center">
                    {item.photoUrl ? (
                      <img
                        src={item.photoUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : type === "scan" ? (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center gap-1"
                        style={{ background: status.bg }}
                      >
                        <span className="text-2xl">{status.icon}</span>
                        <span
                          className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full"
                          style={{ color: status.color, background: "rgba(255,255,255,0.7)" }}
                        >
                          {status.label}
                        </span>
                      </div>
                    ) : (
                      <img
                        src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100&h=100"
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <p className="text-[12px] font-semibold text-gray-800 mt-2 truncate w-[84px] text-center">
                    {item.productName}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[80px] bg-gray-50/70 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-[13px] font-medium m-0">
              {t("noRecentItems", currentLanguage)}
            </p>
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
}

export default HistorySection;
