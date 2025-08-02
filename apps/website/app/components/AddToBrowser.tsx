import { useContext, useRef } from "react";
import { Link } from "react-router";
import { LinksContext } from "../contexts";

export default function AddToBrowser() {
  const links = useContext(LinksContext)!;

  const dynamicHoverRef = useRef<HTMLDivElement>(null);
  const onPointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    dynamicHoverRef.current?.style.setProperty("--pointer-x", `${x}px`);
    dynamicHoverRef.current?.style.setProperty("--pointer-y", `${y}px`);
  };

  return (
    <div className="relative select-none">
      <Link
        to={links.chrome}
        prefetch="viewport"
        className="group relative inline-flex w-[17.5rem] items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-4 py-2 font-bold text-black hover:bg-[#cbcace]"
        onPointerMove={onPointerMove}
      >
        <div
          ref={dynamicHoverRef}
          className="absolute inset-0 z-0 rounded-full opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100"
          style={{
            top: -100,
            left: -100,
            width: 200,
            height: 200,
            backgroundImage: "radial-gradient(100px, rgb(247, 247, 248), rgba(247, 247, 248, 0))",
            transform: "translateX(var(--pointer-x)) translateY(var(--pointer-y))",
          }}
        />
        <div className="z-10 flex items-center justify-center gap-2">
          <span className="i-fa6-brands-chrome" />
          Add to Google Chrome
          <div className="ml-2 size-7" />
        </div>
        <div className="absolute top-0 right-0 flex items-center rounded-r-full bg-gray-200/50 py-2 pr-2 pl-2 transition hover:bg-gray-300">
          <div className="flex size-7 items-center">
            <i className="i-mdi-plus size-5 text-black" />
          </div>
        </div>
      </Link>
    </div>
  );
}
