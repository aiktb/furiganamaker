import kuromoji from "@sglkc/kuromoji";
import { type DBSchema, openDB } from "idb";

import type { FilterRule } from "@/commons/constants";
import { onMessage } from "@/commons/message";
import { type KanjiToken, type MojiToken, toKanjiToken } from "@/commons/toKanjiToken";

import defaultKanjiFilterRules from "@/assets/rules/filter.json";

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
const DATABASE = {
  name: "kanjiFilterDB",
  version: 1,
  onlyTable: "kanjiFilterTable",
} as const;
interface KanjiFilterDB extends DBSchema {
  [DATABASE.onlyTable]: {
    key: string;
    value: FilterRule;
  };
}

const kanjiFilterMap: Promise<Map<string, string[]>> | null = null;
const getKanjiFilterMap = async () => {
  if (kanjiFilterMap) {
    return kanjiFilterMap;
  }
  const db = await openDB<KanjiFilterDB>(DATABASE.name, DATABASE.version, {
    /**
     * @param transaction
     * Don't use `db.transaction(...)`, the upgrade callback will run a version change transaction,
     * and new transactions can't be created until this transaction ends.
     */
    upgrade(db, _, __, transaction) {
      db.createObjectStore(DATABASE.onlyTable, { keyPath: "kanji" });
      const store = transaction.objectStore(DATABASE.onlyTable);
      for (const rule of defaultKanjiFilterRules) {
        store.put(rule);
      }
    },
  });
  const filterRules = await db.getAll(DATABASE.onlyTable);
  const filterMap = new Map<string, string[]>(
    filterRules.map((filterRule) => [filterRule.kanji, filterRule.reading]),
  );
  return filterMap;
};
export const registerOnGetKanjiMarksMessage = () => {
  onMessage("getKanjiMarks", async ({ data }) => {
    const tokenizer = await getTokenizer();
    const mojiTokens = tokenizer.tokenize(data.text);
    const filterMap = await getKanjiFilterMap();
    const tokens = toKanjiToken(mojiTokens).map((token) => {
      return {
        ...token,
        isFiltered: filterMap.get(token.original)?.includes(token.reading) ?? false,
      };
    });

    return { tokens };
  });
};
