import { match } from "ts-pattern";
import { toHiragana, toRomaji } from "wanakana";
import { ExtEvent, ExtStorage, FuriganaType } from "@/commons/constants";
import { onMessage } from "@/commons/message";
import { type KanjiToken, toKanjiToken } from "@/commons/toKanjiToken";
import { initAsync, type Tokenizer, TokenizerBuilder } from "@/commons/tokenize";
import { DB, getGeneralSettings, getKanjiFilterDB } from "@/commons/utils";

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
    await initAsync({
      moduleOrPath: "lindera_wasm_bg.wasm",
    });
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
    const furiganaType = await getGeneralSettings(ExtStorage.FuriganaType);

    const tokenizer = await getTokenizer();
    const mojiTokens = tokenizer.tokenize(data.text);
    const filterMap = await getKanjiFilterMap();
    const tokens = toKanjiToken(mojiTokens, data.text).map((token) => {
      const yomikatas = filterMap.get(token.original);
      const isFiltered =
        yomikatas !== undefined && (yomikatas === "*" || yomikatas.includes(token.reading));
      return {
        ...token,
        reading: match(furiganaType)
          .with(FuriganaType.Hiragana, () => toHiragana(token.reading))
          .with(FuriganaType.Romaji, () => toRomaji(token.reading))
          .with(FuriganaType.Katakana, () => token.reading)
          .exhaustive(),
        isFiltered,
      };
    });

    return { tokens };
  });
};
