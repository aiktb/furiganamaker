import { tokenize } from "kuromojin";
import { expect, test } from "vitest";

import { type MojiToken, toKanjiToken } from "../../src/commons/toKanjiToken";

test("Basic test 1", async () => {
  const kuromojiTokens = await tokenize("「僕は耳と目を閉じ、口を噤んだ人間になろうと考えた」");
  expect(toKanjiToken(kuromojiTokens)).toEqual([
    { original: "僕", reading: "ボク", start: 1, end: 2 },
    { original: "耳", reading: "ミミ", start: 3, end: 4 },
    { original: "目", reading: "メ", start: 5, end: 6 },
    { original: "閉", reading: "ト", start: 7, end: 8 },
    { original: "口", reading: "クチ", start: 10, end: 11 },
    { original: "噤", reading: "ツグ", start: 12, end: 13 },
    { original: "人間", reading: "ニンゲン", start: 15, end: 17 },
    { original: "考", reading: "カンガ", start: 22, end: 23 },
  ]);
});

test("Basic test 2", async () => {
  const kuromojiTokens = await tokenize(
    "我々はその月の一日にその不動産の所有者が変わることで合意した",
  );
  expect(toKanjiToken(kuromojiTokens)).toEqual([
    { original: "我々", reading: "ワレワレ", start: 0, end: 2 },
    { original: "月", reading: "ツキ", start: 5, end: 6 },
    { original: "一", reading: "イチ", start: 7, end: 8 },
    { original: "日", reading: "ニチ", start: 8, end: 9 },
    { original: "不動産", reading: "フドウサン", start: 12, end: 15 },
    { original: "所有", reading: "ショユウ", start: 16, end: 18 },
    { original: "者", reading: "シャ", start: 18, end: 19 },
    { original: "変", reading: "カ", start: 20, end: 21 },
    { original: "合意", reading: "ゴウイ", start: 26, end: 28 },
  ]);
});

test("Basic test 3", async () => {
  const kuromojiTokens = await tokenize(
    "コラボ駅名板デザインのキーホルダーとかあったら欲しいけどなぁ",
  );
  expect(toKanjiToken(kuromojiTokens)).toEqual([
    { original: "駅名", reading: "エキメイ", start: 3, end: 5 },
    { original: "板", reading: "イタ", start: 5, end: 6 },
    { original: "欲", reading: "ホ", start: 23, end: 24 },
  ]);
});

test("Input is empty array", async () => {
  const kuromojiTokens = await tokenize("");
  expect(toKanjiToken(kuromojiTokens)).toEqual([]);
});

test("Unnecessary attributes", () => {
  const kuromojiTokens: MojiToken[] = [
    { word_position: 1, reading: "キミ", surface_form: "君" },
    { word_position: 2, reading: "ノ", surface_form: "の" },
    { word_position: 3, reading: "レッシャ", surface_form: "列車" },
    { word_position: 5, reading: "ワ", surface_form: "は" },
    { word_position: 6, reading: "セイゾン", surface_form: "生存" },
    { word_position: 8, reading: "センリャク", surface_form: "戦略" },
  ];
  expect(toKanjiToken(kuromojiTokens)).toEqual([
    { original: "君", reading: "キミ", start: 0, end: 1 },
    { original: "列車", reading: "レッシャ", start: 2, end: 4 },
    { original: "生存", reading: "セイゾン", start: 5, end: 7 },
    { original: "戦略", reading: "センリャク", start: 7, end: 9 },
  ]);
});

test('reading is "*"', () => {
  // fake example
  const kuromojiTokens: MojiToken[] = [{ word_position: 1, reading: "*", surface_form: "我" }];
  expect(toKanjiToken(kuromojiTokens)).toEqual([]);
});

test("Known kuromoji bugs", async () => {
  const kuromojiTokens = await tokenize("巨乳");
  expect(toKanjiToken(kuromojiTokens)).toEqual([
    { original: "乳", reading: "チチ", start: 1, end: 2 },
  ]);
});

test("Special case", () => {
  const kuromojiTokens: MojiToken[] = [
    { word_position: 1, reading: "シチガツ", surface_form: "７月" },
    { word_position: 1, reading: "レイ", surface_form: "〇" },
    { word_position: 1, reading: "セキガハラ", surface_form: "関ケ原" },
    { word_position: 1, reading: "ローマジ", surface_form: "ローマ字" },
  ];
  expect(toKanjiToken(kuromojiTokens)).toEqual([
    { original: "７月", reading: "シチガツ", start: 0, end: 2 },
    { original: "〇", reading: "レイ", start: 0, end: 1 },
    { original: "関ケ原", reading: "セキガハラ", start: 0, end: 3 },
    { original: "字", reading: "ジ", start: 3, end: 4 },
  ]);
});
