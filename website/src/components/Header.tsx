import { Link, linkOptions, useLocation } from "@tanstack/react-router";
import { useContext } from "react";
import Logo from "../assets/Logo.svg";
import { LinksContext } from "../contexts";

export default function Header() {
  const links = useContext(LinksContext)!;
  const navItems = linkOptions([
    { text: "Home", to: "/" },
    { text: "Features", to: "/", hash: "features" },
    { text: "Demo", to: "/", hash: "demo" },
    { text: "Welcome", to: "/welcome" },
  ]);
  const location = useLocation();

  return (
    <header className="w-full select-none transition duration-300">
      <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 transform">
        <nav className="flex gap-2 rounded-full p-2.5 backdrop-blur-3xl backdrop-brightness-75 transition ease-in-out sm:gap-x-2 lg:gap-x-8">
          {navItems.map(({ text, ...options }) => (
            <Link
              key={text}
              className={`block rounded-full px-3.5 py-1 font-semibold text-slate-300 transition ease-in-out hover:bg-white/10 hover:text-slate-100 sm:px-6 sm:py-1.5 ${
                options.to === location.pathname && !("hash" in options) ? "bg-white/10" : ""
              }`}
              preload="render"
              {...options}
            >
              {text}
            </Link>
          ))}
        </nav>
      </div>
      <div className="container fixed left-1/2 z-40 mx-auto -translate-x-1/2 px-8 pt-8">
        <div className="hidden h-9 items-center justify-between lg:flex">
          <Link to="/">
            <img src={Logo} alt="Furigana Maker" className="size-8" />
          </Link>
          <a className="i-mdi-github size-8" href={links.github} target="_blank" rel="noopener">
            <span className="sr-only">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
