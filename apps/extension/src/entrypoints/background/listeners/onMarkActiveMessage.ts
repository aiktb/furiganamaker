import { ExtEvent } from "@/commons/constants";

export const registerOnMarkActiveMessage = () => {
  browser.runtime.onMessage.addListener(async (event, sender) => {
    let fillStyle = null;
    let i18nMessage = null;
    switch (event) {
      case ExtEvent.MarkActiveTab:
        fillStyle = "aqua";
        i18nMessage = browser.i18n.getMessage("extTitleActivated");
        break;
      case ExtEvent.MarkDisabledTab:
        fillStyle = "red";
        i18nMessage = browser.i18n.getMessage("extTitleDisabled");
        break;
      default:
        return;
    }

    const activeTabTitle = `${browser.runtime.getManifest().name} (${i18nMessage})`;
    browser.action.setTitle({
      title: activeTabTitle,
      tabId: sender.tab!.id!,
    });

    const SIZE = 32;
    const iconPath = `/${browser.runtime.getManifest().icons![SIZE]!}`;

    fetch(iconPath)
      .then((response) => response.blob())
      .then((blob) => createImageBitmap(blob))
      .then((imageBitmap) => {
        const canvas = new OffscreenCanvas(SIZE, SIZE);
        const context = canvas.getContext("2d")!;
        context.drawImage(imageBitmap, 0, 0);
        context.fillStyle = fillStyle;
        context.beginPath();
        const RADIUS = 5;
        context.arc(SIZE - RADIUS, SIZE - RADIUS, RADIUS, 0, 2 * Math.PI);
        context.fill();
        const imageData = context.getImageData(0, 0, SIZE, SIZE);
        browser.action.setIcon({ imageData, tabId: sender.tab!.id! });
      });
  });
};
