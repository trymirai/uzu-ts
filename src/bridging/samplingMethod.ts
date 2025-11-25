import { SamplingMethod as NapiSamplingMethod } from '../napi/uzu';
import { ToNapi } from './napi';

export class SamplingMethod implements ToNapi<NapiSamplingMethod> {
    private readonly napiSamplingMethod: NapiSamplingMethod;

    private constructor(napiSamplingMethod: NapiSamplingMethod) {
        this.napiSamplingMethod = napiSamplingMethod;
    }

    static greedy(): SamplingMethod {
        const napiSamplingMethod: NapiSamplingMethod = { type: 'Greedy' };
        return new SamplingMethod(napiSamplingMethod);
    }

    static stochastic(temperature: number | null, topK: number | null, topP: number | null): SamplingMethod {
        let napiSamplingMethod: NapiSamplingMethod = {
            type: 'Stochastic',
        };
        if (temperature !== null) {
            napiSamplingMethod.temperature = temperature;
        }
        if (topK !== null) {
            napiSamplingMethod.topK = topK;
        }
        if (topP !== null) {
            napiSamplingMethod.topP = topP;
        }
        return new SamplingMethod(napiSamplingMethod);
    }

    toNapi(): NapiSamplingMethod {
        return this.napiSamplingMethod;
    }
}
