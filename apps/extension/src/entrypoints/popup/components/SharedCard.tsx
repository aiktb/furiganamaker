import TelegramSquareIcon from "@/assets/icons/TelegramSquare.svg?react";

import { useTranslation } from "react-i18next";
import {
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import ToolTip from "./ToolTip";

export default function SharedCard() {
  const shareUrl =
    "https://chromewebstore.google.com/detail/furigana-maker/heodojceeinbkfjfilnfminlkgbacpfp";
  const shareItems = [
    {
      ShareButton: TwitterShareButton,
      media: "Twitter",
      Icon: <i className="i-fa6-brands-square-x-twitter text-xl" />,
    },
    {
      ShareButton: FacebookShareButton,
      media: "Facebook",
      Icon: <i className="i-fa6-brands-square-facebook text-xl" />,
    },
    {
      ShareButton: WhatsappShareButton,
      media: "WhatsAPP",
      Icon: <i className="i-fa6-brands-square-whatsapp text-xl" />,
    },
    {
      ShareButton: TelegramShareButton,
      media: "Telegram",
      Icon: <TelegramSquareIcon className="text-xl" />,
    },
    {
      ShareButton: RedditShareButton,
      media: "Reddit",
      Icon: <i className="i-fa6-brands-square-reddit text-xl" />,
    },
  ];

  const { t } = useTranslation();

  return (
    <div className="flex flex-1 items-center gap-1.5 px-2">
      {shareItems.map(({ ShareButton, media, Icon }) => (
        <ToolTip key={media} tip={t("tipShareOn", { media })}>
          <ShareButton
            resetButtonStyle={false}
            className="flex size-5 cursor-pointer items-center justify-center transition hover:text-sky-500 focus-visible:text-sky-500"
            url={shareUrl}
          >
            {Icon}
          </ShareButton>
        </ToolTip>
      ))}
    </div>
  );
}
