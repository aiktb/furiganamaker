import { describe, expect, test } from "../fixtures";
import { cleanRubyHtml } from "../utils";

describe("Content scripts", () => {
  test("excludes textareas and editable text during initial and dynamic annotation", async ({
    page,
  }) => {
    const url = "https://example.org/test-editable-exclusions";
    await page.route(url, (route) =>
      route.fulfill({
        contentType: "text/html; charset=utf-8",
        body: `<!doctype html>
          <html lang="ja"><body>
            <textarea data-excluded>漢字テスト</textarea>
            <code data-readable>漢字テスト</code>
            <code><span lang="ja" data-readable>漢字テスト</span></code>
            <div contenteditable="true" data-excluded>漢字テスト</div>
            <div contenteditable="true"><span lang="ja" data-excluded>漢字テスト</span></div>
            <div contenteditable="" data-excluded>漢字テスト</div>
            <div contenteditable="plaintext-only" data-excluded>漢字テスト</div>
            <div contenteditable="true"><span contenteditable="invalid" data-excluded>漢字テスト</span></div>
            <div contenteditable="false" data-readable>漢字テスト</div>
            <div contenteditable="true"><span contenteditable="false" data-readable>漢字テスト</span></div>
            <p data-readable>漢字テスト</p>
          </body></html>`,
      }),
    );
    await page.goto(url);

    const expectAnnotations = async (text: string) => {
      await expect(page.locator("[data-readable] ruby")).toHaveCount(5);
      await expect(page.locator("[data-excluded] ruby")).toHaveCount(0);
      await expect(page.locator("[data-excluded]")).toHaveText(Array(6).fill(text));
      await expect(page.locator("textarea")).toHaveValue(text);
    };
    await expectAnnotations("漢字テスト");

    // Exercise repeated editor changes, including text-only mutations and newly
    // inserted highlighting spans whose excluded ancestor is outside the walker.
    for (const text of ["日本語", "漢字", "日本語"]) {
      await page.evaluate((value) => {
        for (const element of document.querySelectorAll("[data-excluded]")) {
          element.firstChild!.textContent = value;
        }
        for (const element of document.querySelectorAll("[data-readable]")) {
          element.textContent = value;
        }
        const span = document.createElement("span");
        span.textContent = value;
        document
          .querySelector("[contenteditable='true'] > span[data-excluded]")!
          .replaceChildren(span);
      }, text);
      await expectAnnotations(text);
    }
  });

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

    await expect(page.locator("head ruby")).toHaveCount(0);

    await expect(page).toHaveTitle("日本語タイトル");

    await expect(page.locator("body ruby")).not.toHaveCount(0);
  });

  test("Automatically add furigana when a matching element is added dynamically", async ({
    page,
  }) => {
    const url = "https://example.org/test-dynamic-matching-element";
    const html = `<!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
      </head>
      <body>
        <main id="root"></main>
        <script>
          setTimeout(() => {
            const p = document.createElement("p");
            p.id = "target";
            p.lang = "ja";
            p.textContent = "漢字テスト";
            document.querySelector("#root").appendChild(p);
          }, 50);
        </script>
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
    await page.waitForSelector("#target ruby");

    const htmlWithRuby = await page.$eval("#target", (el) => el.innerHTML);
    expect(cleanRubyHtml(htmlWithRuby)).toBe("<ruby>漢字<rt>かんじ</rt></ruby>テスト");
  });

  test("Automatically add furigana when text is added inside an existing Japanese container", async ({
    page,
  }) => {
    const url = "https://example.org/test-dynamic-text";
    const html = `<!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
      </head>
      <body>
        <main lang="ja">
          <p id="target"></p>
        </main>
        <script>
          setTimeout(() => {
            document.querySelector("#target").textContent = "日本語タイトル";
          }, 50);
        </script>
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
    await page.waitForSelector("#target ruby");

    const htmlWithRuby = await page.$eval("#target", (el) => el.innerHTML);
    expect(cleanRubyHtml(htmlWithRuby)).toBe("<ruby>日本語<rt>にほんご</rt></ruby>タイトル");
  });

  test("furigana styles are injected carrying the current settings", async ({ page }) => {
    const url = "https://example.org/test-styles";
    // Note this document declares no <head> of its own, so the parser supplies it.
    const html = `<!doctype html>
      <html lang="ja">
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
    await page.waitForSelector("body ruby");

    // `toContainText` reads rendered text, and a <style> renders nothing, so the
    // stylesheet has to be read straight off the element.
    const css = await page.evaluate(
      () => document.getElementById("--furigana--styles")?.textContent,
    );
    expect(css).toBeTruthy();
    // The default font size, proving the settings actually reached the stylesheet.
    expect(css).toContain("font-size: 75%");
    expect(css).toContain("ruby.--furigana-- > rt");
  });

  test("shouldProcess follows include/exclude settings configured from options page", async ({
    page,
    extensionId,
  }) => {
    const url = "https://example.org/test-should-process";
    const html = `<!doctype html>
      <html lang="ja">
      <head>
        <meta charset="utf-8" />
      </head>
      <body>
        <p id="target">漢字テスト</p>
      </body>
      </html>`;

    await page.route(url, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/html; charset=utf-8",
        body: html,
      });
    });

    const optionsUrl = `chrome-extension://${extensionId}/options.html#/`;
    const includeAddButton = page.getByTestId("settings-includeSites-add-btn");
    const includeInput = page.getByTestId("settings-includeSites-input");
    const includeSubmit = page.getByTestId("settings-includeSites-submit-btn");
    const includeClear = page.getByTestId("settings-includeSites-clear-btn");
    const includeList = page.getByTestId("settings-includeSites-list");
    const excludeAddButton = page.getByTestId("settings-excludedSites-add-btn");
    const excludeInput = page.getByTestId("settings-excludedSites-input");
    const excludeSubmit = page.getByTestId("settings-excludedSites-submit-btn");
    const excludeClear = page.getByTestId("settings-excludedSites-clear-btn");

    await page.goto(optionsUrl);

    await includeClear.click();
    await page.getByTestId("settings-includeSites-clear-confirm-btn").click();
    await excludeClear.click();
    await page.getByTestId("settings-excludedSites-clear-confirm-btn").click();
    await expect
      .poll(async () => {
        return await page.evaluate(async () => {
          const { moreSettings } = await browser.storage.local.get<{
            moreSettings: { includeSites: string[] };
          }>("moreSettings");
          return moreSettings?.includeSites;
        });
      })
      .toEqual([]);
    await expect
      .poll(async () => {
        return await page.evaluate(async () => {
          const { moreSettings } = await browser.storage.local.get<{
            moreSettings: { excludeSites: string[] };
          }>("moreSettings");
          return moreSettings?.excludeSites;
        });
      })
      .toEqual([]);

    await page.goto(url);
    await expect(page.locator("body ruby")).toHaveCount(0);

    await page.goto(optionsUrl);
    await includeAddButton.click();
    await includeInput.fill("example.org");
    await includeSubmit.click();
    await expect(includeList).toContainText("example.org");
    await expect
      .poll(async () => {
        return await page.evaluate(async () => {
          const { moreSettings } = await browser.storage.local.get<{
            moreSettings: { includeSites: string[] };
          }>("moreSettings");
          return moreSettings?.includeSites;
        });
      })
      .toEqual(["example.org"]);

    await page.goto(url);
    await page.waitForSelector("body ruby");
    const includedHtml = await page.$eval("#target", (el) => el.innerHTML);
    expect(cleanRubyHtml(includedHtml)).toBe("<ruby>漢字<rt>かんじ</rt></ruby>テスト");

    await page.goto(optionsUrl);
    await excludeAddButton.click();
    await excludeInput.fill("example.org");
    await excludeSubmit.click();
    await expect
      .poll(async () => {
        return await page.evaluate(async () => {
          const { moreSettings } = await browser.storage.local.get<{
            moreSettings: { excludeSites: string[] };
          }>("moreSettings");
          return moreSettings?.excludeSites;
        });
      })
      .toEqual(["example.org"]);

    await page.goto(url);
    await expect(page.locator("body ruby")).toHaveCount(0);
  });
});
