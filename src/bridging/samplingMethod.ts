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

    static temperature(temperature: number): SamplingMethod {
        const napiSamplingMethod: NapiSamplingMethod = {
            type: 'Temperature',
            temperature,
        };
        return new SamplingMethod(napiSamplingMethod);
    }

    static topP(topP: number): SamplingMethod {
        const napiSamplingMethod: NapiSamplingMethod = { type: 'TopP', topP };
        return new SamplingMethod(napiSamplingMethod);
    }

    toNapi(): NapiSamplingMethod {
        return this.napiSamplingMethod;
    }
}
