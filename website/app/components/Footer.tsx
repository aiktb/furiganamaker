import { useContext, useEffect, useState } from "react";

import cloudflare from "../assets/cloudflare.svg";
import { LinksContext } from "../contexts";

const getCopiedYear = () => {
  const currentYear = new Date().getFullYear();
  return currentYear === 2023 ? "2023" : `2023-${currentYear}`;
};

const toTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export default function Footer() {
  const navItems = [
    { text: "About the author", to: "https://github.com/aiktb" },
    { text: "Contact us", to: "mailto:brianzhou.dev@gmail.com" },
    { text: "Support us", to: "https://buymeacoffee.com/aiktb" },
  ];

  const links = useContext(LinksContext)!;
  const iconLinkItems = [
    { title: "chrome web store", to: links.chrome, icon: "i-fa6-brands-chrome" },
    { title: "microsoft edge add-ons", to: links.edge, icon: "i-fa6-brands-edge" },
    { title: "firefox add-ons", to: links.firefox, icon: "i-fa6-brands-firefox-browser" },
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
        <nav className="flex items-center justify-center space-x-4 sm:space-x-12">
          {navItems.map((item) => (
            <a
              target="_blank"
              key={item.text}
              className="text-sm text-zinc-300 leading-6 hover:text-sky-400"
              href={item.to}
              rel="noopener"
            >
              {item.text}
            </a>
          ))}
        </nav>
        <div className="mt-8 flex justify-center space-x-10">
          {iconLinkItems.map((item) => (
            <a
              key={item.icon}
              className="size-6 text-zinc-300 hover:text-sky-400"
              href={item.to}
              target="_blank"
              rel="noopener"
            >
              <span className="sr-only">{item.title}</span>
              <span className={`${item.icon} size-5`} />
            </a>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center text-xs">
          Proudly hosted with <span className="sr-only">Cloudflare Workers.</span>
          <a href="https://workers.cloudflare.com/" target="_blank" rel="noopener">
            <img src={cloudflare} alt="Cloudflare Logo" className="inline-block h-8 w-auto" />
          </a>
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
