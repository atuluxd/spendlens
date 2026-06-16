import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS } from "./data";

interface Props {
  selectedYear: number;
  selectedMonth: number;
  onChange: (year: number, month: number) => void;
}

export function MonthFilter({ selectedYear, selectedMonth, onChange }: Props) {
  const now = new Date(2026, 5, 12);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const months: { year: number; month: number; label: string }[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(currentYear, currentMonth - 1 - i, 1);
    months.push({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: MONTHS[d.getMonth()].slice(0, 3) + " " + d.getFullYear(),
    });
  }

  const currentIndex = months.findIndex(
    (m) => m.year === selectedYear && m.month === selectedMonth
  );

  const canGoBack = currentIndex < months.length - 1;
  const canGoForward = currentIndex > 0;

  function go(dir: -1 | 1) {
    const next = months[currentIndex - dir];
    if (next) onChange(next.year, next.month);
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => go(1)}
        disabled={!canGoBack}
        className="p-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="flex gap-1 overflow-x-auto scrollbar-none">
        {months.slice(0, 6).map((m) => {
          const isSelected = m.year === selectedYear && m.month === selectedMonth;
          return (
            <button
              key={`${m.year}-${m.month}`}
              onClick={() => onChange(m.year, m.month)}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <div className="hidden md:flex gap-1">
        {months.slice(6).map((m) => {
          const isSelected = m.year === selectedYear && m.month === selectedMonth;
          return (
            <button
              key={`${m.year}-${m.month}`}
              onClick={() => onChange(m.year, m.month)}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => go(-1)}
        disabled={!canGoForward}
        className="p-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 text-muted-foreground hover:text-foreground"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
