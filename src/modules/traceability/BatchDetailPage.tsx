import { useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonLabel,
  IonItem,
  IonList,
  IonIcon,
  useIonViewWillEnter,
} from "@ionic/react";
import {
  checkmarkCircle,
  warning,
  closeCircle,
  alertCircle,
  snowOutline,
  leafOutline,
  businessOutline,
  cubeOutline,
  flaskOutline,
  navigateOutline,
} from "ionicons/icons";
import { useParams } from "react-router-dom";
import { lookupByQR } from "../../services/traceabilityService";
import type {
  TraceabilityResultFound,
  ExpiryStatus,
} from "../../types/traceability";
import { t, getLanguage } from "../../utils/i18n";

const STATUS_CONFIG: Record<
  ExpiryStatus,
  { bg: string; border: string; icon: string; textColor: string; ionColor: string }
> = {
  RECALL: { bg: "#FFEBEE", border: "#D32F2F", icon: "🚨", textColor: "#C62828", ionColor: "danger" },
  EXPIRED: { bg: "#F5F5F5", border: "#9E9E9E", icon: "⛔", textColor: "#616161", ionColor: "medium" },
  EXPIRING_SOON: { bg: "#FFF8E1", border: "#F9A825", icon: "⚠️", textColor: "#F57F17", ionColor: "warning" },
  VALID: { bg: "#E8F5E9", border: "#388E3C", icon: "✅", textColor: "#2E7D32", ionColor: "success" },
};

const statusLabel = (status: ExpiryStatus, lang: ReturnType<typeof getLanguage>) => {
  const map: Record<ExpiryStatus, Parameters<typeof t>[0]> = {
    VALID: "statusValid",
    EXPIRING_SOON: "statusExpiringSoon",
    EXPIRED: "statusExpired",
    RECALL: "statusRecall",
  };
  return t(map[status], lang);
};

function BatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<TraceabilityResultFound | null>(null);
  const lang = getLanguage();

  useIonViewWillEnter(() => {
    async function loadBatch() {
      const stored = sessionStorage.getItem("lastScanResult");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.found && (!id || parsed.batch?.id === id)) {
            setResult(parsed);
            return;
          }
        } catch {
          // ignore
        }
      }
      if (id) {
        const lookupRes = await lookupByQR(id);
        if (lookupRes.found) {
          setResult(lookupRes);
          sessionStorage.setItem("lastScanResult", JSON.stringify(lookupRes));
        }
      }
    }
    loadBatch();
  });

  if (!result) {
    return (
      <IonPage>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tabs/camera" />
            </IonButtons>
            <IonTitle className="font-bold">{t("loading", lang)}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="flex items-center justify-center h-full text-gray-500">
            {t("productNotFound", lang)}
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const { batch, product, supplier, expiryStatus, daysLeft, coldChain, distributionTrail } = result;
  const s = STATUS_CONFIG[expiryStatus];

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="py-2 px-2">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/camera" />
          </IonButtons>
          <IonTitle className="font-bold">{t("batchInfo", lang)}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="[--background:var(--color-surface)]">
        <div className="px-4 pb-8 pt-2 flex flex-col gap-4">

          {/* ── Recall Banner ──────────────────────────────────────────── */}
          {result.isRecall && batch.recall_info && (
            <div
              className="rounded-2xl p-5 shadow-md"
              style={{ background: s.bg, borderLeft: `6px solid ${s.border}` }}
            >
              <h2 className="text-lg font-black flex items-center gap-2 mb-3" style={{ color: s.textColor }}>
                {s.icon} {t("recallBannerTitle", lang)}
              </h2>
              <div className="flex flex-col gap-1 text-sm">
                <p><strong>{t("recallNumber", lang)}:</strong> {batch.recall_info.recall_number}</p>
                <p><strong>{t("recallClass", lang)}:</strong> {batch.recall_info.class}</p>
                <p><strong>{t("recallReason", lang)}:</strong> {batch.recall_info.reason}</p>
                <p><strong>{t("recallAction", lang)}:</strong> {batch.recall_info.action_required}</p>
                <p><strong>{t("recallHotline", lang)}:</strong> {batch.recall_info.consumer_hotline}</p>
              </div>
            </div>
          )}

          {/* ── Product Header ─────────────────────────────────────────── */}
          <IonCard className="rounded-2xl shadow-sm m-0">
            <IonCardContent className="p-5">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h1 className="text-xl font-black text-gray-900 mb-1">{product.name}</h1>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    🌎 {t("countryOfOrigin", lang)}: {product.country_of_origin}
                  </p>
                </div>
                <IonBadge
                  color={s.ionColor}
                  className="px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap shadow-sm"
                >
                  {s.icon} {statusLabel(expiryStatus, lang)}
                </IonBadge>
              </div>

              {expiryStatus === "EXPIRING_SOON" && (
                <p className="text-sm mt-2 font-semibold" style={{ color: s.textColor }}>
                  ⚠️ {t("expiresIn", lang)} {daysLeft} {daysLeft !== 1 ? "days" : "day"}
                </p>
              )}
              {expiryStatus === "EXPIRED" && (
                <p className="text-sm mt-2 font-semibold" style={{ color: s.textColor }}>
                  ⛔ {t("expiredAgo", lang)} {Math.abs(daysLeft)} {Math.abs(daysLeft) !== 1 ? "days" : "day"} ago
                </p>
              )}
            </IonCardContent>
          </IonCard>

          {/* ── Supplier & Certifications ──────────────────────────────── */}
          <IonCard className="rounded-2xl shadow-sm m-0">
            <IonCardHeader className="pb-0 px-5 pt-4">
              <IonCardTitle className="text-base font-bold flex items-center gap-2">
                <IonIcon icon={businessOutline} color="primary" />
                {t("producer", lang)}
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="px-5 pb-5 pt-2">
              <p className="font-semibold text-gray-900">{supplier.name}</p>
              <p className="text-sm text-gray-500 mb-3">📍 {supplier.location.address}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                {supplier.certification.map(c => (
                  <IonChip key={c} color="success" className="text-xs font-semibold h-7">
                    <IonIcon icon={leafOutline} />
                    <IonLabel>{c}</IonLabel>
                  </IonChip>
                ))}
              </div>

              <p className="text-sm text-gray-600">
                {t("lastInspection", lang)}: {supplier.last_audit} —{" "}
                <strong style={{ color: "#388E3C" }}>{supplier.audit_result}</strong>
              </p>
            </IonCardContent>
          </IonCard>

          {/* ── Batch Info ─────────────────────────────────────────────── */}
          <IonCard className="rounded-2xl shadow-sm m-0">
            <IonCardHeader className="pb-0 px-5 pt-4">
              <IonCardTitle className="text-base font-bold flex items-center gap-2">
                <IonIcon icon={cubeOutline} color="primary" />
                {t("batchInfo", lang)}
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="px-5 pb-5 pt-2">
              <IonList lines="none" className="bg-transparent p-0">
                <IonItem className="--padding-start:0 [--background:transparent] [--inner-padding-end:0]">
                  <IonLabel>
                    <p className="text-xs text-gray-400 font-semibold uppercase">{t("batchId", lang)}</p>
                    <h3 className="font-mono font-bold text-gray-900">{batch.id}</h3>
                  </IonLabel>
                </IonItem>
                <IonItem className="[--background:transparent] [--inner-padding-end:0]">
                  <IonLabel>
                    <p className="text-xs text-gray-400 font-semibold uppercase">{t("productionDate", lang)}</p>
                    <h3 className="font-semibold text-gray-900">{batch.production_date}</h3>
                  </IonLabel>
                </IonItem>
                {batch.harvest_date && (
                  <IonItem className="[--background:transparent] [--inner-padding-end:0]">
                    <IonLabel>
                      <p className="text-xs text-gray-400 font-semibold uppercase">{t("harvestDate", lang)}</p>
                      <h3 className="font-semibold text-gray-900">{batch.harvest_date}</h3>
                    </IonLabel>
                  </IonItem>
                )}
                <IonItem className="[--background:transparent] [--inner-padding-end:0]">
                  <IonLabel>
                    <p className="text-xs text-gray-400 font-semibold uppercase">{t("bestBy", lang)}</p>
                    <h3 className="font-semibold text-gray-900">{batch.expiry_date}</h3>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* ── Quality Control ────────────────────────────────────────── */}
          {batch.qc_test && (
            <IonCard className="rounded-2xl shadow-sm m-0">
              <IonCardHeader className="pb-0 px-5 pt-4">
                <IonCardTitle className="text-base font-bold flex items-center gap-2">
                  <IonIcon icon={flaskOutline} color="primary" />
                  {t("qualityControl", lang)}
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="px-5 pb-5 pt-2">
                <p className="text-sm text-gray-700">
                  {batch.qc_test.lab}
                </p>
                <p className="text-sm mt-1">
                  Result:{" "}
                  <strong style={{ color: batch.qc_test.result === "PASS" ? "#388E3C" : "#D32F2F" }}>
                    {batch.qc_test.result}
                  </strong>
                </p>
                {batch.qc_test.certificate_no && (
                  <p className="text-sm text-gray-500 mt-1">
                    Certificate: {batch.qc_test.certificate_no}
                  </p>
                )}
              </IonCardContent>
            </IonCard>
          )}

          {/* ── Cold Chain ─────────────────────────────────────────────── */}
          {coldChain && (
            <IonCard className="rounded-2xl shadow-sm m-0">
              <IonCardHeader className="pb-0 px-5 pt-4">
                <IonCardTitle className="text-base font-bold flex items-center gap-2">
                  <IonIcon icon={snowOutline} color="primary" />
                  {t("coldChainIntegrity", lang)}
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="px-5 pb-5 pt-2">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t("readings", lang)}</span>
                    <span className="font-semibold">{coldChain.totalReadings}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t("violations", lang)}</span>
                    <span className="font-semibold">{coldChain.violationCount} ({coldChain.violationRate})</span>
                  </div>
                  {coldChain.dangerZoneHours > 0 && (
                    <p className="text-sm font-semibold" style={{ color: "#F57F17" }}>
                      ⚠️ {coldChain.dangerZoneHours}h in FDA {t("dangerZone", lang)} (40–140°F)
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <IonBadge
                      color={
                        coldChain.status === "PASS" ? "success" :
                        coldChain.status === "WARNING" ? "warning" : "danger"
                      }
                      className="px-3 py-1 rounded-lg text-xs font-bold"
                    >
                      <IonIcon
                        icon={
                          coldChain.status === "PASS" ? checkmarkCircle :
                          coldChain.status === "WARNING" ? warning : closeCircle
                        }
                        className="mr-1"
                      />
                      {coldChain.status === "PASS" ? t("coldChainPass", lang) :
                       coldChain.status === "WARNING" ? t("coldChainWarning", lang) :
                       t("coldChainFail", lang)}
                    </IonBadge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 italic">{coldChain.recommendation}</p>
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {/* ── Allergens ──────────────────────────────────────────────── */}
          {product.allergens && product.allergens.length > 0 && (
            <IonCard className="rounded-2xl shadow-sm m-0" style={{ borderLeft: "4px solid #FF6F00" }}>
              <IonCardHeader className="pb-0 px-5 pt-4">
                <IonCardTitle className="text-base font-bold flex items-center gap-2">
                  <IonIcon icon={alertCircle} color="warning" />
                  {t("containsAllergens", lang)}
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="px-5 pb-5 pt-2">
                <div className="flex flex-wrap gap-2">
                  {product.allergens.map(a => (
                    <IonChip key={a} color="warning" className="font-bold text-xs uppercase h-7">
                      <IonLabel>{a}</IonLabel>
                    </IonChip>
                  ))}
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {/* ── Distribution Trail ─────────────────────────────────────── */}
          {distributionTrail.length > 0 && (
            <IonCard className="rounded-2xl shadow-sm m-0">
              <IonCardHeader className="pb-0 px-5 pt-4">
                <IonCardTitle className="text-base font-bold flex items-center gap-2">
                  <IonIcon icon={navigateOutline} color="primary" />
                  {t("distributionTrail", lang)}
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="px-5 pb-5 pt-2">
                <IonList lines="none" className="bg-transparent p-0">
                  {distributionTrail.map((d, i) => (
                    <IonItem key={i} className="[--background:transparent] [--inner-padding-end:0] [--padding-start:0]">
                      <IonLabel>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {d.distributor?.name ?? d.dest_id}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {d.shipped_date} · {d.carrier} · {d.quantity_units} units
                          {d.distributor?.type && (
                            <IonBadge color="light" className="ml-2 text-[10px] px-2 py-0.5 rounded">
                              {d.distributor.type.replace(/_/g, " ")}
                            </IonBadge>
                          )}
                        </p>
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonCardContent>
            </IonCard>
          )}

        </div>
      </IonContent>
    </IonPage>
  );
}

export default BatchDetailPage;
