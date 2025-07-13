import { ExtEvent } from "@/commons/constants";
import { onMessage } from "@/commons/message";
import { type KanjiToken, type MojiToken, toKanjiToken } from "@/commons/toKanjiToken";
import { DB, getKanjiFilterDB } from "@/commons/utils";
import kuromoji from "@sglkc/kuromoji";

interface Tokenizer {
  tokenize: (text: string) => MojiToken[];
}

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
    const builder = kuromoji.builder({
      dicPath: "/dict",
    });
    builder.build((err: undefined | Error, tokenizer: Tokenizer) => {
      if (err) {
        deferredTokenizer.reject(err);
      } else {
        deferredTokenizer.resolve(tokenizer);
      }
    });
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
    const tokens = toKanjiToken(mojiTokens).map((token) => {
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
