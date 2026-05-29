import "../theme/HistorySection.css";

type HistorySectionProps = {
  title: string;
};

function HistorySection({ title }: HistorySectionProps) {
  return (
    <section className="history-section">
      <div className="history-header">
        <h2>{title}</h2>
        <button className="view-all-button">VIEW ALL</button>
      </div>

      <div className="history-content">
        {/* Ici mon pourra mettre les photos des produits qu'on veut */}
      </div>
    </section>
  );
}

export default HistorySection;