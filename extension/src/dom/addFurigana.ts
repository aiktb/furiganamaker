import { ExtStorage, FURIGANA_CLASS, type FuriganaType } from "@/constants";
import { type KanjiMark, sendMessage } from "@/message";
import { getGeneralSettings } from "@/storage/settings";

/**
 * Append ruby tag to all text nodes of a batch of elements.
 * @remarks
 * The parent element of the text node will be added with the FURIGANA_CLASS.
 * Elements that have already been marked will be skipped.
 * Ruby tag is "\<ruby>original\<rp>(\</rp>\<rt>reading\</rt>\<rp>)\</rp>\</ruby>".
 **/
export async function addFurigana(...elements: Element[]) {
  const japaneseTexts = elements.flatMap(collectTexts);
  // Read the DOM before the first await. The offsets that come back address the exact
  // text that was sent, and the page is free to rewrite a node while the request is
  // in flight, so the content each node had at request time has to be remembered.
  const snapshots = japaneseTexts.map((text) => text.textContent);
  const furiganaType = await getGeneralSettings(ExtStorage.FuriganaType);
  const tokensPerText = await tokenize(snapshots, furiganaType);

  for (const [index, text] of japaneseTexts.entries()) {
    const tokens = tokensPerText[index];
    // A node the page rewrote in the meantime would be annotated at the wrong offsets.
    if (!tokens || text.textContent !== snapshots[index]) {
      continue;
    }
    // reverse() prevents the range from being invalidated
    for (const token of tokens.reverse()) {
      const ruby = createRuby(token);
      const range = document.createRange();
      range.setStart(text, token.start);
      range.setEnd(text, token.end);
      range.deleteContents();
      range.insertNode(ruby);
    }
  }
}

const exclusionParentTagSet = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "RUBY",
  "RT",
  "TITLE",
  "TEXTAREA",
]);
const canAnnotateText = (text: Text): boolean => {
  const parent = text.parentElement;
  return parent !== null && !exclusionParentTagSet.has(parent.tagName) && !parent.isContentEditable;
};

const collectTexts = (element: Element): Text[] => {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (canAnnotateText(node)) {
      texts.push(node);
    }
  }
  return texts;
};

/** Tokenize a batch of texts, returning one array of marks per input text. */
const tokenize = async (texts: string[], furiganaType: FuriganaType): Promise<KanjiMark[][]> => {
  const tokensPerText: KanjiMark[][] = texts.map(() => []);
  // Performance Optimization: This will reduce the number of Service Worker requests by more than 50%.
  const indicesWithKanji = texts.flatMap((text, index) =>
    /\p{sc=Han}/v.test(text) ? [index] : [],
  );
  if (!indicesWithKanji.length) {
    return tokensPerText;
  }
  // One request for the whole batch. A page holds hundreds of text nodes, and asking
  // about them one at a time meant hundreds of serial round trips to the Service
  // Worker, each costing far more than tokenizing the text it carried.
  const { tokens } = await sendMessage("getKanjiMarks", {
    texts: indicesWithKanji.map((index) => texts[index]!),
    furiganaType,
  });
  for (const [position, index] of indicesWithKanji.entries()) {
    tokensPerText[index] = tokens[position] ?? [];
  }
  return tokensPerText;
};

const createRuby = (token: KanjiMark): HTMLElement => {
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

  const readingTextNode = document.createTextNode(token.reading);
  const rt = document.createElement("rt");
  rt.appendChild(readingTextNode);
  ruby.appendChild(originalText);
  ruby.appendChild(leftParenthesisRp);
  ruby.appendChild(rt);
  ruby.appendChild(rightParenthesisRp);
  return ruby;
};
