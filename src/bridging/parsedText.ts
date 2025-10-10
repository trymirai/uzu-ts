import { ParsedText as NapiParsedText } from '../napi/uzu';

export class ParsedText {
    readonly chainOfThought: string | null;
    readonly response: string | null;

    private constructor(chainOfThought: string | null, response: string | null) {
        this.chainOfThought = chainOfThought;
        this.response = response;
    }

    static fromNapi(napiEntity: NapiParsedText): ParsedText {
        const chainOfThought = napiEntity.chainOfThought ?? null;
        const response = napiEntity.response ?? null;
        return new ParsedText(chainOfThought, response);
    }
}
