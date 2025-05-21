import { onMessage } from "@/commons/message";
import kuromoji from "@sglkc/kuromoji";

import { type KanjiToken, type MojiToken, toKanjiToken } from "@/commons/toKanjiToken";

// `filter.json` exceeded chrome.storage.local` maximum limit.
import filterList from "@/assets/rules/filter.json";

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

const deferred = new Deferred();
let isLoading = false;

const getTokenizer = async () => {
  if (isLoading) {
    return await deferred.promise;
  }
  isLoading = true;
  const builder = kuromoji.builder({
    dicPath: "/dict",
  });
  builder.build((err: undefined | Error, tokenizer: Tokenizer) => {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(tokenizer);
    }
  });
  return await deferred.promise;
};

export interface KanjiMark extends KanjiToken {
  isFiltered: boolean;
}

export const registerOnGetKanjiMarksMessage = () => {
  onMessage("getKanjiMarks", async ({ data }) => {
    const tokenizer = await getTokenizer();
    const mojiTokens = tokenizer.tokenize(data.text);
    const filterMap = new Map<string, string[]>(
      filterList.map((filterRule) => [filterRule.kanji, filterRule.reading]),
    );
    const tokens = toKanjiToken(mojiTokens).map((token) => {
      return {
        ...token,
        isFiltered:
          filterMap.has(token.original) && filterMap.get(token.original)!.includes(token.reading),
      };
    });

    return { tokens };
  });
};
