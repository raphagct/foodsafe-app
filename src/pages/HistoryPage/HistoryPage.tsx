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
  useIonViewWillEnter
} from "@ionic/react";

interface Report {
  id: string;
  photoUrl: string | null;
  productName: string;
  riskLevel: string;
  notes: string;
  date: string;
}

function HistoryPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useIonViewWillEnter(() => {
    const existing = localStorage.getItem("foodsafe_reports");
    if (existing) {
      setReports(JSON.parse(existing));
    }
  });

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle className="font-bold">History</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="[--background:var(--color-surface)]">
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 font-medium">
            No reports yet.
          </div>
        ) : (
          <IonList className="bg-transparent px-4 py-4" lines="none">
            {reports.map((report) => (
              <IonItem 
                key={report.id} 
                routerLink={`/tabs/history/report/${report.id}`}
                className="mb-4 rounded-xl shadow-sm [--background:white] py-1"
                detail={true}
              >
                <IonThumbnail slot="start" className="rounded-lg overflow-hidden border border-gray-100">
                  <img 
                    alt={report.productName} 
                    src={report.photoUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100&h=100"} 
                    className="object-cover w-full h-full" 
                  />
                </IonThumbnail>
                <IonLabel className="ml-2">
                  <h2 className="font-bold text-gray-900 text-lg">{report.productName}</h2>
                  <p className="text-sm text-gray-500 font-medium">{new Date(report.date).toLocaleDateString()}</p>
                </IonLabel>
                <IonBadge 
                  slot="end" 
                  color={report.riskLevel === 'unsafe' ? 'danger' : 'warning'} 
                  className="rounded-lg px-2 py-1 shadow-sm"
                >
                  {report.riskLevel.toUpperCase()}
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