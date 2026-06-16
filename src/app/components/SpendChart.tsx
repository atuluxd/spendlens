import {
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Transaction, MONTHS } from "./data";

interface Props {
  transactions: Transaction[];
  selectedYear: number;
  selectedMonth: number;
}

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 text-xs shadow-xl">
      <p className="text-muted-foreground mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={`${p.name}-${i}`} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="text-foreground tabular-nums">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function SpendChart({ transactions, selectedYear, selectedMonth }: Props) {
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const prefix = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;

  const data = Array.from({ length: Math.ceil(daysInMonth / 3) }, (_, i) => {
    const startDay = i * 3 + 1;
    const endDay = Math.min(startDay + 2, daysInMonth);
    const dayTxs = transactions.filter((t) => {
      const day = parseInt(t.date.split("-")[2], 10);
      return t.date.startsWith(prefix) && day >= startDay && day <= endDay;
    });
    return {
      label: `${startDay}–${endDay}`,
      Received: dayTxs.filter((t) => t.type === "receive").reduce((s, t) => s + t.amount, 0),
      Spent: dayTxs.filter((t) => t.type === "send").reduce((s, t) => s + t.amount, 0),
    };
  });

  const monthName = MONTHS[selectedMonth - 1];

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-foreground">Cash Flow</h3>
          <p className="text-muted-foreground text-xs mt-0.5">
            {monthName} {selectedYear} · 3-day buckets
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#22d3a0" }} />
            <span className="text-muted-foreground">Received</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />
            <span className="text-muted-foreground">Spent</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} barGap={4} barSize={16}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(128,128,128,0.1)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "#8b8fa8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#8b8fa8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={fmt}
            width={52}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(128,128,128,0.06)" }}
          />
          <Bar dataKey="Received" fill="#22d3a0" radius={[4, 4, 0, 0]} maxBarSize={20} />
          <Bar dataKey="Spent" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={20} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
