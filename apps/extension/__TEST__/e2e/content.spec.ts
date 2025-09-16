import { describe, expect, test } from "../fixtures";
import { cleanRubyHtml } from "../utils";

describe("Content scripts", () => {
  test("Automatically add furigana when lang is ja", async ({ page }) => {
    const url = "https://example.org/test-ja";
    const html = `<!doctype html>
      <html lang="ja">
      <head>
        <meta charset="utf-8" />
      </head>
      <body>
        <main>
          <p id="test1">😊漢字テスト</p>
          <p id="test2">This is English.</p>
          <p id="test3">「僕は耳と目を閉じ、口を噤んだ人間になろうと考えた」</p>
          <p id="test4">我々はその月の一日にその不動産の所有者が変わることで合意した</p>
          <p id="test5">コラボ駅名板デザインのキーホルダーとかあったら欲しいけどなぁ</p>
          <p id="test6">７月〇日に関ケ原でローマ字の勉強をしました。</p>
        </main>
      </body>
      </html>`;

    await page.route(url, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/html; charset=utf-8",
        body: html,
      });
    });
    await page.goto(url);
    await page.waitForSelector("body ruby");

    const pHtmlTest1 = await page.$eval("#test1", (el) => el.innerHTML);
    expect(cleanRubyHtml(pHtmlTest1)).toBe("😊<ruby>漢字<rt>かんじ</rt></ruby>テスト");
    const pHtmlTest2 = await page.$eval("#test2", (el) => el.innerHTML);
    expect(cleanRubyHtml(pHtmlTest2)).toBe("This is English.");
    const pHtmlTest3 = await page.$eval("#test3", (el) => el.innerHTML);
    expect(cleanRubyHtml(pHtmlTest3)).toBe(
      "「<ruby>僕<rt>ぼく</rt></ruby>は<ruby>耳<rt>みみ</rt></ruby>と<ruby>目<rt>め</rt></ruby>を<ruby>閉<rt>と</rt></ruby>じ、<ruby>口<rt>くち</rt></ruby>を<ruby>噤<rt>つぐ</rt></ruby>んだ<ruby>人間<rt>にんげん</rt></ruby>になろうと<ruby>考<rt>かんが</rt></ruby>えた」",
    );
    const pHtmlTest4 = await page.$eval("#test4", (el) => el.innerHTML);
    expect(cleanRubyHtml(pHtmlTest4)).toBe(
      "<ruby>我々<rt>われわれ</rt></ruby>はその<ruby>月<rt>つき</rt></ruby>の<ruby>一<rt>いち</rt></ruby><ruby>日<rt>にち</rt></ruby>にその<ruby>不動産<rt>ふどうさん</rt></ruby>の<ruby>所有<rt>しょゆう</rt></ruby><ruby>者<rt>しゃ</rt></ruby>が<ruby>変<rt>か</rt></ruby>わることで<ruby>合意<rt>ごうい</rt></ruby>した",
    );
    const pHtmlTest5 = await page.$eval("#test5", (el) => el.innerHTML);
    expect(cleanRubyHtml(pHtmlTest5)).toBe(
      "コラボ<ruby>駅名<rt>えきめい</rt></ruby><ruby>板<rt>いた</rt></ruby>デザインのキーホルダーとかあったら<ruby>欲<rt>ほ</rt></ruby>しいけどなぁ",
    );
    const pHtmlTest6 = await page.$eval("#test6", (el) => el.innerHTML);
    expect(cleanRubyHtml(pHtmlTest6)).toBe(
      "７<ruby>月<rt>つき</rt></ruby><ruby>〇<rt>れい</rt></ruby><ruby>日<rt>にち</rt></ruby>に<ruby>関ケ原<rt>せきがはら</rt></ruby>でローマ<ruby>字<rt>じ</rt></ruby>の<ruby>勉強<rt>べんきょう</rt></ruby>をしました。",
    );
  });

  test("ruby is added only in body, not in head title", async ({ page }) => {
    const url = "https://example.org/test-ja";
    const html = `<!doctype html>
      <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <title>日本語タイトル</title>
      </head>
      <body>
        <p>漢字テスト</p>
      </body>
      </html>`;

    await page.route(url, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/html; charset=utf-8",
        body: html,
      });
    });

    await page.goto(url);
    // Wait for the body to be loaded & ruby auto added
    await page.waitForSelector("body ruby");

    const headRubyCount = await page.$$eval("head ruby", (els) => els.length);
    expect(headRubyCount).toBe(0);

    const title = await page.title();
    expect(title).toBe("日本語タイトル");

    const bodyRubyCount = await page.$$eval("body ruby", (els) => els.length);
    expect(bodyRubyCount).toBeGreaterThan(0);
  });
});
