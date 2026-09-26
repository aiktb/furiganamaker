import { createFileRoute } from "@tanstack/react-router";
import { useContext, useEffect } from "react";

import AddToBrowser from "../components/AddToBrowser";
import Features from "../components/Features";
import { LinksContext } from "../contexts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Furigana Maker - Add furigana to Japanese text on any page" },
      {
        name: "description",
        content:
          "A browser extension that adds furigana to Japanese text on any page, for learning kanji pronunciation.",
      },
    ],
  }),
  component: Index,
});

export default function Index() {
  const links = useContext(LinksContext)!;

  const YOUTUBE_VIDEO_ID = "_j954tDLXjw";

  useEffect(() => {
    const riseObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-rising");
          riseObserver.unobserve(entry.target);
        }
      }
    });
    for (const el of document.querySelectorAll(".animeRising")) {
      riseObserver.observe(el);
    }
    return () => riseObserver.disconnect();
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center">
      <section className="container mt-5 flex flex-col items-center gap-5 text-pretty px-10 pt-24 text-center lg:mt-16 lg:pt-36">
        <h1 className="animeRising font-bold text-3xl sm:text-5xl md:text-6xl lg:text-8xl">
          Add{" "}
          <span>
            <ruby lang="ja" className="font-japanese">
              振り仮名<rt>furigana</rt>
            </ruby>
          </span>{" "}
          to Japanese text on any page.
        </h1>
        <p className="animeRising max-w-2xl leading-normal sm:text-xl sm:leading-8">
          Simply click on the text and furigana will appear on the text to help you understand the
          pronunciation of kanji, allowing automation!
        </p>
      </section>
      <div className="animeRising relative mt-6 flex flex-col items-center gap-6 sm:flex-row">
        <AddToBrowser />
        <a
          href={links.github}
          target="_blank"
          className="flex select-none items-center gap-2 rounded-xl border-2 border-sky-400 border-solid bg-slate-900 px-4 py-2 font-bold transition duration-300 hover:-translate-y-2 hover:shadow-[0_0_15px_0_hsla(201,80%,66%,.5),0_0_30px_0_hsla(161,55%,49%,.5)]"
          rel="noopener noreferrer"
        >
          <i className="i-mdi-github size-5" />
          View on GitHub
          <i className="i-mdi-arrow-top-right" />
        </a>
      </div>
      <Features />
      <div className="flex w-full flex-col items-center px-4">
        <div
          id="demo"
          className="mb-4 inline-block rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 font-bold uppercase"
        >
          Demo
        </div>
        <h2 className="animeRising mx-auto text-center font-bold text-3xl text-white md:text-4xl xl:text-5xl">
          Operation Guide
        </h2>
        <iframe
          className="animeRising mt-12 aspect-video w-[90%] rounded-md lg:mt-15 lg:w-260 xl:mt-20"
          src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
          allowFullScreen
          title="Furigana Maker Demo"
        />
      </div>
      <section className="container mx-auto my-12 flex max-w-200 flex-col items-center justify-center gap-5 text-pretty py-8 lg:my-15 xl:my-20">
        <div className="mb-4 inline-block rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 font-bold uppercase">
          Open Source
        </div>
        <h2 className="animeRising mx-auto text-center font-bold text-3xl text-white md:text-4xl xl:text-5xl">
          Proudly Open Source
        </h2>
        <p className="animeRising max-w-[85%] text-center leading-normal sm:text-lg sm:leading-7">
          This extension has benefited from the support of many open source software and developers,
          with special thanks to{" "}
          <a
            href="https://github.com/lindera/lindera"
            target="_blank"
            className="underline decoration-sky-400 underline-offset-2 transition hover:text-sky-400/90 hover:decoration-2"
            rel="noopener noreferrer"
          >
            Lindera
          </a>{" "}
          (core feature), and{" "}
          <a
            href="https://github.com/wxt-dev/wxt"
            target="_blank"
            className="underline decoration-sky-400 underline-offset-2 transition hover:text-sky-400/90 hover:decoration-2"
            rel="noopener noreferrer"
          >
            WXT
          </a>{" "}
          (build tools), without these great open source software, the development of this extension
          would not have been possible!
        </p>
        <p className="animeRising max-w-[85%] text-center leading-normal sm:text-lg sm:leading-7">
          Like this extension? Furigana Maker is an open source software under the MIT license,
          please consider giving it a Star to motivate me to implement new features and fix bugs for
          it! Any good idea and PR are welcome. Thank you. ❤️
        </p>
        <a
          target="_blank"
          className="animeRising group mt-4 flex select-none"
          href={links.github}
          rel="noopener noreferrer"
        >
          <div className="group flex size-10 items-center justify-center space-x-2 rounded-md border-2 border-sky-400 bg-muted bg-slate-900 transition duration-300 group-hover:shadow-[0_0_15px_0_hsla(201,80%,66%,.5),0_0_30px_0_hsla(161,55%,49%,.5)]">
            <i className="i-mdi-github text-2xl" />
          </div>
          <div className="flex items-center">
            <div className="size-4 border-sky-400 border-y-8 border-y-transparent border-r-8 border-l-0 border-solid" />
            <div className="flex h-10 items-center gap-2 rounded-md border-2 border-sky-400 bg-slate-900 px-4 font-display font-semibold transition duration-300 group-hover:shadow-[0_0_15px_0_hsla(201,80%,66%,.5),0_0_30px_0_hsla(161,55%,49%,.5)]">
              Star on GitHub ⭐
            </div>
          </div>
        </a>
      </section>
    </div>
  );
}
