import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

export default function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };
  const { t } = useTranslation();
  return (
    <button
      onClick={toggleTheme}
      className="flex size-9 cursor-pointer items-center justify-center rounded-md text-black hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800"
    >
      <span className="sr-only">{t("srToggleTheme")}</span>
      {resolvedTheme === "light" && <i className="i-tabler-sun-filled size-5" />}
      {resolvedTheme === "dark" && <i className="i-tabler-moon-filled size-5" />}
    </button>
  );
}
