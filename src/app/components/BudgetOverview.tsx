import { Target, Plus } from "lucide-react";
import { Budget, Category, CATEGORY_CONFIG, Transaction } from "./data";

interface Props {
  budgets: Budget[];
  transactions: Transaction[];
  onAdd: () => void;
  onEdit: (category: Category) => void;
}

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

export function BudgetOverview({ budgets, transactions, onAdd, onEdit }: Props) {
  const spendByCategory = new Map<Category, number>();
  transactions
    .filter((t) => t.type === "send")
    .forEach((t) => {
      spendByCategory.set(t.category, (spendByCategory.get(t.category) ?? 0) + t.amount);
    });

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-primary" />
          <h3 className="text-foreground">Budgets</h3>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs transition-colors"
        >
          <Plus size={12} />
          Add
        </button>
      </div>

      {budgets.length === 0 ? (
        <button
          onClick={onAdd}
          className="w-full py-8 border border-dashed border-border rounded-xl text-muted-foreground text-sm hover:border-primary/50 hover:text-primary transition-colors flex flex-col items-center gap-2"
        >
          <Target size={20} />
          <span>Set your first budget</span>
        </button>
      ) : (
        <div className="space-y-3">
          {budgets.map((budget) => {
            const spent = spendByCategory.get(budget.category) ?? 0;
            const pct = Math.min((spent / budget.limit) * 100, 100);
            const isOver = spent > budget.limit;
            const cat = CATEGORY_CONFIG[budget.category];

            return (
              <button
                key={budget.category}
                onClick={() => onEdit(budget.category)}
                className="w-full text-left group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm">{cat?.icon}</span>
                  <span className="text-xs text-foreground flex-1 truncate">{budget.category}</span>
                  <span className={`text-xs tabular-nums ${isOver ? "text-red-400" : "text-muted-foreground"}`}>
                    {fmt(spent)} / {fmt(budget.limit)}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: isOver ? "#ef4444" : pct > 80 ? "#f59e0b" : "#22d3a0",
                    }}
                  />
                </div>
                <p className={`text-xs mt-1 ${isOver ? "text-red-400" : "text-muted-foreground"}`}>
                  {isOver
                    ? `Over by ${fmt(spent - budget.limit)}`
                    : `${fmt(budget.limit - spent)} remaining`}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
