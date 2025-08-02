import { Fireworks, type FireworksHandlers } from "@fireworks-js/react";
import { useContext, useEffect, useRef } from "react";
import { Link, type MetaFunction } from "react-router";
import pinExtensionImage from "../assets/pin-extension.png";
import { LinksContext } from "../contexts";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Welcome to Furigana Maker",
    },
  ];
};
export default function Welcome() {
  const links = useContext(LinksContext)!;
  const ref = useRef<FireworksHandlers>(null);

  useEffect(() => {
    ref.current?.start();
    setTimeout(() => {
      ref.current?.waitStop();
    }, 30 * 1000);

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
    return () => ref.current?.stop() && riseObserver.disconnect();
  }, []);

  function handlePointerMoveAnimation(event: React.PointerEvent<HTMLDivElement>) {
    const target = event.currentTarget;
    const { clientX, clientY } = event;
    const { top, left, width, height } = target.getBoundingClientRect();
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    const deg = Math.round(Math.atan2(y - 0.5, x - 0.5) * (180 / Math.PI) + 90);
    const radius = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2);

    target.style.setProperty("--welcome-x", `${x.toString()}`);
    target.style.setProperty("--welcome-y", `${y.toString()}`);
    target.style.setProperty("--welcome-deg", `${deg.toString()}`);
    target.style.setProperty("--welcome-radius", `${radius.toString()}`);
    target.addEventListener(
      "pointerleave",
      () => {
        target.style.setProperty("--welcome-x", "0.5");
        target.style.setProperty("--welcome-y", "0.5");
        target.style.setProperty("--welcome-deg", "0");
        target.style.setProperty("--welcome-radius", "0");
      },
      { once: true },
    );
  }

  return (
    <div className="relative mt-5 flex min-h-screen flex-col items-center gap-5 text-pretty px-10 py-8 pt-24 text-center lg:mt-16 lg:pt-36">
      <Fireworks
        ref={ref}
        options={{ opacity: 0.5 }}
        className="-z-10 fixed top-0 left-0 h-full w-full"
      />
      <section className="container flex flex-col items-center gap-5 text-pretty text-center sm:px-10">
        <h1 className="animeRising font-bold text-3xl sm:text-5xl md:text-6xl lg:text-8xl">
          Welcome to Furigana Maker!🎉
        </h1>
        <div className="animeRising mt-10 flex flex-col-reverse items-center justify-center gap-10 sm:flex-row">
          <div
            className="relative overflow-hidden rounded-3xl transition duration-[400ms] ease-[cubic-bezier(0.03,0.98,0.52,0.99)] will-change-transform hover:shadow-[0_0_15px_0_hsla(201,80%,66%,.5),0_0_30px_0_hsla(161,55%,49%,.5)]"
            style={{
              transform:
                "perspective(1000px) rotateX(calc((var(--welcome-y) - 0.5) * -32deg)) rotateY(calc((var(--welcome-x) - 0.5) * -32deg)) scale3d(1, 1, 1)",
            }}
            onPointerMove={handlePointerMoveAnimation}
          >
            <img
              src={pinExtensionImage}
              alt="Step of pin extension "
              width={(477 * 3) / 4}
              height={(324 * 3) / 4}
            />
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute top-1/2 left-1/2 size-[500px] origin-[0%_0%] bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgb(255,255,255)_100%)] opacity-0 transition-opacity duration-[400ms] ease-[cubic-bezier(0.03,0.98,0.52,0.99)]"
                onPointerMove={handlePointerMoveAnimation}
                style={{
                  transform: "translate(-50%, -50%)",
                  opacity: "calc(var(--welcome-radius) * 0.3)",
                }}
              />
            </div>
          </div>
          <div>
            <div className="mb-4 inline-block rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 font-bold uppercase">
              Introduction
            </div>
            <p className="animeRising max-w-[30rem] leading-normal sm:text-xl sm:leading-8">
              You have successfully installed the extension, now you can start to add furigana to
              Kanji, please open the Popup page of the extension and click on the{" "}
              <span className="text-sky-400">"Add furigana"</span> button and select the Japanese
              text below and watch the change.
            </p>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="mb-4 inline-block rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 font-bold uppercase">
          Example
        </div>
        <h2 lang="ja" className="animeRising mb-2 font-bold font-japanese text-xl sm:text-2xl">
          銀河鉄道の夜 - <span>宮沢賢治</span>
        </h2>
        <p
          lang="ja"
          className="animeRising max-w-[42rem] indent-10 font-japanese leading-normal sm:text-xl sm:leading-8"
        >
          ああそのときでした。見えない天の川のずうっと川下に青や橙やもうあらゆる光でちりばめられた十字架がまるで一本の木という風に川の中から立ってかがやきその上には青じろい雲がまるい環になって後光のようにかかっているのでした。汽車の中がまるでざわざわしました。みんなあの北の十字のときのようにまっすぐに立ってお祈りをはじめました。あっちにもこっちにも子供が瓜に飛びついたときのようなよろこびの声や何とも云いようない深いつつましいためいきの音ばかりきこえました。そしてだんだん十字架は窓の正面になりあの苹果の肉のような青じろい環の雲もゆるやかにゆるやかに繞っているのが見えました。
        </p>
      </section>
      <section className="pb-20">
        <div className="mb-4 inline-block rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 font-bold uppercase">
          Tips
        </div>
        <ol className="list-inside list-decimal text-400 marker:text-sky-400">
          <li className="animeRising sm:text-xl">
            You can set shortcuts for browser extension to access specific features.
          </li>
          <li className="animeRising mt-6 sm:text-xl">
            You can Pin the extension on the browser bar for faster access to Popup page.
          </li>
          <li className="animeRising mt-6 sm:text-xl">
            You can see the preset rules and edit them on the Options page.
          </li>
        </ol>
      </section>
      <Link
        to={links.github}
        target="_blank"
        className="hover:-translate-y-2 mb-12 flex select-none items-center gap-2 rounded-xl border-2 border-sky-400 border-solid bg-slate-900 px-4 py-2 font-bold transition duration-300 hover:shadow-[0_0_15px_0_hsla(201,80%,66%,.5),0_0_30px_0_hsla(161,55%,49%,.5)] lg:mb-15 xl:mb-20"
      >
        <i className="i-mdi-github size-5" />
        View on GitHub
        <i className="i-mdi-arrow-top-right" />
      </Link>
    </div>
  );
}
