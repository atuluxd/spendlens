import { Home, Target, UserCircle } from "lucide-react";

export type AppTab = "home" | "budget" | "profile";

const TABS: { key: AppTab; Icon: typeof Home; label: string }[] = [
  { key: "home",    Icon: Home,        label: "Home"    },
  { key: "budget",  Icon: Target,      label: "Budget"  },
  { key: "profile", Icon: UserCircle,  label: "Profile" },
];

interface Props {
  active: AppTab;
  onChange: (t: AppTab) => void;
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="flex-shrink-0 flex items-center justify-around border-t border-border bg-card/95 backdrop-blur-md px-2 py-1">
      {TABS.map(({ key, Icon, label }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="flex flex-col items-center gap-0.5 py-1.5 px-5 rounded-xl transition-all"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              style={isActive ? { background: "#7c6af7" } : {}}
            >
              <Icon
                size={18}
                style={{ color: isActive ? "#fff" : "var(--muted-foreground)" }}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
            </div>
            <span
              className="text-[10px] transition-colors"
              style={{ color: isActive ? "var(--primary)" : "var(--muted-foreground)" }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
