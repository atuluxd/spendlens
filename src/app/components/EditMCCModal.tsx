import { useState } from "react";
import { X, Tag, Search, Check } from "lucide-react";
import { Transaction, Category, CATEGORY_CONFIG } from "./data";

interface Props {
  transaction: Transaction;
  onSave: (id: string, category: Category, mcc: string) => void;
  onClose: () => void;
}

const MCC_OPTIONS: { category: Category; mcc: string; description: string }[] = [
  { category: "Food & Dining", mcc: "5812", description: "Eating Places & Restaurants" },
  { category: "Food & Dining", mcc: "5814", description: "Fast Food Restaurants" },
  { category: "Food & Dining", mcc: "5411", description: "Grocery Stores & Supermarkets" },
  { category: "Food & Dining", mcc: "5422", description: "Freezer & Meat Provisioners" },
  { category: "Travel",        mcc: "4511", description: "Airlines & Air Carriers" },
  { category: "Travel",        mcc: "4121", description: "Taxicabs & Ride-sharing" },
  { category: "Travel",        mcc: "4112", description: "Passenger Railways" },
  { category: "Travel",        mcc: "7011", description: "Hotels, Motels & Resorts" },
  { category: "Travel",        mcc: "5541", description: "Service Stations / Fuel" },
  { category: "Entertainment", mcc: "7832", description: "Motion Picture Theatres" },
  { category: "Entertainment", mcc: "7991", description: "Tourist Attractions & Exhibits" },
  { category: "Entertainment", mcc: "7993", description: "Video Game Arcades & Gaming" },
  { category: "Entertainment", mcc: "7922", description: "Theatrical Producers & Events" },
  { category: "Shopping",      mcc: "5311", description: "Department Stores" },
  { category: "Shopping",      mcc: "5941", description: "Sporting Goods Stores" },
  { category: "Shopping",      mcc: "5045", description: "Computers & Electronics" },
  { category: "Shopping",      mcc: "5691", description: "Men's & Women's Clothing" },
  { category: "Health",        mcc: "8011", description: "Doctors & Medical Clinics" },
  { category: "Health",        mcc: "5912", description: "Drug Stores & Pharmacies" },
  { category: "Health",        mcc: "8099", description: "Health & Beauty Spas" },
  { category: "Health",        mcc: "7991", description: "Gyms & Fitness Centres" },
  { category: "Utilities",     mcc: "4900", description: "Utilities – Electric, Gas, Water" },
  { category: "Utilities",     mcc: "4813", description: "Telephone & Telecom Services" },
  { category: "Utilities",     mcc: "4899", description: "Cable, Satellite & Internet" },
  { category: "Transfer",      mcc: "6012", description: "Bank Transfers" },
  { category: "Transfer",      mcc: "6540", description: "Digital Wallet / UPI" },
  { category: "Salary",        mcc: "6051", description: "Payroll / Salary Credit" },
  { category: "Freelance",     mcc: "7372", description: "Software & IT Services" },
  { category: "Freelance",     mcc: "7374", description: "Data Processing Services" },
  { category: "Rent",          mcc: "6513", description: "Real Estate & Rent" },
  { category: "Subscription",  mcc: "7995", description: "Subscriptions & SaaS" },
  { category: "Education",     mcc: "8220", description: "Colleges & Universities" },
  { category: "Education",     mcc: "8299", description: "Online Education Platforms" },
  { category: "Other",         mcc: "0000", description: "Uncategorised / Other" },
];

export function EditMCCModal({ transaction, onSave, onClose }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<Category>(transaction.category);
  const [selectedMcc, setSelectedMcc] = useState(transaction.mcc);
  const [customMcc, setCustomMcc] = useState("");
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? MCC_OPTIONS.filter(
        (c) =>
          c.category.toLowerCase().includes(search.toLowerCase()) ||
          c.mcc.includes(search) ||
          c.description.toLowerCase().includes(search.toLowerCase())
      )
    : MCC_OPTIONS;

  const currentCat = CATEGORY_CONFIG[selectedCategory];

  function handleSelect(category: Category, mcc: string) {
    setSelectedCategory(category);
    setSelectedMcc(mcc);
    setCustomMcc("");
  }

  function handleSave() {
    const finalMcc = customMcc.trim() || selectedMcc;
    onSave(transaction.id, selectedCategory, finalMcc);
    onClose();
  }

  const hasChange =
    selectedCategory !== transaction.category ||
    (customMcc.trim() || selectedMcc) !== transaction.mcc;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl flex flex-col max-h-[92vh]">

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: currentCat?.bg }}
            >
              {currentCat?.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-foreground truncate">{transaction.merchant}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Edit category & MCC tag</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors flex-shrink-0 ml-2"
          >
            <X size={16} />
          </button>
        </div>

        {/* Current state pill */}
        <div className="px-5 pt-4 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2.5">
            <Tag size={13} className="text-primary flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Current:</span>
            <span
              className="text-xs px-2 py-0.5 rounded-md"
              style={{ background: CATEGORY_CONFIG[transaction.category]?.bg, color: CATEGORY_CONFIG[transaction.category]?.color }}
            >
              {transaction.category}
            </span>
            <span className="text-xs text-muted-foreground">· MCC</span>
            <span className="text-xs text-foreground tabular-nums">{transaction.mcc}</span>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2 bg-secondary border border-border rounded-xl px-3 py-2">
            <Search size={13} className="text-muted-foreground flex-shrink-0" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category or MCC code…"
              className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none min-w-0"
            />
          </div>
        </div>

        {/* Options list */}
        <div className="overflow-y-auto flex-1 px-5 pb-2 space-y-0.5 min-h-0">
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground text-xs py-6">No matches found</p>
          )}
          {filtered.map((item, i) => {
            const isSelected = selectedCategory === item.category && selectedMcc === item.mcc;
            const cfg = CATEGORY_CONFIG[item.category];
            return (
              <button
                key={`${item.mcc}-${i}`}
                onClick={() => handleSelect(item.category, item.mcc)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all border ${
                  isSelected
                    ? "border-primary/40 bg-primary/10"
                    : "border-transparent hover:bg-secondary"
                }`}
              >
                <span className="text-base flex-shrink-0">{cfg?.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground truncate">{item.description}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="text-xs tabular-nums px-2 py-0.5 rounded"
                    style={{ background: cfg?.bg, color: cfg?.color }}
                  >
                    {item.mcc}
                  </span>
                  {isSelected && <Check size={13} className="text-primary" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom MCC input */}
        <div className="px-5 pt-3 pb-2 border-t border-border flex-shrink-0">
          <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-2">
            Custom MCC override (4 digits)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={customMcc}
            onChange={(e) => setCustomMcc(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="e.g. 5999"
            maxLength={4}
            className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors tabular-nums"
          />
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 px-5 py-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-secondary text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChange}
            className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Apply Tag
          </button>
        </div>
      </div>
    </div>
  );
}
