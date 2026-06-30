import { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonBadge,
  IonButtons,
  useIonViewWillEnter
} from "@ionic/react";
import { supabase } from "../../utils/supabase";
import { t, getLanguage } from "../../utils/i18n";
import LogoutButton from "../../components/LogoutButton";

interface Report {
  report_id: string;
  product_name: string;
  risk_level: string;
  description: string;
  image_url: string;
  created_at: string;
}

function HistoryPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const currentLanguage = getLanguage();

  useIonViewWillEnter(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from("report")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reports:", error);
        return;
      }

      if (data) {
        setReports(data);
      }
    }

    fetchReports();
  });

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle className="font-bold">{t("historyPageTitle", currentLanguage)}</IonTitle>
          <IonButtons slot="end" className="pr-2">
            <LogoutButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="[--background:var(--color-surface)]">
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 font-medium">
            {t("historyNoReports", currentLanguage)}
          </div>
        ) : (
          <IonList className="bg-transparent px-4 py-4 mt-4" lines="none">
            {reports.map((report) => (
              <IonItem
                key={report.report_id}
                routerLink={`/tabs/history/report/${report.report_id}`}
                className="mb-4 rounded-xl shadow-sm [--background:white] py-1"
                detail={true}
              >
                <IonThumbnail slot="start" className="rounded-lg overflow-hidden border border-gray-100">
                  <img
                    alt={report.product_name}
                    src={report.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100&h=100"}
                    className="object-cover w-full h-full"
                  />
                </IonThumbnail>
                <IonLabel className="ml-2">
                  <h2 className="font-bold text-gray-900 text-lg">{report.product_name}</h2>
                  <p className="text-sm text-gray-500 font-medium">{new Date(report.created_at).toLocaleDateString()}</p>
                </IonLabel>
                <IonBadge
                  slot="end"
                  color={report.risk_level === 'Unsafe' ? 'danger' : 'warning'}
                  className="rounded-lg px-2 py-1 shadow-sm"
                >
                  {report.risk_level.toUpperCase()}
                </IonBadge>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
}

export default HistoryPage;