import { head, last } from "es-toolkit";
import { isKanji, toKatakana } from "wanakana";

import type { FormattedToken } from "./tokenize";

// It's not just kanji, such as "市ヶ谷" (イチガヤ), "我々" (ワレワレ).
export interface KanjiToken {
  original: string;
  reading: string;
  start: number;
  end: number;
}
/**
 * Extract useful kanji phonetic information from lindera tokens.
 * @example
 * ```
 * Input: tokenize('「我々」と「関ケ原」')
 * Output:
 * [
 *  { original: '我々', reading: 'ワレワレ', start: 1, end: 3 },
 *  { original: '関ケ原', reading: 'セキガハラ', start: 6, end: 9 }
 * ]
 * ```
 */
export const toKanjiToken = (linderaTokens: FormattedToken[], text: string): KanjiToken[] => {
  const filteredTokens = linderaTokens
    .filter(isPhonetic)
    .map((token) => toSimplifiedToken(token, text))
    .flatMap(toRubyText);
  return filteredTokens;
};

type LinderaTokenWithDetails = Omit<FormattedToken, "details"> & {
  details: NonNullable<FormattedToken["details"]>;
};

const isPhonetic = (linderaToken: FormattedToken): linderaToken is LinderaTokenWithDetails => {
  const hasKanji = /\p{sc=Han}/v.test(linderaToken.text);
  const hasReading = Boolean(linderaToken.details?.reading && linderaToken.details.reading !== "*");
  return hasReading && hasKanji;
};

interface SimplifiedToken {
  original: string;
  reading: string; // Convert Katakana to Hiragana
  start: number; // Indexes start from 0
  end: number;
}

const toSimplifiedToken = (
  linderaToken: LinderaTokenWithDetails,
  text: string,
): SimplifiedToken => {
  return {
    start: byteIndexToCharIndex(linderaToken.byteStart, text),
    end: byteIndexToCharIndex(linderaToken.byteEnd, text),
    original: linderaToken.text,
    reading: linderaToken.details.reading,
  };
};

function byteIndexToCharIndex(byteIndex: number, text: string): number {
  let bytes = 0;
  let charIndex = 0;
  const encoder = new TextEncoder();
  for (const char of text) {
    bytes += encoder.encode(char).length;
    if (bytes > byteIndex) {
      return charIndex;
    }
    charIndex++;
  }
  return charIndex;
}

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
  const smashed = smashToken(token);
  return smashed;
};

interface MarkToken {
  original: string;
  start: number;
  end: number;
}

type MarkTokenArray = MarkToken[] & { hybridLength: number };

// Must be a mixture of Kanji and Kana to use this function.
const smashToken = (token: SimplifiedToken): KanjiToken[] => {
  const { original, reading, start } = token;
  // Both \p{sc=Hira} and \p{sc=Kana} don’t contain 'ー々', which is bad.
  const kanaRegex = /(\p{sc=Hira}|\p{sc=Kana}|ー)+/dgv;
  const kanaMatches = [...original.matchAll(kanaRegex)];
  const kanaTokens = kanaMatches.map((match) => {
    const [unknownOriginal] = match;
    const [start, end] = head(match.indices!)!;
    return {
      original: toKatakana(unknownOriginal),
      start,
      end,
    };
  });
  const kanas: MarkTokenArray = Object.assign([], kanaTokens, {
    hybridLength: original.length,
  }) satisfies MarkTokenArray;

  const hybridRegex = buildRegex(kanas);
  // The first matching group is the entire string.
  // All that's needed is the sub-capturing group.
  const hybridMatch = reading.match(hybridRegex)?.slice(1);
  const kanjisRegex = /\p{sc=Han}+/dgv;
  const originalKanjiMatches = Array.from(original.matchAll(kanjisRegex));

  // If the number of matching groups is not equal to the number of Kanji,
  // it means that the phonetic notation does not correspond to the text.
  if (!hybridMatch || hybridMatch.length !== originalKanjiMatches.length) {
    return [token];
  }

  const kanjis = originalKanjiMatches.map((match, index) => {
    const [original] = match;
    const [startOffset, endOffset] = head(match.indices!)!;
    return {
      original,
      start: start + startOffset,
      end: start + endOffset,
      reading: hybridMatch[index]!,
    } satisfies KanjiToken;
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
  const firstKana = head(kanas)!;
  const lastKana = last(kanas)!;
  let regexStr = "^";
  const placeholder = "(.+)";
  if (firstKana.start) {
    regexStr += placeholder;
  }
  for (const kana of kanas) {
    regexStr += kana.original;
    if (kana !== lastKana) {
      regexStr += placeholder;
    }
  }
  if (lastKana.end !== kanas.hybridLength) {
    regexStr += placeholder;
  }
  regexStr += "$";
  const regex = new RegExp(regexStr, "v");
  return regex;
};
