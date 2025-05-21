import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/lobster/400.css";
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/700.css";

import "./tailwind.css";

import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { LinksContext } from "./contexts";

export function Layout({ children }: { children: React.ReactNode }) {
  const links = {
    chrome:
      "https://chromewebstore.google.com/detail/furigana-maker/heodojceeinbkfjfilnfminlkgbacpfp",
    github: "https://github.com/aiktb/furiganamaker",
  };

  const backgroundAnimeGroup = [
    "left-[25%] size-[80px]  [animation-delay:0]",
    "left-[10%] size-[20px]  [animation-delay:2s]  [animation-duration:12s]",
    "left-[70%] size-[20px]  [animation-delay:4s]",
    "left-[40%] size-[60px]  [animation-delay:0]   [animation-duration:18s]",
    "left-[65%] size-[20px]  [animation-delay:0]",
    "left-[75%] size-[110px] [animation-delay:3s]",
    "left-[35%] size-[150px] [animation-delay:7s]",
    "left-[50%] size-[25px]  [animation-delay:15s] [animation-duration:45s]",
    "left-[20%] size-[15px]  [animation-delay:2s]  [animation-duration:35s]",
    "left-[85%] size-[150px] [animation-delay:0]   [animation-duration:11s]",
    "left-[90%] size-[50px]  [animation-delay:0]  [animation-duration:20s]",
    "left-[15%] size-[30px]  [animation-delay:0] [animation-duration:50s]",
  ];

  return (
    <html lang="en" className="bg-slate-900">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="aiktb <ai.ourship@gmail.com>" />
        <meta name="color-scheme" content="light dark" />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col font-sans text-base text-white">
        <div className="flex flex-col justify-between">
          <LinksContext.Provider value={links}>
            <Header />
            <main className="relative flex-1 overflow-hidden">
              <div className="-z-10 absolute inset-0" aria-hidden="true">
                {backgroundAnimeGroup.map((className) => (
                  <div
                    key={className}
                    className={`${className} -bottom-40 absolute block size-5 animate-floating bg-white/20`}
                  />
                ))}
              </div>
              {children}
            </main>
            <Footer />
          </LinksContext.Provider>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
