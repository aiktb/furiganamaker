import { defineExtensionMessaging } from "@webext-core/messaging";
import type { KanjiMark } from "@/entrypoints/background/listeners/onGetKanjiMarksMessage";

interface ProtocolMap {
  getKanjiMarks(data: { text: string }): { tokens: KanjiMark[] };
  getSelector(data: { domain: string }): { selector: string };
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
