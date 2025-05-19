import { isKanji, toKatakana } from "wanakana";

export interface MojiToken {
  word_position: number; // Indexes start from 1
  surface_form: string;
  reading?: string | undefined; // Katakana only
}

// It's not just kanji, such as "市ヶ谷" (イチガヤ), "我々" (ワレワレ).
export interface KanjiToken {
  original: string;
  reading: string;
  start: number; // Indexes start from 0
  end: number;
}
/**
 * Extract useful kanji phonetic information from KuromojiToken[].
 * @example
 * ```
 * Input: tokenizer('「我々」と「関ケ原」')
 * Output:
 * [
 *  { original: '我々', reading: 'ワレワレ', start: 1, end: 3 },
 *  { original: '関ケ原', reading: 'セキガハラ', start: 6, end: 9 }
 * ]
 * ```
 */
export const toKanjiToken = (tokens: MojiToken[]): KanjiToken[] => {
  return tokens.filter(isPhonetic).map(toSimplifiedToken).flatMap(toRubyText);
};

const isPhonetic = (token: MojiToken): boolean => {
  const hasKanji = /\p{sc=Han}/v.test(token.surface_form);
  return Boolean(token.reading && token.reading !== "*" && hasKanji);
};

interface SimplifiedToken {
  original: string;
  reading: string; // Convert Katakana to Hiragana
  start: number; // Indexes start from 0
  end: number;
}

const toSimplifiedToken = (kuromojiToken: MojiToken): SimplifiedToken => {
  return {
    original: kuromojiToken.surface_form,
    reading: kuromojiToken.reading!,
    start: kuromojiToken.word_position - 1,
    end: kuromojiToken.word_position - 1 + kuromojiToken.surface_form.length,
  };
};

const toRubyText = (token: SimplifiedToken): KanjiToken | KanjiToken[] => {
  // The pure Kanji words do not need to be disassembled.
  if (isKanji(token.original)) {
    return {
      original: token.original,
      reading: token.reading,
      start: token.start,
      end: token.end,
    };
  }
  return smashToken(token);
};

interface MarkToken {
  original: string;
  start: number;
  end: number;
}

type MarkTokenArray = MarkToken[] & { hybridLength: number };

// Must be a mixture of Kanji and Kana to use this function.
const smashToken = (token: SimplifiedToken): KanjiToken[] => {
  const { original, reading, start, end } = token;
  // Both \p{sc=Hira} and \p{sc=Kana} don’t contain 'ー々', which is bad.
  const kanaRegex = /(\p{sc=Hira}|\p{sc=Kana}|ー)+/dgv;
  const kanas: MarkTokenArray = [...original.matchAll(kanaRegex)].map((match) => {
    const [unknownOriginal] = match;
    const [start, end] = match.indices![0]!;
    return {
      original: toKatakana(unknownOriginal),
      start,
      end,
    };
  }) as MarkTokenArray;
  kanas.hybridLength = original.length;

  const hybridRegex = buildRegex(kanas);

  const kanjisRegex = /\p{sc=Han}+/dgv;
  const kanjis: KanjiToken[] = [...original.matchAll(kanjisRegex)].map((match) => {
    const [original] = match;
    const [startOffset, endOffset] = match.indices![0]!;
    return {
      original,
      start: start + startOffset,
      end: start + endOffset,
    };
  }) as KanjiToken[];
  // The first matching group is the entire string.
  // All that's needed is the sub-capturing group.
  const hybridMatch = reading.match(hybridRegex)?.slice(1);
  // If the number of matching groups is not equal to the number of Kanji,
  // it means that the phonetic notation does not correspond to the text.
  if (!hybridMatch || hybridMatch.length !== kanjis.length) {
    return [{ original, reading, start, end }];
  }

  kanjis.forEach((kanji, index) => {
    kanji.reading = hybridMatch[index]!;
  });

  return kanjis;
};

// Cases where phonetic notation does not correspond to text create an invalid regular expression.
const buildRegex = (kanas: MarkTokenArray): RegExp => {
  // Match empty string, actual sub-capturing group is 0.
  if (!kanas.length) {
    return /^$/v;
  }
  // "作り方" => "^(.+)リ(.+)$", "り方" => "^リ(.+)$", "作り" => "^(.+)リ$".
  const firstKana = kanas.at(0)!;
  const lastKana = kanas.at(-1)!;
  let regex = "^";
  const placeholder = "(.+)";
  if (firstKana.start) {
    regex += placeholder;
  }
  for (const kana of kanas) {
    regex += kana.original;
    if (kana !== lastKana) {
      regex += placeholder;
    }
  }
  if (lastKana.end !== kanas.hybridLength) {
    regex += placeholder;
  }
  regex += "$";
  return new RegExp(regex, "v");
};
