import { Temporal } from "@js-temporal/polyfill";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";

import cloudflare from "../assets/cloudflare.svg";
import { LinksContext } from "../contexts";

const getCopiedYear = () => {
  const currentYear = Temporal.Now.plainDateISO().year;
  return currentYear === 2023 ? "2023" : `2023-${currentYear}`;
};

const toTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export default function Footer() {
  const navItems = [
    { text: "About the author", to: "https://github.com/aiktb" },
    { text: "Contact us", to: "mailto:ai.ourship@gmail.com" },
    { text: "Support us", to: "https://buymeacoffee.com/aiktb" },
  ];

  const links = useContext(LinksContext)!;
  const iconLinkItems = [
    { title: "chrome web store", to: links.chrome, icon: "i-fa6-brands-chrome" },
    { title: "github", to: links.github, icon: "i-fa6-brands-github" },
  ];

  const [isAtBottom, setIsAtBottom] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const TOLERANCE = 100;
      const result =
        window.innerHeight + Math.round(window.scrollY) >= document.body.offsetHeight - TOLERANCE;
      setIsAtBottom(result);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer className="w-full border-slate-600 border-stroke border-t bg-slate-800">
      <button
        className={`fixed right-6 bottom-6 size-10 cursor-pointer rounded-full bg-sky-400 transition-all duration-500 ${
          isAtBottom ? "" : "pointer-events-none opacity-0"
        }`}
        onClick={toTop}
      >
        <span className="sr-only">Back to top</span>
        <i className="i-mdi-chevron-up size-10" />
      </button>
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav className="flex items-center justify-center space-x-4 sm:space-x-12 ">
          {navItems.map((item) => (
            <Link
              target="_blank"
              key={item.text}
              className="text-sm text-zinc-300 leading-6 hover:text-sky-400"
              to={item.to}
            >
              {item.text}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex justify-center space-x-10">
          {iconLinkItems.map((item) => (
            <Link
              key={item.icon}
              className="size-6 text-zinc-300 hover:text-sky-400"
              to={item.to}
              target="_blank"
            >
              <span className="sr-only">{item.title}</span>
              <span className={`${item.icon} size-5`} />
            </Link>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center text-xs">
          Proudly hosted with <span className="sr-only">Cloudflare Pages.</span>
          <Link to="https://pages.cloudflare.com/" target="_blank">
            <img src={cloudflare} alt="Cloudflare Logo" className="inline-block h-8 w-auto" />
          </Link>
        </div>
        <div>
          <p className="mt-8 text-pretty text-center text-text/90 text-xs leading-5">
            © {getCopiedYear()} Furigana Maker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
