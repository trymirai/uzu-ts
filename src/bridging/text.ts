import { Text as NapiText } from '../napi/uzu';
import { ParsedText } from './parsedText';

export class Text {
    readonly original: string;
    readonly parsed: ParsedText;

    private constructor(original: string, parsed: ParsedText) {
        this.original = original;
        this.parsed = parsed;
    }

    static fromNapi(napiEntity: NapiText): Text {
        const original = napiEntity.original;
        const parsed = ParsedText.fromNapi(napiEntity.parsed);
        return new Text(original, parsed);
    }
}
