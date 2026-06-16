import { useState, useEffect } from "react";
import { X, Target } from "lucide-react";
import { Category, CATEGORY_CONFIG, Budget } from "./data";

interface Props {
  category: Category | null;
  existingBudget?: Budget;
  onSave: (budget: Budget) => void;
  onDelete: (category: Category) => void;
  onClose: () => void;
}

const ALL_CATEGORIES: Category[] = [
  "Food & Dining", "Travel", "Entertainment", "Shopping",
  "Health", "Utilities", "Transfer", "Rent", "Subscription", "Education", "Other",
];

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function BudgetModal({ category, existingBudget, onSave, onDelete, onClose }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    category ?? "Food & Dining"
  );
  const [amount, setAmount] = useState(existingBudget?.limit.toString() ?? "");

  useEffect(() => {
    if (category) setSelectedCategory(category);
    if (existingBudget) setAmount(existingBudget.limit.toString());
    else setAmount("");
  }, [category, existingBudget]);

  function handleSave() {
    const num = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(num) || num <= 0) return;
    onSave({ category: selectedCategory, limit: num });
    onClose();
  }

  const cat = CATEGORY_CONFIG[selectedCategory];

  const presets = [5000, 10000, 15000, 20000, 30000, 50000];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: cat?.bg }}
            >
              {cat?.icon}
            </div>
            <div>
              <h2 className="text-foreground">Set Budget</h2>
              <p className="text-xs text-muted-foreground">Monthly spending limit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!category && (
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ALL_CATEGORIES.map((cat) => {
                  const cfg = CATEGORY_CONFIG[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center gap-1.5 px-2 py-2 rounded-lg text-xs transition-all border ${
                        selectedCategory === cat
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-white/20"
                      }`}
                    >
                      <span>{cfg?.icon}</span>
                      <span className="truncate">{cat.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">
              Monthly Limit (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
            />
            <div className="flex gap-2 mt-3 flex-wrap">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setAmount(p.toString())}
                  className="px-2.5 py-1 bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground rounded-lg text-xs transition-colors border border-border"
                >
                  {fmt(p)}
                </button>
              ))}
            </div>
          </div>

          {amount && !isNaN(parseFloat(amount)) && (
            <div className="bg-secondary rounded-xl p-4 flex items-center gap-3">
              <Target size={16} className="text-primary flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                Daily budget:{" "}
                <span className="text-foreground">
                  {fmt(parseFloat(amount) / 30)}
                </span>{" "}
                per day for {selectedCategory}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 pt-0">
          {existingBudget && (
            <button
              onClick={() => { onDelete(selectedCategory); onClose(); }}
              className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm transition-colors"
            >
              Remove
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-secondary text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
            className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
          >
            Save Budget
          </button>
        </div>
      </div>
    </div>
  );
}
