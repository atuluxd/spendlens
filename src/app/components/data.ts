export type TransactionType = "send" | "receive";

export type Category =
  | "Food & Dining"
  | "Travel"
  | "Entertainment"
  | "Shopping"
  | "Health"
  | "Utilities"
  | "Transfer"
  | "Salary"
  | "Freelance"
  | "Rent"
  | "Subscription"
  | "Education"
  | "Other";

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: Category;
  type: TransactionType;
  amount: number;
  mcc: string;
  note?: string;
}

export const CATEGORY_CONFIG: Record<
  Category,
  { color: string; bg: string; icon: string; mcc: string }
> = {
  "Food & Dining": { color: "#f59e0b", bg: "#f59e0b22", icon: "🍔", mcc: "5812" },
  Travel: { color: "#60a5fa", bg: "#60a5fa22", icon: "✈️", mcc: "4511" },
  Entertainment: { color: "#a78bfa", bg: "#a78bfa22", icon: "🎬", mcc: "7832" },
  Shopping: { color: "#f472b6", bg: "#f47b6622", icon: "🛍️", mcc: "5311" },
  Health: { color: "#34d399", bg: "#34d39922", icon: "🏥", mcc: "8011" },
  Utilities: { color: "#94a3b8", bg: "#94a3b822", icon: "💡", mcc: "4900" },
  Transfer: { color: "#fb923c", bg: "#fb923c22", icon: "↔️", mcc: "6012" },
  Salary: { color: "#22d3a0", bg: "#22d3a022", icon: "💼", mcc: "6051" },
  Freelance: { color: "#22d3a0", bg: "#22d3a022", icon: "💻", mcc: "7372" },
  Rent: { color: "#e879f9", bg: "#e879f922", icon: "🏠", mcc: "6513" },
  Subscription: { color: "#7c6af7", bg: "#7c6af722", icon: "🔁", mcc: "7995" },
  Education: { color: "#38bdf8", bg: "#38bdf822", icon: "📚", mcc: "8220" },
  Other: { color: "#6b7280", bg: "#6b728022", icon: "📦", mcc: "0000" },
};

function makeDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const baseTransactions: Omit<Transaction, "id" | "date">[] = [
  { merchant: "Swiggy", category: "Food & Dining", type: "send", amount: 340, mcc: "5812" },
  { merchant: "Zomato", category: "Food & Dining", type: "send", amount: 520, mcc: "5812" },
  { merchant: "Starbucks", category: "Food & Dining", type: "send", amount: 480, mcc: "5812" },
  { merchant: "Uber Eats", category: "Food & Dining", type: "send", amount: 290, mcc: "5812" },
  { merchant: "IndiGo Airlines", category: "Travel", type: "send", amount: 4500, mcc: "4511" },
  { merchant: "Ola Cabs", category: "Travel", type: "send", amount: 320, mcc: "4121" },
  { merchant: "Uber", category: "Travel", type: "send", amount: 250, mcc: "4121" },
  { merchant: "MakeMyTrip", category: "Travel", type: "send", amount: 6200, mcc: "4511" },
  { merchant: "BookMyShow", category: "Entertainment", type: "send", amount: 650, mcc: "7832" },
  { merchant: "Netflix", category: "Subscription", type: "send", amount: 649, mcc: "7995" },
  { merchant: "Spotify", category: "Subscription", type: "send", amount: 119, mcc: "7995" },
  { merchant: "Amazon Prime", category: "Subscription", type: "send", amount: 299, mcc: "7995" },
  { merchant: "Amazon India", category: "Shopping", type: "send", amount: 2300, mcc: "5311" },
  { merchant: "Flipkart", category: "Shopping", type: "send", amount: 1800, mcc: "5311" },
  { merchant: "Apollo Pharmacy", category: "Health", type: "send", amount: 450, mcc: "8011" },
  { merchant: "BESCOM", category: "Utilities", type: "send", amount: 1200, mcc: "4900" },
  { merchant: "Airtel", category: "Utilities", type: "send", amount: 599, mcc: "4813" },
  { merchant: "Landlord Rent", category: "Rent", type: "send", amount: 18000, mcc: "6513" },
  { merchant: "Udemy Course", category: "Education", type: "send", amount: 499, mcc: "8220" },
  { merchant: "Google One", category: "Subscription", type: "send", amount: 130, mcc: "7995" },
  { merchant: "Acme Corp Salary", category: "Salary", type: "receive", amount: 85000, mcc: "6051" },
  { merchant: "Freelance - Design", category: "Freelance", type: "receive", amount: 15000, mcc: "7372" },
  { merchant: "Rahul Kumar", category: "Transfer", type: "receive", amount: 2000, mcc: "6012" },
  { merchant: "Priya Sharma", category: "Transfer", type: "send", amount: 3500, mcc: "6012" },
  { merchant: "Dividend Credit", category: "Other", type: "receive", amount: 1200, mcc: "6199" },
  { merchant: "Cafe Coffee Day", category: "Food & Dining", type: "send", amount: 220, mcc: "5812" },
  { merchant: "Domino's", category: "Food & Dining", type: "send", amount: 400, mcc: "5812" },
  { merchant: "IRCTC", category: "Travel", type: "send", amount: 1200, mcc: "4112" },
  { merchant: "PVR Cinemas", category: "Entertainment", type: "send", amount: 550, mcc: "7832" },
  { merchant: "Decathlon", category: "Shopping", type: "send", amount: 3200, mcc: "5941" },
  { merchant: "Cult.fit", category: "Health", type: "send", amount: 1499, mcc: "7991" },
  { merchant: "Jio Fiber", category: "Utilities", type: "send", amount: 799, mcc: "4813" },
  { merchant: "Freelance - Dev", category: "Freelance", type: "receive", amount: 22000, mcc: "7372" },
];

let txId = 1;

export function generateTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const now = new Date(2026, 5, 12); // June 12, 2026

  for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
    const d = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();

    const variation = 0.7 + Math.random() * 0.6;

    for (const base of baseTransactions) {
      if (Math.random() > 0.85) continue;
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      const amount = Math.round(base.amount * variation * (0.85 + Math.random() * 0.3));
      transactions.push({
        ...base,
        id: `tx-${txId++}`,
        date: makeDate(year, month, day),
        amount,
      });
    }

    // For current month only use dates up to the 12th
    if (monthOffset === 0) {
      transactions.forEach((tx) => {
        if (tx.date.startsWith(`${year}-${String(month).padStart(2, "0")}`)) {
          const day = parseInt(tx.date.split("-")[2]);
          if (day > 12) {
            tx.date = makeDate(year, month, Math.floor(Math.random() * 12) + 1);
          }
        }
      });
    }
  }

  return transactions.sort((a, b) => b.date.localeCompare(a.date));
}

export const ALL_TRANSACTIONS = generateTransactions();

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export interface Budget {
  category: Category;
  limit: number;
}
