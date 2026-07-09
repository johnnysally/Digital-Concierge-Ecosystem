import React from "react";

interface ThemeContextValue {
  theme: "light" | "dark";
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = React.useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = window.localStorage.getItem("customer-dashboard-theme");
      if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
    }
    return "light";
  });

  React.useEffect(() => {
    window.localStorage.setItem("customer-dashboard-theme", theme);
  }, [theme]);

  const value = React.useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
