import { PrefillStepSize as NapiPrefillStepSize } from '../napi/uzu';
import { ToNapi } from './napi';

export class PrefillStepSize implements ToNapi<NapiPrefillStepSize> {
    private readonly napiPrefillStepSize: NapiPrefillStepSize;

    private constructor(napiPrefillStepSize: NapiPrefillStepSize) {
        this.napiPrefillStepSize = napiPrefillStepSize;
    }

    static default(): PrefillStepSize {
        const napiPrefillStepSize: NapiPrefillStepSize = { type: 'Default' };
        return new PrefillStepSize(napiPrefillStepSize);
    }

    static maximal(): PrefillStepSize {
        const napiPrefillStepSize: NapiPrefillStepSize = { type: 'Maximal' };
        return new PrefillStepSize(napiPrefillStepSize);
    }

    static custom(length: number): PrefillStepSize {
        const napiPrefillStepSize: NapiPrefillStepSize = {
            type: 'Custom',
            length,
        };
        return new PrefillStepSize(napiPrefillStepSize);
    }

    toNapi(): NapiPrefillStepSize {
        return this.napiPrefillStepSize;
    }
}
