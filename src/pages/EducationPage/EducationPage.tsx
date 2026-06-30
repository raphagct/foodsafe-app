import { IonContent, IonHeader, IonPage, IonToolbar } from "@ionic/react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSearchbar,
} from "@ionic/react";
import { t, getLanguage } from "../../utils/i18n";
import LogoutButton from "../../components/LogoutButton";

function EducationPage() {
  const currentLanguage = getLanguage();

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <div className="flex items-center justify-between p-4">
            <h1 className="text-2xl font-bold m-0">{t("educationTitle", currentLanguage)}</h1>
            <LogoutButton />
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSearchbar placeholder={t("searchPlaceholder", currentLanguage)}></IonSearchbar>
        <div className="flex flex-col p-4">
          <h2>{t("warningSignGuides", currentLanguage)}</h2>
          <div className="grid grid-cols-3 gap-4 px-4 py-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <IonCard key={i} className="m-0 bg-gray-100 shadow-sm border border-gray-200">
                <IonCardHeader className="p-2 pb-1">
                  <IonCardTitle className="text-sm font-bold text-gray-800">
                    {t("cardTitle", currentLanguage)} {i}
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent className="p-2 pt-0 text-xs text-gray-500">
                  {t("cardSubtitle", currentLanguage)}
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default EducationPage;
