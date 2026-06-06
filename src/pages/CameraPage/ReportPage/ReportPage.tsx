import {
  IonContent,
  IonPage,
  IonHeader,
  IonInput,
  IonButton,
  IonModal,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from "@ionic/react";

function ReportPage() {
  return (
    <IonPage>
      <IonModal isOpen={true}>
        <IonHeader>
          <IonToolbar className="py-2 px-2">
            <IonButtons slot="start">
              <IonButton color="medium">Cancel</IonButton>
            </IonButtons>
            <IonTitle className="font-bold">Create a report</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <img
            alt="Silhouette of mountains"
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600&h=400"
            className="w-full h-48 object-cover"
          />

          <div className="flex flex-col p-6 gap-6">
            <div className="flex flex-row items-center gap-4">
              <div className="flex-1 bg-[var(--color-surface)] rounded-xl px-4 ">
                <IonInput
                  label="Product Name"
                  labelPlacement="floating"
                  counter={true}
                  maxlength={20}
                  className="font-semibold"
                ></IonInput>
              </div>

              <div className="flex-1 bg-[var(--color-surface)] rounded-xl px-4 py-3">
                <IonSelect
                  label="Label"
                  labelPlacement="floating"
                  interface="popover"
                  value="unsafe"
                  className="font-semibold"
                >
                  <IonSelectOption value="suspected">Suspected</IonSelectOption>
                  <IonSelectOption value="unsafe">Unsafe</IonSelectOption>
                </IonSelect>
              </div>
            </div>
            <div className="bg-[var(--color-surface)] rounded-xl px-4 py-2">
              <IonTextarea
                label="Add notes"
                labelPlacement="floating"
                placeholder="Describe the issue..."
                autoGrow={true}
                rows={5}
                className="font-medium"
              ></IonTextarea>
            </div>

            <IonButton
              expand="block"
              shape="round"
              className="h-14 font-bold mt-2"
            >
              Submit
            </IonButton>
          </div>
        </IonContent>
      </IonModal>
    </IonPage>
  );
}

export default ReportPage;
