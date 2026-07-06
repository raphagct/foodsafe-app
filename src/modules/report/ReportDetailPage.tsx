import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonBadge,
  useIonViewWillEnter
} from "@ionic/react";
import { useParams } from "react-router";
import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { t, getLanguage } from "../../utils/i18n";

interface Report {
  report_id: string;
  product_name: string;
  risk_level: string;
  description: string;
  image_url: string;
  created_at: string;
}

function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const currentLanguage = getLanguage();

  useIonViewWillEnter(() => {
    async function fetchReport() {
      const { data, error } = await supabase
        .from("report")
        .select("*")
        .eq("report_id", id)
        .single();

      if (error) {
        console.error("Error fetching report:", error);
        return;
      }

      if (data) {
        setReport(data);
      }
    }

    fetchReport();
  });

  if (!report) {
    return (
      <IonPage>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="start"><IonBackButton defaultHref="/tabs/history" /></IonButtons>
            <IonTitle>{t("loading", currentLanguage)}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="flex items-center justify-center h-full text-gray-500">
            {t("reportNotFound", currentLanguage)}
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="py-2 px-2">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/history" />
          </IonButtons>
          <IonTitle className="font-bold">{t("reportDetailsTitle", currentLanguage)}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="[--background:var(--color-surface)]">
        <div className="relative w-full h-[220px]">
          <img
            alt={report.product_name}
            src={report.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600&h=400"}
            className="w-full h-full object-cover bg-gray-200"
          />
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[var(--color-surface)] to-transparent"></div>
        </div>

        <div className="px-5 pb-8 pt-4 flex flex-col gap-6 relative z-10 -mt-2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black text-gray-900">{report.product_name}</h1>
              <p className="text-sm font-medium text-gray-500 mt-1">{new Date(report.created_at).toLocaleDateString()}</p>
            </div>
            <IonBadge color={report.risk_level === 'Unsafe' ? 'danger' : 'warning'} className="px-3 py-1 text-sm rounded-lg shadow-sm">
              {report.risk_level.toUpperCase()}
            </IonBadge>
          </div>

          <div className="bg-white rounded-xl shadow-sm px-5 py-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
              {t("notesTitle", currentLanguage)}
            </h2>
            <p className="text-gray-800 font-medium leading-relaxed text-[15px]">
              {report.description || t("noNotesProvided", currentLanguage)}
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default ReportDetailPage;
