import { sendMessage } from "@/commons/message";
import { toHiragana, toRomaji } from "wanakana";

import type { KanjiMark } from "@/entrypoints/background/listeners/onGetKanjiMarksMessage";

import { ExtStorage, FURIGANA_CLASS, FuriganaType } from "./constants";
import { getGeneralSettings } from "./utils";
/**
 * Append ruby tag to all text nodes of a batch of elements.
 * @remarks
 * The parent element of the text node will be added with the FURIGANA_CLASS.
 * Elements that have already been marked will be skipped.
 * Ruby tag is "\<ruby>original\<rp>(\</rp>\<rt>reading\</rt>\<rp>)\</rp>\</ruby>".
 **/
export async function addFurigana(...elements: Element[]) {
  const furiganaType = await getGeneralSettings(ExtStorage.FuriganaType);
  if (!furiganaType) {
    return;
  }

  const japaneseTexts = elements.flatMap(collectTexts);
  for (const text of japaneseTexts) {
    const tokens: KanjiMark[] = await tokenize(text.textContent!);
    // reverse() prevents the range from being invalidated
    for (const token of tokens.reverse()) {
      const ruby = createRuby(token, furiganaType);
      const range = document.createRange();
      range.setStart(text, token.start);
      range.setEnd(text, token.end);
      range.deleteContents();
      range.insertNode(ruby);
    }
  }
}

const exclusionParentTagSet = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "RUBY", "RT"]);
const collectTexts = (element: Element): Text[] => {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parent = node.parentElement! as Element;
    if (!exclusionParentTagSet.has(parent.tagName)) {
      texts.push(node as Text);
    }
  }
  return texts;
};

const tokenize = async (text: string) => {
  // Performance Optimization: This will reduce the number of Service Worker requests by more than 50%.
  const hasKanji = /\p{sc=Han}/v.test(text);
  if (!hasKanji) {
    return [];
  }
  const { tokens } = await sendMessage("getKanjiMarks", { text });
  return tokens;
};

const createRuby = (token: KanjiMark, furiganaType: FuriganaType): HTMLElement => {
  const ruby = document.createElement("ruby");
  ruby.classList.add(FURIGANA_CLASS);
  if (token.isFiltered) {
    ruby.classList.add("isFiltered");
  }
  const rightParenthesisRp = document.createElement("rp");
  rightParenthesisRp.textContent = ")";
  const leftParenthesisRp = document.createElement("rp");
  leftParenthesisRp.textContent = "(";
  const originalText = document.createTextNode(token.original);

  switch (furiganaType) {
    case FuriganaType.Hiragana:
      token.reading = toHiragana(token.reading);
      break;
    case FuriganaType.Romaji:
      token.reading = toRomaji(token.reading);
      break;
    case FuriganaType.Katakana:
      // token.reading default is katakana
      break;
  }
  const readingTextNode = document.createTextNode(token.reading);
  const rt = document.createElement("rt");
  rt.appendChild(readingTextNode);
  ruby.appendChild(originalText);
  ruby.appendChild(leftParenthesisRp);
  ruby.appendChild(rt);
  ruby.appendChild(rightParenthesisRp);
  return ruby;
};
