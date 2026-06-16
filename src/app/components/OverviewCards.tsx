import { ArrowDownLeft, ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import { Transaction } from "./data";

interface Props {
  transactions: Transaction[];
  prevTransactions: Transaction[];
}

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

function pct(curr: number, prev: number) {
  if (prev === 0) return null;
  return (((curr - prev) / prev) * 100).toFixed(1);
}

export function OverviewCards({ transactions, prevTransactions }: Props) {
  const totalIn  = transactions.filter((t) => t.type === "receive").reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter((t) => t.type === "send").reduce((s, t) => s + t.amount, 0);
  const net      = totalIn - totalOut;

  const prevIn  = prevTransactions.filter((t) => t.type === "receive").reduce((s, t) => s + t.amount, 0);
  const prevOut = prevTransactions.filter((t) => t.type === "send").reduce((s, t) => s + t.amount, 0);

  const inPct  = pct(totalIn,  prevIn);
  const outPct = pct(totalOut, prevOut);

  const cards = [
    {
      label:    "Money In",
      value:    fmt(totalIn),
      Icon:     ArrowDownLeft,
      color:    "#22d3a0",
      bg:       "rgba(34,211,160,0.12)",
      change:   inPct,
      positive: true,
      prefix:   "",
    },
    {
      label:    "Money Out",
      value:    fmt(totalOut),
      Icon:     ArrowUpRight,
      color:    "#ef4444",
      bg:       "rgba(239,68,68,0.12)",
      change:   outPct,
      positive: false,
      prefix:   "",
    },
    {
      label:    "Net Balance",
      value:    fmt(Math.abs(net)),
      Icon:     net >= 0 ? TrendingUp : TrendingDown,
      color:    net >= 0 ? "#22d3a0" : "#ef4444",
      bg:       net >= 0 ? "rgba(34,211,160,0.12)" : "rgba(239,68,68,0.12)",
      change:   null,
      positive: net >= 0,
      prefix:   net >= 0 ? "+" : "-",
    },
  ];

  return (
    /* Horizontal scroll on very small viewports; equal columns on wider ones */
    <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-none">
      {cards.map((card) => {
        const { Icon } = card;
        return (
          <div
            key={card.label}
            className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2 snap-start flex-shrink-0"
            /*
              min-w so the card never collapses below readable width,
              flex-1 so all three share available space when there's room.
            */
            style={{ minWidth: 130, flex: "1 0 130px" }}
          >
            {/* Icon + label row */}
            <div className="flex items-center justify-between gap-1 min-w-0">
              <span className="text-muted-foreground text-xs uppercase tracking-widest truncate">
                {card.label}
              </span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: card.bg }}
              >
                <Icon size={14} style={{ color: card.color }} />
              </div>
            </div>

            {/* Amount — shrinks font if needed but never overflows */}
            <p
              className="text-foreground tabular-nums leading-tight font-medium"
              style={{
                fontSize: "clamp(0.85rem, 2.5vw, 1.25rem)",
                wordBreak: "break-all",
              }}
            >
              {card.prefix}{card.value}
            </p>

            {/* Change vs last month */}
            {card.change !== null ? (
              <p className="text-xs truncate" style={{ color: card.positive ? "#22d3a0" : "#ef4444" }}>
                {parseFloat(card.change!) > 0 ? "+" : ""}{card.change}% vs last mo.
              </p>
            ) : (
              <p className="text-xs truncate" style={{ color: card.color }}>
                {card.positive ? "Surplus" : "Deficit"}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
