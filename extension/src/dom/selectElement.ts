import { addFurigana } from "./addFurigana";

class Renderer {
  readonly #BORDER = 5;
  readonly #PADDING = 2;
  readonly #GENERAL_CSS = {
    position: "fixed",
    display: "none",
    background: "DodgerBlue",
    // The overlay is purely a visual indicator, it must never become an event target,
    // otherwise hovering or clicking the border would highlight the overlay itself.
    pointerEvents: "none",
    // Max z-index
    zIndex: 2 ** 31 - 1,
  };

  readonly #BOTTOM_CSS = {
    color: "white",
    overflow: "hidden",
    boxSizing: "border-box",
    fontFamily: "sans-serif",
    fontWeight: "bold",
    fontSize: `${this.#BORDER * 2}px`,
    lineHeight: `${this.#BORDER * 4}px`,
    paddingLeft: `${this.#BORDER}px`,
    paddingRight: `${this.#BORDER}px`,
  };

  readonly #left = document.createElement("div");
  readonly #right = document.createElement("div");
  readonly #top = document.createElement("div");
  readonly #bottom = document.createElement("div");
  readonly #getTagPath = (element: HTMLElement) => {
    const parent = element.parentElement;
    const parentTagName = parent?.tagName.toLowerCase() ?? "";
    return `${parentTagName} ${element.tagName.toLowerCase()}`;
  };

  constructor() {
    Object.assign(this.#left.style, this.#GENERAL_CSS);
    Object.assign(this.#right.style, this.#GENERAL_CSS);
    Object.assign(this.#top.style, this.#GENERAL_CSS);
    Object.assign(this.#bottom.style, this.#GENERAL_CSS, this.#BOTTOM_CSS);
  }

  readonly initialize = () => {
    document.documentElement.appendChild(this.#left);
    document.documentElement.appendChild(this.#right);
    document.documentElement.appendChild(this.#top);
    document.documentElement.appendChild(this.#bottom);
  };

  readonly destroy = () => {
    // Hide before detaching so that a reused instance starts hidden on the next `initialize`.
    this.hide();
    this.#left.remove();
    this.#right.remove();
    this.#top.remove();
    this.#bottom.remove();
  };

  readonly hide = () => {
    this.#left.style.display = "none";
    this.#right.style.display = "none";
    this.#top.style.display = "none";
    this.#bottom.style.display = "none";
  };

  readonly show = () => {
    this.#left.style.display = "block";
    this.#right.style.display = "block";
    this.#top.style.display = "block";
    this.#bottom.style.display = "block";
  };

  readonly add = (element: HTMLElement) => {
    this.hide();

    const { left, top, width, height } = element.getBoundingClientRect();
    const outerLeft = left - this.#BORDER - this.#PADDING;
    const outerTop = top - this.#BORDER - this.#PADDING;
    const outerWidth = width + this.#BORDER * 2 + this.#PADDING * 2;
    const outerHeight = height + this.#BORDER * 4 + this.#PADDING * 2;

    // Just a tooltip cobbled together with absolute positioning, don't read.
    this.#left.style.left = `${outerLeft}px`;
    this.#left.style.top = `${outerTop}px`;
    this.#left.style.width = `${this.#BORDER}px`;
    this.#left.style.height = `${outerHeight}px`;

    this.#right.style.left = `${outerLeft + outerWidth - this.#BORDER}px`;
    this.#right.style.top = `${outerTop}px`;
    this.#right.style.width = `${this.#BORDER}px`;
    this.#right.style.height = `${outerHeight}px`;

    this.#top.style.left = `${outerLeft}px`;
    this.#top.style.top = `${outerTop}px`;
    this.#top.style.width = `${outerWidth}px`;
    this.#top.style.height = `${this.#BORDER}px`;

    this.#bottom.style.left = `${outerLeft}px`;
    this.#bottom.style.top = `${outerTop + outerHeight - this.#BORDER * 3}px`;
    this.#bottom.style.width = `${outerWidth}px`;
    this.#bottom.style.height = `${this.#BORDER * 4}px`;
    this.#bottom.textContent = this.#getTagPath(element);

    this.show();
  };
}

// Singleton pattern
// Adds a "border" indicator when the user selects text on the page with the mouse.
export class Selector {
  readonly #renderer = new Renderer();
  static readonly #selector = new Selector();
  #isOpen = false;
  readonly #onElementSelected = addFurigana;
  readonly #pointeroverHandler = (event: Event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const target = event.target;
    // `<body>` and `<html>` cover the whole viewport, highlighting them is never useful.
    if (
      !(target instanceof HTMLElement) ||
      target === document.body ||
      target === document.documentElement
    ) {
      return;
    }
    this.#renderer.add(target);
  };

  readonly #clickHandler = (event: Event) => {
    // The jump event of click an internal link in Vue SPA is not a default event and cannot be prevented.
    event.preventDefault();
    event.stopImmediatePropagation();
    // Only need to handle events triggered non-programmatically.
    if (!event.isTrusted) {
      return;
    }
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    this.#onElementSelected(target);
  };

  readonly #keydownHandler = (event: KeyboardEvent) => {
    if (event.key !== "Escape") {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    this.close();
  };

  static readonly create = () => {
    return this.#selector;
  };

  /**
   * A single delegated listener on `document` replaces one listener per element.
   * @remarks
   * The capture phase runs from the outermost node inwards, so a `document` listener always
   * runs first, and `event.target` is the deepest element under the pointer either way.
   * Delegation is therefore behaviourally identical to binding every element, but it costs
   * two listeners instead of two per element, and it keeps working for elements that the
   * page adds after the selector was opened.
   */
  readonly open = () => {
    if (this.#isOpen) {
      return;
    }
    this.#isOpen = true;
    this.#renderer.initialize();
    document.addEventListener("click", this.#clickHandler, { capture: true });
    document.addEventListener("pointerover", this.#pointeroverHandler, { capture: true });
    document.addEventListener("keydown", this.#keydownHandler, { capture: true });
  };

  readonly close = () => {
    if (!this.#isOpen) {
      return;
    }
    this.#isOpen = false;
    document.removeEventListener("click", this.#clickHandler, { capture: true });
    document.removeEventListener("pointerover", this.#pointeroverHandler, { capture: true });
    document.removeEventListener("keydown", this.#keydownHandler, { capture: true });
    this.#renderer.destroy();
  };
}
