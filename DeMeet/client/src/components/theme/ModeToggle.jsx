import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeSwitcher = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      onClick={() => setDarkMode(!darkMode)}
      className="bg-background hover-none p-0 cursor-pointer"
    >
      {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
    </div>
  );
};

export default ThemeSwitcher;
