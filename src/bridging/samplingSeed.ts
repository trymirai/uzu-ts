import { SamplingSeed as NapiSamplingSeed } from '../napi/uzu';
import { ToNapi } from './napi';

export class SamplingSeed implements ToNapi<NapiSamplingSeed> {
    private readonly napiSamplingSeed: NapiSamplingSeed;

    private constructor(napiSamplingSeed: NapiSamplingSeed) {
        this.napiSamplingSeed = napiSamplingSeed;
    }

    static default(): SamplingSeed {
        const napiSamplingSeed: NapiSamplingSeed = { type: 'Default' };
        return new SamplingSeed(napiSamplingSeed);
    }

    static custom(seed: number): SamplingSeed {
        const napiSamplingSeed: NapiSamplingSeed = { type: 'Custom', seed };
        return new SamplingSeed(napiSamplingSeed);
    }

    toNapi(): NapiSamplingSeed {
        return this.napiSamplingSeed;
    }
}
