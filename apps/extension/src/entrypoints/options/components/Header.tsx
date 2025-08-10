import { useTranslation } from "react-i18next";
import { ThemeSwitch } from "./ThemeSwitch";

interface HeaderProps {
  icon: string;
  title: string;
}
export function Header({ icon, title }: HeaderProps) {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-10 border-gray-200 border-b dark:border-slate-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-5 backdrop-blur-sm backdrop-filter">
          <div className="flex items-center text-base">
            <i className={`mr-3 size-6 text-sky-500 ${icon}`} />
            <span className="font-bold text-black dark:text-white">{title}</span>
          </div>
          <div className="flex gap-x-3">
            <ThemeSwitch />
            <a
              className="flex size-9 items-center justify-center rounded-md text-black hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800 dark:hover:text-white"
              href="https://github.com/aiktb/furiganamaker"
            >
              <span className="sr-only">{t("srGithub")}</span>
              <i className="i-fa6-brands-github size-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
