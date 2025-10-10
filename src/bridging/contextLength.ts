import { ContextLength as NapiContextLength } from '../napi/uzu';
import { ToNapi } from './napi';

export class ContextLength implements ToNapi<NapiContextLength> {
    private readonly napiContextLength: NapiContextLength;

    private constructor(napiContextLength: NapiContextLength) {
        this.napiContextLength = napiContextLength;
    }

    static default(): ContextLength {
        const napiContextLength: NapiContextLength = { type: 'Default' };
        return new ContextLength(napiContextLength);
    }

    static maximal(): ContextLength {
        const napiContextLength: NapiContextLength = { type: 'Maximal' };
        return new ContextLength(napiContextLength);
    }

    static custom(length: number): ContextLength {
        const napiContextLength: NapiContextLength = { type: 'Custom', length };
        return new ContextLength(napiContextLength);
    }

    toNapi(): NapiContextLength {
        return this.napiContextLength;
    }
}
