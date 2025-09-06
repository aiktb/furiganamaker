import wasmInit, { type Tokenizer, TokenizerBuilder } from "lindera-wasm-ipadic";
import { ExtEvent } from "@/commons/constants";
import { onMessage } from "@/commons/message";
import { type KanjiToken, toKanjiToken } from "@/commons/toKanjiToken";
import { DB, getKanjiFilterDB } from "@/commons/utils";

class Deferred {
  promise: Promise<Tokenizer>;
  resolve!: (value: Tokenizer) => void;
  reject!: (reason: Error) => void;
  constructor() {
    this.promise = new Promise<Tokenizer>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

const deferredTokenizer = new Deferred();
let tokenizerIsLoading = true;

const getTokenizer = async () => {
  if (!tokenizerIsLoading) {
    return await deferredTokenizer.promise;
  }
  try {
    await wasmInit({
      module_or_path: "/lindera_wasm_bg.wasm",
    });
    const builder = new TokenizerBuilder();
    builder.setDictionary("embedded://ipadic");
    builder.setMode("normal");
    builder.appendTokenFilter("japanese_compound_word", {
      kind: "ipadic",
      tags: ["名詞,数"],
      new_tag: "名詞,数",
    });
    builder.appendTokenFilter("japanese_number", { tags: ["名詞,数"] });
    const tokenizer = builder.build();
    deferredTokenizer.resolve(tokenizer);
  } catch (error) {
    deferredTokenizer.reject(error as Error);
  } finally {
    tokenizerIsLoading = false;
  }
  return await deferredTokenizer.promise;
};

export interface KanjiMark extends KanjiToken {
  isFiltered: boolean;
}

let kanjiFilterMap: Map<string, string[] | "*"> | null = null;
const getKanjiFilterMap = async () => {
  if (kanjiFilterMap) {
    return kanjiFilterMap;
  }
  const db = await getKanjiFilterDB();
  const filterRules = await db.getAll(DB.onlyTable);
  const filterMap = new Map<string, string[] | "*">(
    filterRules.map((filterRule) => [filterRule.kanji, filterRule.yomikatas ?? "*"]),
  );
  kanjiFilterMap = filterMap;
  return filterMap;
};

export const registerOnGetKanjiMarksMessage = () => {
  browser.runtime.onMessage.addListener((event) => {
    if (event === ExtEvent.ModifyKanjiFilter) {
      kanjiFilterMap = null;
    }
  });
  onMessage("getKanjiMarks", async ({ data }) => {
    const tokenizer = await getTokenizer();
    const mojiTokens = tokenizer.tokenize(data.text);
    const filterMap = await getKanjiFilterMap();
    const tokens = toKanjiToken(mojiTokens, data.text).map((token) => {
      const yomikatas = filterMap.get(token.original);
      const isFiltered =
        yomikatas !== undefined && (yomikatas === "*" || yomikatas.includes(token.reading));
      return {
        ...token,
        isFiltered,
      };
    });

    return { tokens };
  });
};
