import { useContext } from "react";
import { Link, useLocation } from "react-router";
import Logo from "../assets/Logo.svg";
import { LinksContext } from "../contexts";

export default function Header() {
  const links = useContext(LinksContext)!;
  const navItems = [
    { text: "Home", to: { pathname: "/" } },
    { text: "Features", to: { pathname: "/", hash: "#features" } },
    { text: "Demo", to: { pathname: "/", hash: "#demo" } },
    { text: "Welcome", to: { pathname: "/welcome" } },
  ];
  const location = useLocation();
  const isActive = (to: { pathname: string; hash?: string }) => {
    const pathnameMatched = to.pathname === location.pathname;
    return pathnameMatched && !to.hash;
  };

  return (
    <header className="w-full select-none transition duration-300">
      <div className="-translate-x-1/2 fixed top-6 left-1/2 z-50 transform">
        <nav className="flex gap-2 rounded-full p-2.5 backdrop-blur-3xl backdrop-brightness-75 transition ease-in-out sm:gap-x-2 lg:gap-x-8">
          {navItems.map((item) => (
            <Link
              key={item.text}
              className={`block rounded-full px-3.5 py-1 font-medium text-gray-300 transition ease-in-out hover:bg-white/10 hover:text-gray-100 sm:px-6 sm:py-1.5 ${
                isActive(item.to) ? "bg-white/10" : ""
              }`}
              prefetch="render"
              to={item.to}
            >
              {item.text}
            </Link>
          ))}
        </nav>
      </div>
      <div className="-translate-x-1/2 container fixed left-1/2 z-40 mx-auto px-8 pt-8">
        <div className="hidden h-9 items-center justify-between lg:flex">
          <Link to="/">
            <img src={Logo} alt="Furigana Maker" className="size-8" />
          </Link>
          <Link className="i-mdi-github size-8" to={links.github} target="_blank" />
        </div>
      </div>
    </header>
  );
}
