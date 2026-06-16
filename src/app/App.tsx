import { useState, useMemo } from "react";
import { Sun, Moon, Monitor, Wallet } from "lucide-react";

import { ThemeProvider, useTheme } from "./components/ThemeContext";
import { DeviceFrame, DeviceType } from "./components/DeviceFrame";
import { BottomNav, AppTab } from "./components/BottomNav";
import { ProfilePage } from "./components/ProfilePage";
import { EditMCCModal } from "./components/EditMCCModal";
import { BudgetModal } from "./components/BudgetModal";
import { MonthFilter } from "./components/MonthFilter";
import { OverviewCards } from "./components/OverviewCards";
import { SpendChart } from "./components/SpendChart";
import { CategoryBreakdown } from "./components/CategoryBreakdown";
import { TransactionList } from "./components/TransactionList";
import { BudgetOverview } from "./components/BudgetOverview";
import {
  ALL_TRANSACTIONS,
  Category,
  Budget,
  MONTHS,
  Transaction,
} from "./components/data";

// ─── inner app (needs ThemeContext) ─────────────────────────────────────────

function SpendApp({ device }: { device: DeviceType }) {
  const now = new Date(2026, 5, 12);
  const { theme, setTheme } = useTheme();

  const [tab,           setTab]           = useState<AppTab>("home");
  const [selectedYear,  setSelectedYear]  = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [txFilter,      setTxFilter]      = useState<"all" | "send" | "receive">("all");
  const [budgets,       setBudgets]       = useState<Budget[]>([]);
  const [editingTx,     setEditingTx]     = useState<Transaction | null>(null);
  const [txOverrides,   setTxOverrides]   = useState<Map<string, { category: Category; mcc: string }>>(new Map());
  const [budgetModal,   setBudgetModal]   = useState<{ open: boolean; category: Category | null }>({ open: false, category: null });

  /* ── derived data ── */
  const transactions = useMemo(() => {
    return ALL_TRANSACTIONS.map((tx) => {
      const ov = txOverrides.get(tx.id);
      return ov ? { ...tx, ...ov } : tx;
    });
  }, [txOverrides]);

  const monthPrefix = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;
  const monthTxs = useMemo(
    () => transactions.filter((t) => t.date.startsWith(monthPrefix)),
    [transactions, monthPrefix]
  );

  const prevDate   = new Date(selectedYear, selectedMonth - 2, 1);
  const prevPrefix = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;
  const prevTxs    = useMemo(
    () => transactions.filter((t) => t.date.startsWith(prevPrefix)),
    [transactions, prevPrefix]
  );

  /* ── handlers ── */
  function saveBudget(b: Budget) {
    setBudgets((p) => [...p.filter((x) => x.category !== b.category), b]);
  }
  function deleteBudget(c: Category) {
    setBudgets((p) => p.filter((x) => x.category !== c));
  }
  function applyTxOverride(id: string, category: Category, mcc: string) {
    setTxOverrides((prev) => {
      const next = new Map(prev);
      next.set(id, { category, mcc });
      return next;
    });
  }

  const editingBudget = budgetModal.category
    ? budgets.find((b) => b.category === budgetModal.category)
    : undefined;

  const monthName = MONTHS[selectedMonth - 1];
  const isMobile  = device !== "web";

  /* ── theme icon cycling ── */
  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  const nextTheme = (theme === "dark" ? "light" : theme === "light" ? "system" : "dark") as typeof theme;

  /* ── layout helpers ── */
  const px = isMobile ? "px-4" : "px-6";
  const contentMax = isMobile ? "" : "max-w-7xl mx-auto";

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">

      {/* ── header ──────────────────────────────────────── */}
      <header className="flex-shrink-0 border-b border-border bg-card/80 backdrop-blur-sm z-30">
        <div className={`flex items-center justify-between h-12 ${px} ${contentMax}`}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#7c6af7" }}>
              <Wallet size={13} className="text-white" />
            </div>
            <span className="text-sm text-foreground">SpendLens</span>
          </div>
          <div className="flex items-center gap-3">
            {!isMobile && (
              <span className="text-xs text-muted-foreground">
                {monthName} {selectedYear}
              </span>
            )}
            {/* theme toggle */}
            <button
              onClick={() => setTheme(nextTheme)}
              title={`Theme: ${theme} → ${nextTheme}`}
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              <ThemeIcon size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* ── scrollable body ──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0">

        {/* PROFILE TAB */}
        {tab === "profile" && <ProfilePage />}

        {/* BUDGET TAB */}
        {tab === "budget" && (
          <div className={`py-5 space-y-4 ${px} ${contentMax}`}>
            <div>
              <h1 className="text-foreground">Budgets</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly spending limits</p>
            </div>
            <BudgetOverview
              budgets={budgets}
              transactions={monthTxs}
              onAdd={() => setBudgetModal({ open: true, category: null })}
              onEdit={(cat) => setBudgetModal({ open: true, category: cat })}
            />
          </div>
        )}

        {/* HOME TAB */}
        {tab === "home" && (
          <div className={`py-4 space-y-4 ${px} ${contentMax}`}>

            {/* month selector + title */}
            <div className="flex flex-col gap-2">
              <div>
                <h1 className="text-foreground">Spend Analyser</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {monthName} {selectedYear} · {monthTxs.length} transactions
                </p>
              </div>
              <MonthFilter
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                onChange={(y, m) => { setSelectedYear(y); setSelectedMonth(m); }}
              />
            </div>

            {/* overview cards */}
            <OverviewCards transactions={monthTxs} prevTransactions={prevTxs} />

            {/* cash-flow chart */}
            <SpendChart
              transactions={monthTxs}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />

            {/* category breakdown + budgets side-by-side on desktop */}
            {isMobile ? (
              <>
                <CategoryBreakdown
                  transactions={monthTxs}
                  budgets={budgets}
                  onSetBudget={(cat) => setBudgetModal({ open: true, category: cat })}
                />
                <BudgetOverview
                  budgets={budgets}
                  transactions={monthTxs}
                  onAdd={() => setBudgetModal({ open: true, category: null })}
                  onEdit={(cat) => setBudgetModal({ open: true, category: cat })}
                />
              </>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <CategoryBreakdown
                    transactions={monthTxs}
                    budgets={budgets}
                    onSetBudget={(cat) => setBudgetModal({ open: true, category: cat })}
                  />
                </div>
                <BudgetOverview
                  budgets={budgets}
                  transactions={monthTxs}
                  onAdd={() => setBudgetModal({ open: true, category: null })}
                  onEdit={(cat) => setBudgetModal({ open: true, category: cat })}
                />
              </div>
            )}

            {/* transaction list */}
            <TransactionList
              transactions={monthTxs}
              filter={txFilter}
              onFilterChange={setTxFilter}
              onEditMCC={setEditingTx}
            />
          </div>
        )}
      </div>

      {/* ── bottom navigation ────────────────────────────── */}
      <BottomNav active={tab} onChange={setTab} />

      {/* ── modals ───────────────────────────────────────── */}
      {budgetModal.open && (
        <BudgetModal
          category={budgetModal.category}
          existingBudget={editingBudget}
          onSave={saveBudget}
          onDelete={deleteBudget}
          onClose={() => setBudgetModal({ open: false, category: null })}
        />
      )}
      {editingTx && (
        <EditMCCModal
          transaction={editingTx}
          onSave={applyTxOverride}
          onClose={() => setEditingTx(null)}
        />
      )}
    </div>
  );
}

// ─── root shell ─────────────────────────────────────────────────────────────

export default function App() {
  const [device, setDevice] = useState<DeviceType>("iphone");

  return (
    <div className="w-screen h-screen overflow-hidden" style={{ background: "#07080f" }}>
      <ThemeProvider>
        <DeviceFrame device={device} onDeviceChange={setDevice}>
          <SpendApp device={device} />
        </DeviceFrame>
      </ThemeProvider>
    </div>
  );
}
