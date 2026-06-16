import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Transaction, Category, CATEGORY_CONFIG, Budget } from "./data";
import { AlertTriangle } from "lucide-react";

interface Props {
  transactions: Transaction[];
  budgets: Budget[];
  onSetBudget: (category: Category) => void;
}

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-xl p-3 text-xs shadow-xl">
      <p className="text-foreground">{d.category}</p>
      <p className="text-muted-foreground mt-1">{fmt(d.amount)} · {d.pct}%</p>
    </div>
  );
};

export function CategoryBreakdown({ transactions, budgets, onSetBudget }: Props) {
  const spendByCategory = new Map<Category, number>();
  transactions
    .filter((t) => t.type === "send")
    .forEach((t) => {
      spendByCategory.set(t.category, (spendByCategory.get(t.category) ?? 0) + t.amount);
    });

  const total = Array.from(spendByCategory.values()).reduce((s, v) => s + v, 0);

  const data = Array.from(spendByCategory.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => ({
      category,
      amount,
      pct: total > 0 ? ((amount / total) * 100).toFixed(1) : "0",
      color: CATEGORY_CONFIG[category]?.color ?? "#6b7280",
      icon: CATEGORY_CONFIG[category]?.icon ?? "📦",
      mcc: CATEGORY_CONFIG[category]?.mcc ?? "0000",
    }));

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-foreground">Spend by Category</h3>
          <p className="text-muted-foreground text-xs mt-0.5">Click a category to set budget</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">No spending this month</div>
      ) : (
        <div className="flex gap-6 items-center">
          <div className="flex-shrink-0">
            <PieChart width={160} height={160}>
              <Pie
                data={data}
                cx={80}
                cy={80}
                innerRadius={48}
                outerRadius={72}
                paddingAngle={2}
                dataKey="amount"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.category}-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </div>

          <div className="flex-1 space-y-2 min-w-0">
            {data.map((d) => {
              const budget = budgets.find((b) => b.category === d.category);
              const isOverBudget = budget && d.amount > budget.limit;
              const budgetPct = budget ? Math.min((d.amount / budget.limit) * 100, 100) : 0;

              return (
                <button
                  key={d.category}
                  onClick={() => onSetBudget(d.category)}
                  className="w-full text-left group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{d.icon}</span>
                    <span className="text-xs text-foreground flex-1 truncate">{d.category}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">MCC {d.mcc}</span>
                    <span className="text-xs tabular-nums" style={{ color: d.color }}>
                      {fmt(d.amount)}
                    </span>
                    {isOverBudget && (
                      <AlertTriangle size={12} className="text-yellow-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${d.pct}%`,
                        background: d.color,
                        opacity: 0.8,
                      }}
                    />
                  </div>
                  {budget && (
                    <div className="flex justify-between mt-0.5">
                      <div className="h-1 bg-accent rounded-full overflow-hidden w-full">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${budgetPct}%`,
                            background: isOverBudget ? "#ef4444" : "#22d3a0",
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {budget && (
                    <p className={`text-xs mt-0.5 ${isOverBudget ? "text-red-400" : "text-muted-foreground"}`}>
                      {isOverBudget ? "Over budget · " : ""}Budget: {fmt(budget.limit)}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
