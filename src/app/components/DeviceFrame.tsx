import { ReactNode } from "react";

export type DeviceType = "iphone" | "android" | "web";

interface Props {
  device: DeviceType;
  onDeviceChange: (d: DeviceType) => void;
  children: ReactNode;
}

const DEVICES: { key: DeviceType; label: string; icon: string }[] = [
  { key: "iphone",  label: "iPhone",   icon: "📱" },
  { key: "android", label: "Android",  icon: "🤖" },
  { key: "web",     label: "Web",      icon: "🖥" },
];

const FRAME: Record<DeviceType, { w: number; h: number; r: number; notch: boolean; pill: boolean }> = {
  iphone:  { w: 390, h: 844, r: 44, notch: true,  pill: false },
  android: { w: 393, h: 851, r: 36, notch: false, pill: true  },
  web:     { w: 0,   h: 0,   r: 0,  notch: false, pill: false },
};

export function DeviceFrame({ device, onDeviceChange, children }: Props) {
  const f = FRAME[device];
  const isMobile = device !== "web";

  return (
    <div className="flex flex-col h-full w-full overflow-hidden" style={{ background: "#07080f" }}>

      {/* ── toolbar ─────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 py-2.5 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* traffic lights */}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
        </div>

        {/* device switcher */}
        <div
          className="flex items-center gap-0.5 rounded-xl p-1"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          {DEVICES.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => onDeviceChange(key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
              style={
                device === key
                  ? { background: "#7c6af7", color: "#fff" }
                  : { color: "rgba(255,255,255,0.4)" }
              }
            >
              <span>{icon}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="w-20" />
      </div>

      {/* ── canvas ──────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center overflow-hidden p-4 min-h-0">
        {isMobile ? (
          <div
            className="relative flex-shrink-0 overflow-hidden"
            style={{
              width:  Math.min(f.w, window.innerWidth  - 32),
              height: Math.min(f.h, window.innerHeight - 120),
              borderRadius: f.r,
              border:  "8px solid #1c1f2e",
              outline: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
            }}
          >
            {/* iOS notch */}
            {f.notch && (
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                style={{ width: 120, height: 34, background: "#1c1f2e", borderRadius: "0 0 20px 20px" }}
              />
            )}
            {/* Android pill */}
            {f.pill && (
              <div
                className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                style={{ width: 100, height: 11, background: "rgba(255,255,255,0.18)", borderRadius: 99 }}
              />
            )}
            {/* status bar */}
            <div
              className="absolute top-0 left-0 right-0 z-20 flex items-end justify-between pointer-events-none select-none"
              style={{ height: f.notch ? 48 : 28, paddingBottom: 4, paddingLeft: 20, paddingRight: 20, color: "rgba(255,255,255,0.55)", fontSize: 11 }}
            >
              <span>9:41</span>
              <span>▲▲▲ WiFi 🔋</span>
            </div>
            {/* content */}
            <div
              className="absolute inset-0 overflow-hidden bg-background"
              style={{ paddingTop: f.notch ? 48 : 28 }}
            >
              {children}
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full overflow-hidden rounded-xl bg-background"
            style={{ border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
