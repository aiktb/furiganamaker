import { match } from "ts-pattern";
import { toHiragana, toRomaji } from "wanakana";
import { ExtEvent, FuriganaType } from "@/commons/constants";
import { onMessage } from "@/commons/message";
import { type KanjiToken, toKanjiToken } from "@/commons/toKanjiToken";
import { initAsync, type Tokenizer, TokenizerBuilder } from "@/commons/tokenize";
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
    await initAsync();
    const builder = new TokenizerBuilder();
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
  jlptLevel?: string;
}

interface KanjiFilterEntry {
  yomikatas: string[] | "*";
  jlptLevel?: string | undefined;
}

let kanjiFilterMap: Map<string, KanjiFilterEntry> | null = null;
const getKanjiFilterMap = async () => {
  if (kanjiFilterMap) {
    return kanjiFilterMap;
  }
  const db = await getKanjiFilterDB();
  const filterRules = await db.getAll(DB.onlyTable);
  const filterMap = new Map<string, KanjiFilterEntry>(
    filterRules.map((filterRule) => [
      filterRule.kanji,
      {
        yomikatas: filterRule.yomikatas ?? "*",
        jlptLevel: filterRule.jlptLevel,
      },
    ]),
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
      const filterEntry = filterMap.get(token.original);
      const isFiltered =
        filterEntry !== undefined &&
        (filterEntry.yomikatas === "*" || filterEntry.yomikatas.includes(token.reading));
      const result: KanjiMark = {
        ...token,
        reading: match(data.furiganaType)
          .with(FuriganaType.Hiragana, () => toHiragana(token.reading))
          .with(FuriganaType.Romaji, () => toRomaji(token.reading))
          .with(FuriganaType.Katakana, () => token.reading)
          .exhaustive(),
        isFiltered,
      };
      if (filterEntry?.jlptLevel) {
        result.jlptLevel = filterEntry.jlptLevel;
      }
      return result;
    });

    return { tokens };
  });
};
