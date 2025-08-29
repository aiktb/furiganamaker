import { useTheme } from "next-themes";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";

export function Root() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="relative flex">
      <Toaster richColors position="top-center" theme={resolvedTheme as "light" | "dark"} />
      <Sidebar />
      <div className="grid min-h-screen flex-1 grid-rows-[min-content_minmax(0,1fr)_min-content] lg:pl-72">
        <Header />
        <main className="flex flex-col items-center px-4 py-6 text-base sm:px-6 lg:px-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
