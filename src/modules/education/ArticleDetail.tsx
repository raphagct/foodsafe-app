import {
  IonBadge,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import {
  arrowBackOutline,
  bookOutline,
  checkmarkCircleOutline,
  timeOutline,
} from "ionicons/icons";
import type { EducationArticle, EducationContentBlock } from "../../types/education";

type ArticleDetailLabels = {
  minRead: string;
  markComplete: string;
  completed: string;
  bookmark: string;
  bookmarked: string;
  articleType: string;
  close: string;
};

type ArticleDetailProps = {
  article: EducationArticle;
  categoryName?: string;
  labels: ArticleDetailLabels;
  isCompleted: boolean;
  onMarkComplete: (articleId: string) => void;
  onBack: () => void;
};

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function renderBlock(block: EducationContentBlock, index: number) {
  switch (block.type) {
    case "paragraph":
      return <p key={index} className="text-[15px] leading-relaxed text-gray-800">{block.text}</p>;

    case "heading":
      return <h3 key={index} className="mt-6 text-xl font-extrabold text-gray-950">{block.text}</h3>;

    case "list":
      return (
        <ul key={index} className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-gray-800">
          {(block.items ?? []).map((item, itemIndex) => (
            <li key={itemIndex}>{asString(item)}</li>
          ))}
        </ul>
      );

    case "steps":
      return (
        <ol key={index} className="list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-gray-800">
          {(block.steps ?? []).map((step, stepIndex) => (
            <li key={stepIndex}>{step}</li>
          ))}
        </ol>
      );

    case "stat_box":
      return (
        <div key={index} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(block.stats ?? []).map((stat, statIndex) => {
            const item = asRecord(stat);
            return (
              <div key={statIndex} className="rounded-xl border border-gray-100 bg-white px-3 py-3 shadow-sm">
                <strong className="block text-xl font-black text-[var(--color-primary)]">
                  {asString(item.value)}
                </strong>
                <span className="mt-1 block text-[12px] font-semibold leading-snug text-gray-500">
                  {asString(item.label)}
                </span>
              </div>
            );
          })}
        </div>
      );

    case "card_list":
    case "certification_cards":
      return (
        <div key={index} className="grid gap-3">
          {(block.cards ?? []).map((card, cardIndex) => {
            const item = asRecord(card);
            const points = Array.isArray(item.points) ? item.points : [];
            return (
              <div key={cardIndex} className="rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
                <h4 className="text-[16px] font-extrabold text-gray-950">
                  {asString(item.icon)} {asString(item.title) || asString(item.name)}
                </h4>
                {item.full_name ? <p className="mt-1 text-sm font-semibold text-gray-500">{asString(item.full_name)}</p> : null}
                {item.means ? <p className="mt-2 text-[15px] leading-relaxed text-gray-700">{asString(item.means)}</p> : null}
                {points.length > 0 ? (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-gray-700">
                    {points.map((point, pointIndex) => (
                      <li key={pointIndex}>{asString(point)}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </div>
      );

    case "alert_box":
    case "warning_box":
    case "key_takeaway":
    case "key_fact":
    case "rule":
      return (
        <div
          key={index}
          className={`rounded-xl border-l-4 bg-white px-4 py-4 shadow-sm ${
            block.type === "alert_box" || block.type === "warning_box" || block.severity === "danger"
              ? "border-l-red-600"
              : "border-l-[var(--color-primary)]"
          }`}
        >
          <strong className="text-[15px] font-extrabold text-gray-950">
            {block.title ?? (block.type === "rule" ? "Rule" : "Key point")}
          </strong>
          <p className="mt-2 text-[15px] leading-relaxed text-gray-800">{block.text ?? block.description}</p>
        </div>
      );

    case "tip_box":
      return (
        <div key={index} className="rounded-xl border-l-4 border-l-blue-600 bg-white px-4 py-4 shadow-sm">
          {(block.tips ?? []).map((tip, tipIndex) => (
            <p key={tipIndex} className="text-[15px] leading-relaxed text-gray-800">{tip}</p>
          ))}
        </div>
      );

    case "symptoms_table":
    case "refrigerator_storage_chart":
      return (
        <div key={index} className="overflow-x-auto rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
          {block.title ? <h4 className="mb-3 text-[16px] font-extrabold text-gray-950">{block.title}</h4> : null}
          <table className="min-w-[620px] border-collapse text-left">
            {block.columns ? (
              <thead>
                <tr>
                  {block.columns.map((column) => (
                    <th key={column} className="border-b border-gray-100 px-3 py-2 text-[12px] font-black uppercase text-gray-500">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody>
              {(block.rows ?? []).map((row, rowIndex) => {
                const cells = Array.isArray(row) ? row : Object.values(asRecord(row));
                return (
                  <tr key={rowIndex}>
                    {cells.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border-b border-gray-100 px-3 py-2 align-top text-[13px] leading-relaxed text-gray-700">
                        {asString(cell)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );

    case "checklist":
    case "allergen_list":
    case "date_label_explainer":
      return (
        <div key={index} className="grid gap-3 rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
          {block.title ? <h4 className="text-[16px] font-extrabold text-gray-950">{block.title}</h4> : null}
          {(block.items ?? []).map((entry, entryIndex) => {
            const item = asRecord(entry);
            return (
              <div key={entryIndex} className="border-t border-gray-100 pt-3 first:border-t-0 first:pt-0">
                <strong className="block text-[15px] font-extrabold text-gray-950">
                  {asString(item.icon)} {asString(item.label) || asString(item.name)}
                </strong>
                <span className="mt-1 block text-[14px] leading-relaxed text-gray-600">
                  {asString(item.note) || asString(item.meaning) || asString(item.sources)}
                </span>
                {item.action ? <em className="mt-1 block text-[13px] font-semibold text-gray-500">{asString(item.action)}</em> : null}
              </div>
            );
          })}
        </div>
      );

    case "infographic_data":
      return (
        <div key={index} className="grid gap-2">
          {(block.zones ?? []).map((zone, zoneIndex) => {
            const item = asRecord(zone);
            const degree = "\u00b0";
            const tempF = asString(item.temp_f);
            const tempC = asString(item.temp_c);
            const tempLabel = tempF
              ? `${tempF} ${degree}F / ${tempC} ${degree}C`
              : `${tempC} ${degree}C`;
            return (
              <div
                key={zoneIndex}
                className="rounded-xl border-l-[7px] bg-white px-4 py-3 shadow-sm"
                style={{ borderColor: asString(item.color) || "var(--color-primary)" }}
              >
                <strong className="block text-[15px] font-black text-gray-950">
                  {tempLabel}
                </strong>
                <span className="mt-1 block text-[14px] font-semibold text-gray-600">{asString(item.label)}</span>
              </div>
            );
          })}
        </div>
      );

    case "faq":
      return (
        <div key={index} className="grid gap-2">
          {(block.items ?? []).map((entry, entryIndex) => {
            const item = asRecord(entry);
            return (
              <details key={entryIndex} className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                <summary className="cursor-pointer text-[15px] font-extrabold text-gray-950">
                  {asString(item.question)}
                </summary>
                <p className="mt-2 text-[14px] leading-relaxed text-gray-700">{asString(item.answer)}</p>
              </details>
            );
          })}
        </div>
      );

    case "methods_list":
      return (
        <div key={index} className="grid gap-3">
          {(block.methods ?? []).map((method, methodIndex) => {
            const item = asRecord(method);
            return (
              <div key={methodIndex} className="rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
                <h4 className="text-[16px] font-extrabold text-gray-950">{asString(item.icon)} {asString(item.name)}</h4>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-700">{asString(item.description)}</p>
                <IonBadge color="success" className="mt-3 rounded-[6px] px-2 py-1">{asString(item.rating)}</IonBadge>
              </div>
            );
          })}
        </div>
      );

    case "cooling_techniques":
      return (
        <ul key={index} className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-gray-800">
          {(block.techniques ?? []).map((technique, techniqueIndex) => (
            <li key={techniqueIndex}>{technique}</li>
          ))}
        </ul>
      );

    default:
      return block.text ? <p key={index} className="text-[15px] leading-relaxed text-gray-800">{block.text}</p> : null;
  }
}

function ArticleDetail({
  article,
  categoryName,
  labels,
  isCompleted,
  onMarkComplete,
  onBack,
}: ArticleDetailProps) {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <div className="flex items-center gap-1 px-2 py-2">
            <IonButton fill="clear" onClick={onBack} aria-label="Back" className="[--border-radius:6px]">
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
            <span className="text-sm font-bold text-gray-500">{categoryName}</span>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="[--background:var(--color-surface)]">
        <article className="mx-auto flex max-w-[980px] flex-col gap-4 px-[18px] py-5">
          <div>
            <h2 className="text-[26px] font-black leading-tight text-gray-950">{article.title}</h2>
            <p className="mt-2 text-[15px] font-medium leading-relaxed text-gray-600">{article.summary}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] font-bold text-gray-500">
              <span className="inline-flex items-center gap-1">
                <IonIcon icon={timeOutline} /> {article.read_time_min} {labels.minRead}
              </span>
              <span className="inline-flex items-center gap-1 capitalize">
                <IonIcon icon={bookOutline} /> {article.difficulty}
              </span>
            </div>
          </div>

          {article.content_blocks.map(renderBlock)}

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <IonButton onClick={() => onMarkComplete(article.id)} className="font-bold [--border-radius:6px]">
              <IonIcon icon={checkmarkCircleOutline} slot="start" />
              {isCompleted ? labels.completed : labels.markComplete}
            </IonButton>
            <IonButton onClick={onBack} className="ml-auto font-bold [--border-radius:6px]">
              {labels.close}
            </IonButton>
          </div>
        </article>
      </IonContent>
    </IonPage>
  );
}

export default ArticleDetail;
