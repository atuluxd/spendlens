import { Sun, Moon, Monitor, Bell, Shield, HelpCircle, ChevronRight, LogOut } from "lucide-react";
import { useTheme } from "./ThemeContext";

const THEME_OPTIONS: { value: "light" | "dark" | "system"; Icon: typeof Sun; label: string }[] = [
  { value: "light",  Icon: Sun,     label: "Light"  },
  { value: "dark",   Icon: Moon,    label: "Dark"   },
  { value: "system", Icon: Monitor, label: "System" },
];

const SETTINGS = [
  { Icon: Bell,        label: "Notifications",     sub: "Budget alerts & weekly summaries" },
  { Icon: Shield,      label: "Privacy & Security", sub: "Permissions and data controls"   },
  { Icon: HelpCircle,  label: "Help & Support",     sub: "FAQs, contact and feedback"      },
];

export function ProfilePage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Avatar block */}
      <div className="flex flex-col items-center pt-8 pb-6 px-6">
        <div
          className="w-18 h-18 rounded-2xl flex items-center justify-center text-3xl mb-3"
          style={{ background: "rgba(124,106,247,0.18)", width: 72, height: 72 }}
        >
          👤
        </div>
        <p className="text-foreground">Arjun Mehta</p>
        <p className="text-muted-foreground text-xs mt-0.5">arjun.mehta@gmail.com</p>
        <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: "rgba(124,106,247,0.12)" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs text-primary">Premium Plan</span>
        </div>
      </div>

      <div className="px-4 space-y-4 pb-8">

        {/* ── Appearance ─────────────────────────── */}
        <section className="bg-card border border-border rounded-2xl overflow-hidden">
          <p className="text-xs text-muted-foreground uppercase tracking-widest px-4 pt-4 pb-3">
            Appearance
          </p>
          <div className="flex items-center gap-1 bg-secondary rounded-xl mx-4 mb-4 p-1">
            {THEME_OPTIONS.map(({ value, Icon, label }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-all"
                style={
                  theme === value
                    ? { background: "#7c6af7", color: "#fff" }
                    : { color: "var(--muted-foreground)" }
                }
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Settings rows ───────────────────────── */}
        <section className="bg-card border border-border rounded-2xl overflow-hidden">
          <p className="text-xs text-muted-foreground uppercase tracking-widest px-4 pt-4 pb-2">
            Settings
          </p>
          {SETTINGS.map(({ Icon, label, sub }, i) => (
            <div key={label}>
              {i > 0 && <div className="mx-4 h-px bg-border" />}
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left">
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground truncate">{sub}</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
              </button>
            </div>
          ))}
        </section>

        {/* ── Sign out ────────────────────────────── */}
        <button className="w-full flex items-center gap-3 bg-card border rounded-2xl px-4 py-3 transition-colors hover:bg-red-500/5" style={{ borderColor: "rgba(239,68,68,0.25)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.1)" }}>
            <LogOut size={15} style={{ color: "#ef4444" }} />
          </div>
          <span className="text-sm" style={{ color: "#ef4444" }}>Sign out</span>
        </button>

        <p className="text-center text-xs text-muted-foreground pb-2">SpendLens v1.0</p>
      </div>
    </div>
  );
}
