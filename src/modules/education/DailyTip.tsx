import type { DailyTip as DailyTipType } from "../../types/education";

type DailyTipProps = {
  tip: DailyTipType;
  title: string;
};

function DailyTip({ tip, title }: DailyTipProps) {
  return (
    <section className="relative flex h-full flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#159947] via-[#128740] to-[#0e6e35] p-5 text-white shadow-sm">
      {/* Decorative background circles */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/[0.06]" />
      <div className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/[0.04]" />

      <div className="relative z-10">
        <div className="mb-3">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest backdrop-blur-sm">
            {title}
          </span>
        </div>
        <p className="text-[15px] font-medium leading-relaxed opacity-95">
          {tip.icon} {tip.text}
        </p>
      </div>
    </section>
  );
}

export default DailyTip;
