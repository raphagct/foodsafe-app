import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  useIonRouter,
} from "@ionic/react";
import "../pages/HistoryPage/HistoryPage.css";
import { t, getLanguage } from "../utils/i18n";

type HistorySectionProps = {
  title: string;
  items?: any[];
  type?: "scan" | "report";
};

function HistorySection({ title, items = [], type }: HistorySectionProps) {
  const router = useIonRouter();
  const displayItems = items.slice(0, 3);
  const currentLanguage = getLanguage();

  const handleViewAll = () => {
    if (type === "report") {
      router.push("/tabs/history");
    }
  };
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
          onClick={handleViewAll}
        >
          {t("viewAll", currentLanguage)}
        </IonButton>
      </IonCardHeader>

      <IonCardContent className="min-h-[110px] mt-4 p-0 pb-[14px] px-[12px]">
        {displayItems.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {displayItems.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 flex flex-col items-center"
                onClick={() => router.push(`/tabs/history/report/${item.id}`)}
              >
                <div className="w-[85px] h-[85px] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={item.photoUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100&h=100"}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[13px] font-bold text-black mt-2 truncate w-[85px] text-center">
                  {item.productName}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-[13px] font-medium mt-2">
            {t("noRecentItems", currentLanguage)}
          </p>
        )}
      </IonCardContent>
    </IonCard>
  );
}

export default HistorySection;
