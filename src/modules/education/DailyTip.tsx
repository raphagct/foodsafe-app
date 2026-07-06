import type { DailyTip as DailyTipType } from "../../types/education";

type DailyTipProps = {
  tip: DailyTipType;
  title: string;
};

function DailyTip({ tip, title }: DailyTipProps) {
  return (
    <section className="rounded-xl bg-[var(--color-primary)] px-4 py-4 text-white shadow-sm">
      <span className="block text-[12px] font-extrabold uppercase tracking-wide opacity-90">
        {title}
      </span>
      <p className="mt-2 text-[15px] font-semibold leading-relaxed">
        {tip.icon} {tip.text}
      </p>
    </section>
  );
}

export default DailyTip;
