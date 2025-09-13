import _initAsync, {
  type Tokenizer as _Tokenizer,
  TokenizerBuilder as _TokenizerBuilder,
  type InitInput,
} from "lindera-wasm-ipadic";

export type LinderaToken = Map<string, unknown>;

export const IPADIC_DETAILS_KEYS = [
  "partOfSpeech",
  "partOfSpeechSubcategory1",
  "partOfSpeechSubcategory2",
  "partOfSpeechSubcategory3",
  "conjugationForm",
  "conjugationType",
  "baseForm",
  "reading",
  "pronunciation",
] as const;

export type IpadicDetailsKeys = (typeof IPADIC_DETAILS_KEYS)[number];

export type IpadicDetailsObject = {
  [K in (typeof IPADIC_DETAILS_KEYS)[number]]: string;
};

export type FormattedToken = {
  byteEnd: number;
  byteStart: number;
  text: string;
  wordId: {
    id: number;
    isSystem: boolean;
  };
  details?: IpadicDetailsObject | undefined;
};

const typeSafeObjectFromEntries = <const T extends ReadonlyArray<readonly [PropertyKey, unknown]>>(
  entries: T,
): { [K in T[number] as K[0]]: K[1] } => {
  return Object.fromEntries(entries) as { [K in T[number] as K[0]]: K[1] };
};

function detailsArrayToObject(details: string[]): IpadicDetailsObject {
  return typeSafeObjectFromEntries(IPADIC_DETAILS_KEYS.map((key, i) => [key, details[i]!]));
}

export class Tokenizer {
  #superTokenizer: _Tokenizer;
  #tokensFormatter(tokens: LinderaToken[]): FormattedToken[] {
    return tokens.map((token) => {
      const originalDetails = token.get("details") as string[] | undefined;
      const formattedDetails = originalDetails && detailsArrayToObject(originalDetails);
      return {
        byteEnd: token.get("byte_end") as number,
        byteStart: token.get("byte_start") as number,
        text: token.get("text") as string,
        wordId: {
          id: token.get("word_id") as number,
          isSystem: token.get("is_system") as boolean,
        },
        details: formattedDetails,
      };
    });
  }
  constructor(tokenizer: _Tokenizer) {
    this.#superTokenizer = tokenizer;
  }
  tokenize(inputText: string): FormattedToken[] {
    const originalTokens = this.#superTokenizer.tokenize(inputText);
    return this.#tokensFormatter(originalTokens);
  }
}
export class TokenizerBuilder {
  #superTokenizerBuilder: _TokenizerBuilder;
  constructor() {
    this.#superTokenizerBuilder = new _TokenizerBuilder();
  }
  build(): Tokenizer {
    this.#superTokenizerBuilder.setDictionary("embedded://ipadic");
    this.#superTokenizerBuilder.setMode("normal");
    this.#superTokenizerBuilder.appendCharacterFilter("unicode_normalize", { kind: "nfkc" });
    this.#superTokenizerBuilder.appendTokenFilter("lowercase", {});
    this.#superTokenizerBuilder.appendTokenFilter("japanese_compound_word", {
      kind: "ipadic",
      tags: ["名詞,数"],
      new_tag: "名詞,数",
    });
    const superTokenizer = this.#superTokenizerBuilder.build();
    return new Tokenizer(superTokenizer);
  }
}

export async function initAsync(options?: { moduleOrPath: InitInput }): Promise<void> {
  await _initAsync(options);
}
