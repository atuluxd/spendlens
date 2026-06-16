import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolved: "light" | "dark";
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  resolved: "dark",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      return (localStorage.getItem("spendlens-theme") as Theme) ?? "dark";
    } catch {
      return "dark";
    }
  });

  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const resolved: "light" | "dark" =
    theme === "system" ? (systemDark ? "dark" : "light") : theme;

  function setTheme(t: Theme) {
    setThemeState(t);
    try {
      localStorage.setItem("spendlens-theme", t);
    } catch {}
  }

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {/*
        Tailwind v4 dark variant is (&:is(.dark *)) so .dark must be an ancestor.
        We wrap children in a div that carries the class.
      */}
      <div className={`${resolved === "dark" ? "dark" : ""} h-full w-full`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
