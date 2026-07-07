import type { DailyTip as DailyTipType } from "../../types/education";

type DailyTipProps = {
  tip: DailyTipType;
  title: string;
};

function DailyTip({ tip, title }: DailyTipProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#159947] via-[#128740] to-[#0e6e35] px-5 py-5 text-white shadow-md">
      {/* Decorative background circles */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/[0.06]" />
      <div className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/[0.04]" />

      <div className="relative z-10">
        <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest backdrop-blur-sm">
          {title}
        </span>
        <p className="mt-3 text-[15px] font-semibold leading-relaxed opacity-95">
          {tip.icon} {tip.text}
        </p>
      </div>
    </section>
  );
}

export default DailyTip;
