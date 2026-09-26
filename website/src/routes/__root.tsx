import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/lobster/400.css";
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/700.css";

import "../tailwind.css";

import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";
import NotFoundPage from "../components/NotFoundPage";
import { LinksContext } from "../contexts";

export const Route = createRootRoute({
  component: Outlet,
  shellComponent: Layout,
  notFoundComponent: NotFoundPage,
});

function Layout({ children }: { children: React.ReactNode }) {
  const links = {
    chrome:
      "https://chromewebstore.google.com/detail/furigana-maker/heodojceeinbkfjfilnfminlkgbacpfp",
    edge: "https://microsoftedge.microsoft.com/addons/detail/furigana-maker/kohpoklaaeicnkdapjkmljdachedmbbi",
    firefox: "https://addons.mozilla.org/en-US/firefox/addon/furigana-maker/",
    github: "https://github.com/aiktb/furiganamaker",
  };

  const backgroundAnimeGroup = [
    "left-[25%] size-20  [animation-delay:0]",
    "left-[10%] size-5  [animation-delay:2s]  [animation-duration:12s]",
    "left-[70%] size-5  [animation-delay:4s]",
    "left-[40%] size-15  [animation-delay:0]   [animation-duration:18s]",
    "left-[65%] size-5  [animation-delay:0]",
    "left-[75%] size-27.5 [animation-delay:3s]",
    "left-[35%] size-37.5 [animation-delay:7s]",
    "left-[50%] size-6.25  [animation-delay:15s] [animation-duration:45s]",
    "left-[20%] size-3.75  [animation-delay:2s]  [animation-duration:35s]",
    "left-[85%] size-37.5 [animation-delay:0]   [animation-duration:11s]",
    "left-[90%] size-12.5  [animation-delay:0]  [animation-duration:20s]",
    "left-[15%] size-7.5  [animation-delay:0] [animation-duration:50s]",
  ];

  return (
    <html lang="en" className="bg-slate-900">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Brian Zhou <brianzhou.dev@gmail.com>" />
        <meta name="color-scheme" content="light dark" />
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col font-sans text-base text-white">
        <div className="flex flex-1 flex-col justify-between">
          <LinksContext.Provider value={links}>
            <Header />
            <main className="relative flex-1 overflow-hidden">
              <div className="absolute inset-0 -z-10" aria-hidden="true">
                {backgroundAnimeGroup.map((className) => (
                  <div
                    key={className}
                    className={`${className} absolute -bottom-40 block size-5 animate-floating bg-white/20`}
                  />
                ))}
              </div>
              {children}
            </main>
            <Footer />
          </LinksContext.Provider>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
