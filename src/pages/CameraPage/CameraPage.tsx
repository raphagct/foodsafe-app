import { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonImg } from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

function CameraTest() {
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  const prendreUnePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false, 
        resultType: CameraResultType.Uri, // Idéal pour l'affichage <IonImg>
        source: CameraSource.Camera,      // FORCE la caméra native (bloque l'accès aux fichiers)
      });

      // Stocke le chemin web temporaire de la photo
      setPhotoUrl(image.webPath);
    } catch (erreur) {
      console.log("L'utilisateur a quitté la caméra ou une erreur est survenue :", erreur);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Test Caméra Native</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={prendreUnePhoto}>
          Ouvrir la Caméra Android
        </IonButton>

        {photoUrl && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <h3>Aperçu du scan / de la photo :</h3>
            <IonImg src={photoUrl} alt="Aperçu caméra" />
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}

export default CameraTest;