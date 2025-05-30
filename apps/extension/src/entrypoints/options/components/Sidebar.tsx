import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, type LinkProps, NavLink } from "react-router";

import Logo from "@/assets/icons/Logo.svg?react";

type CustomLink = LinkProps & { label: string; icon: string };

export default function Sidebar() {
  const { t } = useTranslation();

  const navItems: CustomLink[] = [
    { to: "/", target: "_self", label: t("navSettings"), icon: "i-tabler-list-details" },
    { to: "/rules-editor", target: "_self", label: t("navEditRules"), icon: "i-tabler-settings" },
    { to: "/changelog", target: "_self", label: t("navChangelog"), icon: "i-tabler-history" },
    {
      to: browser.runtime.getURL("/popup.html"),
      target: "_blank",
      label: t("navPopup"),
      icon: "i-tabler-puzzle",
    },
    {
      to: "https://github.com/aiktb/furiganamaker",
      target: "_blank",
      label: "GitHub",
      icon: "i-tabler-brand-github",
    },
  ];

  const [sidebarIsOpen, setSidebarIsOpen] = useState(
    window.matchMedia("(min-width: 1024px)").matches,
  );
  useEffect(() => {
    const onResize = () => {
      setSidebarIsOpen(window.matchMedia("(min-width: 1024px)").matches);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <button
        className="-mx-2 fixed top-24 left-4 z-20 flex cursor-pointer items-center justify-center rounded-sm border-2 border-gray-300 border-solid bg-white p-2 lg:hidden dark:border-slate-700 dark:bg-slate-900"
        onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
      >
        <span className="sr-only">{t("srToggleSidebar")}</span>
        <div
          className={`${sidebarIsOpen ? "!flex" : "hidden"} fixed inset-0 bg-transparent/40 backdrop-blur-sm backdrop-filter`}
        />
        <i className="i-tabler-chevrons-right size-7 text-sky-500" />
      </button>
      <Transition show={sidebarIsOpen}>
        <nav
          className={`${sidebarIsOpen ? "!flex" : ""} data-[enter]:data-[closed]:-translate-x-full data-[leave]:data-[closed]:-translate-x-full fixed top-0 z-30 min-h-screen w-72 flex-col gap-6 border-gray-200 border-r border-solid bg-white px-6 py-5 font-semibold text-base transition ease-in-out data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-300 lg:flex dark:border-slate-800 dark:bg-slate-900`}
        >
          <Link to="https://furiganamaker.app" target="_blank" className="flex items-center gap-2">
            <Logo className="size-8" />
            <div className="flex items-center justify-center gap-2 px-1.5 text-black dark:text-white">
              <span className="font-bold text-lg">{t("extName")}</span>
              <span className="absolute right-4 font-normal text-slate-700 text-sm dark:text-slate-200">{`v${browser.runtime.getManifest().version}`}</span>
            </div>
          </Link>
          <div className="flex flex-1 flex-col justify-between gap-2">
            <div className="flex flex-col gap-7">
              <div className="-mx-2 flex flex-col gap-2">
                {navItems.map((item) => (
                  <NavLink
                    to={item.to}
                    key={item.label}
                    target={item.target}
                    className={({ isActive }) =>
                      `group flex w-64 items-center justify-between rounded-md p-2 hover:bg-slate-100 hover:text-black dark:hover:bg-gray-800 dark:hover:text-white ${isActive ? "bg-slate-100 text-black dark:bg-gray-800 dark:text-white" : ""}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-4">
                          <i
                            className={`${item.icon} size-6 group-hover:text-black group-hover:dark:text-white ${isActive ? "text-black dark:text-white" : "text-slate-600 dark:text-slate-300"}`}
                          />
                          {item.label}
                        </div>
                        {item.target === "_blank" && (
                          <i className="i-tabler-external-link text-slate-800 dark:text-gray-300" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
              <div>
                <div>{t("yourTips")}</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="flex size-6 items-center justify-center rounded-lg border-2 border-slate-300 border-solid dark:border-slate-700 dark:bg-gray-800">
                      <i className="i-tabler-command size-4 text-gray-400" />
                    </div>
                    {t("manageShortcuts")}
                  </div>
                  <i className="-rotate-45 i-tabler-arrow-back size-4 text-slate-800 dark:text-gray-300" />
                </div>
                <p className="mt-2 select-all text-sm">chrome://extensions/shortcuts</p>
              </div>
            </div>
            <Link
              to="https://buymeacoffee.com/aiktb"
              target="_blank"
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 border-solid bg-slate-50 p-2 text-zinc-800 hover:bg-gray-100 dark:border-neutral-700 dark:bg-gray-800 dark:text-slate-300 dark:hover:border-neutral-600 dark:hover:bg-gray-700"
            >
              <i className="i-tabler-heart size-6 text-pink-500" />
              {t("sidebarSponsor")}
            </Link>
          </div>
        </nav>
      </Transition>
    </>
  );
}
