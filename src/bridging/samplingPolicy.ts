import { SamplingPolicy as NapiSamplingPolicy } from '../napi/uzu';
import { ToNapi } from './napi';
import { SamplingMethod } from './samplingMethod';

export class SamplingPolicy implements ToNapi<NapiSamplingPolicy> {
    private readonly napiSamplingPolicy: NapiSamplingPolicy;

    private constructor(napiSamplingPolicy: NapiSamplingPolicy) {
        this.napiSamplingPolicy = napiSamplingPolicy;
    }

    static default(): SamplingPolicy {
        const napiSamplingPolicy: NapiSamplingPolicy = { type: 'Default' };
        return new SamplingPolicy(napiSamplingPolicy);
    }

    static custom(method: SamplingMethod): SamplingPolicy {
        const napiSamplingMethod = method.toNapi();
        const napiSamplingPolicy: NapiSamplingPolicy = {
            type: 'Custom',
            value: napiSamplingMethod,
        };
        return new SamplingPolicy(napiSamplingPolicy);
    }

    toNapi(): NapiSamplingPolicy {
        return this.napiSamplingPolicy;
    }
}
