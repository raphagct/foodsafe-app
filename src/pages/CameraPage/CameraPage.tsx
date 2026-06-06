import { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonImg
} from '@ionic/react';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

function CameraTest() {
  const [photos, setPhotos] = useState<string[]>([]);

  // Chargement des photos sauvegardées au démarrage
  useEffect(() => {
    const photosSauvegardees = localStorage.getItem('photos_camera');

    if (photosSauvegardees) {
      setPhotos(JSON.parse(photosSauvegardees));
    }
  }, []);

  const prendreUnePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 800
      });

      if (!image.dataUrl) return;

      const nouvellesPhotos = [image.dataUrl, ...photos];

      setPhotos(nouvellesPhotos);
      localStorage.setItem('photos_camera', JSON.stringify(nouvellesPhotos));
    } catch (erreur) {
      console.log("L'utilisateur a quitté la caméra ou une erreur est survenue :", erreur);
    }
  };

  const supprimerPhotos = () => {
    localStorage.removeItem('photos_camera');
    setPhotos([]);
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
          Ouvrir la caméra Android
        </IonButton>

        {photos.length > 0 && (
          <IonButton expand="block" color="danger" onClick={supprimerPhotos}>
            Supprimer les photos
          </IonButton>
        )}

        <div
          style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            marginTop: '20px'
          }}
        >
          {photos.map((photo, index) => (
            <div
              key={index}
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #ccc'
              }}
            >
              <IonImg
                src={photo}
                alt={`Photo ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
}

export default CameraTest;