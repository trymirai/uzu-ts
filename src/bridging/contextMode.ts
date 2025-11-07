import { ContextMode as NapiContextMode, Input as NapiInput } from '../napi/uzu';
import { Input } from './input';
import { ToNapi } from './napi';

export class ContextMode implements ToNapi<NapiContextMode> {
    private readonly napiContextMode: NapiContextMode;

    private constructor(napiContextMode: NapiContextMode) {
        this.napiContextMode = napiContextMode;
    }

    static none(): ContextMode {
        const napiContextMode: NapiContextMode = { type: 'None' };
        return new ContextMode(napiContextMode);
    }

    static static(input: Input): ContextMode {
        let napiInput: NapiInput = input.toNapi();
        let napiContextMode: NapiContextMode = { type: 'Static', input: napiInput };
        return new ContextMode(napiContextMode);
    }

    static dynamic(): ContextMode {
        const napiContextMode: NapiContextMode = { type: 'Dynamic' };
        return new ContextMode(napiContextMode);
    }

    toNapi(): NapiContextMode {
        return this.napiContextMode;
    }
}
