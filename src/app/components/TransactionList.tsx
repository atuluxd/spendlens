import { ArrowDownLeft, ArrowUpRight, Pencil } from "lucide-react";
import { Transaction, CATEGORY_CONFIG } from "./data";

interface Props {
  transactions: Transaction[];
  filter: "all" | "send" | "receive";
  onFilterChange: (f: "all" | "send" | "receive") => void;
  onEditMCC?: (tx: Transaction) => void;
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function groupByDate(transactions: Transaction[]) {
  const groups = new Map<string, Transaction[]>();
  transactions.forEach((t) => {
    const g = groups.get(t.date) ?? [];
    g.push(t);
    groups.set(t.date, g);
  });
  return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
}

export function TransactionList({ transactions, filter, onFilterChange, onEditMCC }: Props) {
  const filtered =
    filter === "all" ? transactions : transactions.filter((t) => t.type === filter);

  const grouped = groupByDate(filtered);

  const tabs: { key: "all" | "send" | "receive"; label: string }[] = [
    { key: "all",     label: "All"      },
    { key: "receive", label: "Received" },
    { key: "send",    label: "Sent"     },
  ];

  return (
    <div className="bg-card rounded-xl border border-border flex flex-col">
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
        <h3 className="text-foreground">Transactions</h3>
        <div className="flex items-center bg-secondary rounded-lg p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onFilterChange(tab.key)}
              className={`px-3 py-1 rounded-md text-xs transition-all ${
                filter === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-y-auto max-h-[420px] px-5 pb-5">
        {grouped.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No transactions found
          </div>
        )}
        {grouped.map(([date, txs]) => (
          <div key={date}>
            <div className="sticky top-0 bg-card py-2 text-xs text-muted-foreground border-b border-border/50 mt-4 first:mt-2">
              {formatDate(date)}
            </div>
            <div className="space-y-0.5 mt-2">
              {txs.map((tx) => {
                const cat = CATEGORY_CONFIG[tx.category];
                return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/50 transition-colors group"
                  >
                    {/* Category icon */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                      style={{ background: cat?.bg ?? "#6b728022" }}
                    >
                      {cat?.icon ?? "📦"}
                    </div>

                    {/* Merchant + tag */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{tx.merchant}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        {/* Editable category badge */}
                        {onEditMCC ? (
                          <button
                            onClick={() => onEditMCC(tx)}
                            title="Edit category / MCC"
                            className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded transition-all hover:ring-1 ring-primary/50 active:scale-95"
                            style={{ background: cat?.bg, color: cat?.color }}
                          >
                            {tx.category}
                            <Pencil size={8} strokeWidth={2.5} className="opacity-50 group-hover:opacity-100" />
                          </button>
                        ) : (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{ background: cat?.bg, color: cat?.color }}
                          >
                            {tx.category}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground tabular-nums">
                          MCC {tx.mcc}
                        </span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {tx.type === "receive" ? (
                        <ArrowDownLeft size={13} style={{ color: "#22d3a0" }} />
                      ) : (
                        <ArrowUpRight size={13} style={{ color: "#ef4444" }} />
                      )}
                      <span
                        className="text-sm tabular-nums"
                        style={{ color: tx.type === "receive" ? "#22d3a0" : "#ef4444" }}
                      >
                        {tx.type === "receive" ? "+" : "-"}{fmt(tx.amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
