import fs from "node:fs";
import defaultRules from "@/assets/rules/filter.json" with { type: "json" };
import { DB } from "@/constants";
import { describe, expect, test } from "../fixtures";
import { cleanRubyHtml } from "../utils";

describe("Extension options page", () => {
  test.beforeEach(async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/options.html`);
  });

  test("Hash routes are able to navigate correctly", async ({ page, extensionId }) => {
    const rulesEditorLink = page.getByRole("link", { name: "Settings" });
    await expect(rulesEditorLink).toBeVisible();
    await expect(rulesEditorLink).toHaveAttribute("href", "/options.html#/");
    await expect(rulesEditorLink).toHaveAttribute("aria-current", "page");
    const changelogLink = page.getByRole("link", { name: "Changelog" });
    await expect(changelogLink).toHaveAttribute("href", "/options.html#/changelog");
    await changelogLink.click();
    expect(page.url()).toBe(`chrome-extension://${extensionId}/options.html#/changelog`);
    await expect(changelogLink).toHaveAttribute("aria-current", "page");
    await expect(rulesEditorLink).not.toHaveAttribute("aria-current", "page");
    await page.reload();
    await expect(changelogLink).toHaveAttribute("aria-current", "page");
    await page.goBack();
    await expect(rulesEditorLink).toHaveAttribute("aria-current", "page");
    await page.goForward();
    await expect(changelogLink).toHaveAttribute("aria-current", "page");
  });

  test("Unknown hash routes can return to settings", async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/options.html#/missing-route`);
    await expect(page.getByText("Not Found", { exact: true })).toBeVisible();
    await page.getByRole("link", { name: "Go back to the Home Page" }).click();
    await expect(page.getByRole("link", { name: "Settings", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("Toggle theme to Dark/Light ", async ({ page }) => {
    const getThemeLocalStorage = async () => {
      return await page.evaluate("localStorage.getItem('theme')");
    };

    expect(await getThemeLocalStorage()).toBeNull();
    expect((await page.getAttribute("html", "class"))?.includes("dark")).toBeFalsy();
    const toggle = page.getByRole("button", { name: "Toggle Theme Mode" });

    await toggle.click();
    expect((await page.getAttribute("html", "class"))?.includes("dark")).toBeTruthy();
    expect(await getThemeLocalStorage()).toBe("dark");

    await toggle.click();
    expect((await page.getAttribute("html", "class"))?.includes("dark")).toBeFalsy();
    expect(await getThemeLocalStorage()).toBe("light");
  });
});

describe("Kanji filter page", () => {
  const PAGE_SELECTOR = ".playwright-kanji-filter-page";
  const FILTER_ITEM_SELECTOR = ".playwright-kanji-filter-item";
  test.beforeEach(async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/options.html#/kanji-filter`);
    await page.waitForSelector(PAGE_SELECTOR);
    // The container renders as soon as the route mounts, but the rules are read from
    // IndexedDB after that, so waiting for the container alone finds an empty list.
    await page.waitForSelector(FILTER_ITEM_SELECTOR);
  });

  test("Default kanji filters are loaded", async ({ page }) => {
    const kanjiElements = await page.$$(FILTER_ITEM_SELECTOR);
    expect(kanjiElements.length).toBe(100);
    const firstKanji = await kanjiElements.at(0)!.innerText();
    expect(firstKanji).toContain("#1");
    expect(firstKanji).toContain("一");
    expect(firstKanji).toContain("イチ, ヒト");
    const secondKanji = await kanjiElements.at(1)!.innerText();
    expect(secondKanji).toContain("#2");
    expect(secondKanji).toContain("一人");
    expect(secondKanji).toContain("ヒトリ");
  });

  test("Pagination and search cover all rules", async ({ page }) => {
    await page.evaluate(
      ({ name, onlyTable, kanji }) =>
        new Promise<void>((resolve, reject) => {
          const request = indexedDB.open(name);
          request.onerror = () => reject(request.error);
          request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction(onlyTable, "readwrite");
            tx.objectStore(onlyTable).put({ kanji });
            tx.oncomplete = () => {
              db.close();
              resolve();
            };
            tx.onerror = () => reject(tx.error);
          };
        }),
      { name: DB.name, onlyTable: DB.onlyTable, kanji: defaultRules.at(-1)!.kanji },
    );
    await page.reload();
    const items = page.locator(FILTER_ITEM_SELECTOR);
    await expect(items).toHaveCount(100);
    const next = page.getByRole("button", { name: "Next", exact: true });
    const previous = page.getByRole("button", { name: "Previous", exact: true });
    await expect(previous).toBeDisabled();
    await next.click();
    await expect(items).toHaveCount(100);
    await expect(items.first()).toContainText("#101");
    await previous.click();
    await expect(items.first()).toContainText("#1");
    for (let i = 1; i < Math.ceil(defaultRules.length / 100); i++) {
      await next.click();
    }
    await expect(next).toBeDisabled();
    await expect(items).toHaveCount(defaultRules.length % 100 || 100);

    const search = page.getByRole("searchbox");
    const lastKanji = defaultRules.at(-1)!.kanji;
    await search.fill(lastKanji);
    await expect(previous).toBeDisabled();
    await expect(items.filter({ hasText: lastKanji }).first()).toBeVisible();
    await search.fill("ヒトリ");
    await expect(items.filter({ hasText: "一人" }).first()).toBeVisible();
    await search.fill("no-such-kanji");
    await expect(items).toHaveCount(0);
    await expect(page.getByText("No matching rules.")).toBeVisible();
    await expect(next).toBeDisabled();
    await search.fill("");
    await expect(items).toHaveCount(100);
    await page.getByRole("switch", { name: "Only Match ALL rules" }).check();
    await expect(items).toHaveCount(1);
    await expect(items.first()).toContainText("Match ALL");
    await search.fill(lastKanji);
    await expect(items).toHaveCount(1);
    await search.fill("一人");
    await expect(items).toHaveCount(0);
  });

  test("Delete first kanji filter", async ({ page }) => {
    const kanjiElements = await page.$$(FILTER_ITEM_SELECTOR);
    const kanjiElementCount = defaultRules.length;
    const firstKanjiElement = kanjiElements.at(0)!;
    const firstKanjiText = await firstKanjiElement.innerText();

    const deleteBtn = await firstKanjiElement.$(".playwright-kanji-filter-item-delete-btn");
    expect(deleteBtn).toBeTruthy();
    await deleteBtn!.click();
    const confirmBtn = page.getByRole("button", { name: "Confirm" });
    expect(confirmBtn).toBeTruthy();
    await confirmBtn.click();
    await expect(confirmBtn).toBeHidden();
    expect(await firstKanjiElement.isVisible()).toBeFalsy();

    await expect
      .poll(async () => {
        return await page.evaluate(
          ({ name, onlyTable }) =>
            new Promise<number>((resolve, reject) => {
              const openRequest = indexedDB.open(name);
              openRequest.onerror = () => reject(openRequest.error);
              openRequest.onsuccess = () => {
                const countRequest = openRequest.result
                  .transaction(onlyTable, "readonly")
                  .objectStore(onlyTable)
                  .count();
                countRequest.onerror = () => reject(countRequest.error);
                countRequest.onsuccess = () => resolve(countRequest.result);
              };
            }),
          { name: DB.name, onlyTable: DB.onlyTable },
        );
      })
      .toBe(kanjiElementCount - 1);

    await page.reload();
    await page.waitForSelector(PAGE_SELECTOR);
    await page.waitForSelector(FILTER_ITEM_SELECTOR);
    const reloadKanjiElements = await page.$$(FILTER_ITEM_SELECTOR);
    expect(reloadKanjiElements.length).toBe(100);
    const firstReloadKanjiText = await reloadKanjiElements.at(0)!.innerText();
    expect(firstReloadKanjiText).not.toContain(firstKanjiText);
  });

  test("Clear all kanji filters", async ({ page }) => {
    expect(await page.$(FILTER_ITEM_SELECTOR)).toBeTruthy();
    const clearBtn = await page.$(".playwright-kanji-filter-clear-config-btn");
    expect(clearBtn).toBeTruthy();
    await clearBtn!.click();
    const confirmBtn = page.getByRole("button", { name: "Confirm" });
    expect(confirmBtn).toBeTruthy();
    await confirmBtn.click();
    await expect(confirmBtn).toBeHidden();
    await page.waitForSelector(".playwright-not-found-mark");
    expect(await page.$(FILTER_ITEM_SELECTOR)).toBeNull();
    expect(await clearBtn!.isDisabled()).toBeTruthy();

    await page.reload();
    await page.waitForSelector(PAGE_SELECTOR);
    // An empty list looks identical before and after the rules are read from
    // IndexedDB, so the DOM cannot show that the clear was persisted. Read the
    // database instead, which is what this half of the test is really about.
    const persistedCount = await page.evaluate(
      ({ name, onlyTable }) =>
        new Promise<number>((resolve, reject) => {
          const openRequest = indexedDB.open(name);
          openRequest.onerror = () => reject(openRequest.error);
          openRequest.onsuccess = () => {
            const countRequest = openRequest.result
              .transaction(onlyTable, "readonly")
              .objectStore(onlyTable)
              .count();
            countRequest.onerror = () => reject(countRequest.error);
            countRequest.onsuccess = () => resolve(countRequest.result);
          };
        }),
      { name: DB.name, onlyTable: DB.onlyTable },
    );
    expect(persistedCount).toBe(0);
    expect(await page.$(FILTER_ITEM_SELECTOR)).toBeNull();
  });

  test("Export kanji filters file with JSON format", async ({ page }) => {
    const exportBtn = await page.$(".playwright-kanji-filter-export-config-btn");
    const downloadPromise = page.waitForEvent("download");
    expect(exportBtn).toBeTruthy();
    await exportBtn!.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("furigana-maker-kanji-filter.json");
    const path = await download.path();
    const content = fs.readFileSync(path!, "utf-8");
    const json = JSON.parse(content);
    expect(json).toBeInstanceOf(Array);
    const kanjiElements = await page.$$(FILTER_ITEM_SELECTOR);
    const kanjiElementsCount = kanjiElements.length;
    expect((json as unknown[]).length).toBeGreaterThanOrEqual(kanjiElementsCount);
    expect((json as unknown[])[0]).toEqual({
      kanji: "一",
      yomikatas: ["イチ", "ヒト"],
    });

    const firstKanjiElement = await page.$(`${FILTER_ITEM_SELECTOR}:nth-child(1)`);
    expect(firstKanjiElement).toBeTruthy();
    const deleteBtn = await firstKanjiElement!.$(".playwright-kanji-filter-item-delete-btn");
    expect(deleteBtn).toBeTruthy();
    await deleteBtn!.click();
    const confirmBtn = page.getByRole("button", { name: "Confirm" });
    expect(confirmBtn).toBeTruthy();
    await confirmBtn.click();
    const newDownloadPromise = page.waitForEvent("download");
    await exportBtn!.click();
    const newDownload = await newDownloadPromise;
    const newPath = await newDownload.path();
    const newContent = fs.readFileSync(newPath!, "utf-8");
    const newJson = JSON.parse(newContent);
    expect(newJson).toBeInstanceOf(Array);
    expect((newJson as unknown[]).length).toBeGreaterThanOrEqual(kanjiElementsCount - 1);
    expect((newJson as unknown[])[0]).toEqual({
      kanji: "一人",
      yomikatas: ["ヒトリ"],
    });
  });
});

describe("Playground works fine", () => {
  test.beforeEach(async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/options.html#/playground`);
  });
  test("Emoji in the textarea works fine", async ({ page }) => {
    const textarea = page.getByTestId("playground-japanese-textarea");
    await expect(textarea).toBeVisible();
    const previewArea = page.getByTestId("playground-furigana-preview-area");
    await expect(previewArea).toBeVisible();
    await textarea.fill("😊漢字テスト");
    await textarea.blur();
    await page.waitForSelector("ruby");
    const expectedHTML = `<div>😊<ruby>漢字<rt>かんじ</rt></ruby>テスト</div>`;
    expect(cleanRubyHtml(await previewArea.innerHTML())).toBe(expectedHTML);
  });
  test("Radio buttons to toggle furigana type works", async ({ page }) => {
    const textarea = page.getByTestId("playground-japanese-textarea");
    await expect(textarea).toBeVisible();

    const furiganaTypeHiragana = page.getByRole("radio", { name: "ひらがな" });
    const furiganaTypeKatakana = page.getByRole("radio", { name: "カタカナ" });
    const furiganaTypeRomaji = page.getByRole("radio", { name: "Romaji" });

    // Default is hiragana
    await expect(furiganaTypeHiragana).toBeChecked();
    await expect(furiganaTypeKatakana).not.toBeChecked();
    await expect(furiganaTypeRomaji).not.toBeChecked();

    const previewArea = page.getByTestId("playground-furigana-preview-area");
    await expect(previewArea).toBeVisible();
    await textarea.fill("漢字テスト");
    await textarea.blur();
    await page.waitForSelector("ruby");
    const expectedHTML = `<div><ruby>漢字<rt>かんじ</rt></ruby>テスト</div>`;
    expect(cleanRubyHtml(await previewArea.innerHTML())).toBe(expectedHTML);

    await furiganaTypeKatakana.click();
    await expect(furiganaTypeHiragana).not.toBeChecked();
    await expect(furiganaTypeKatakana).toBeChecked();
    const expectedHTMLKatakana = `<div><ruby>漢字<rt>カンジ</rt></ruby>テスト</div>`;
    expect(cleanRubyHtml(await previewArea.innerHTML())).toBe(expectedHTMLKatakana);

    await furiganaTypeRomaji.click();
    await expect(furiganaTypeHiragana).not.toBeChecked();
    await expect(furiganaTypeRomaji).toBeChecked();
    const expectedHTMLRomaji = `<div><ruby>漢字<rt>kanji</rt></ruby>テスト</div>`;
    expect(cleanRubyHtml(await previewArea.innerHTML())).toBe(expectedHTMLRomaji);
  });
});
