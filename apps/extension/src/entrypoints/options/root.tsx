import { Outlet } from "react-router";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

export default function Options() {
  return (
    <div className="relative flex">
      <Sidebar />
      <div className="grid min-h-screen flex-1 grid-rows-[min-content_minmax(0,1fr)_min-content] lg:pl-72">
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
