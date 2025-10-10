import { RunConfig as NapiRunConfig } from '../napi/uzu';
import { ToNapi } from './napi';
import { SamplingPolicy } from './samplingPolicy';

export class RunConfig implements ToNapi<NapiRunConfig> {
    readonly tokensLimit: number;
    readonly enableThinking: boolean;
    readonly samplingPolicy: SamplingPolicy;

    private constructor(tokensLimit: number, enableThinking: boolean, samplingPolicy: SamplingPolicy) {
        this.tokensLimit = tokensLimit;
        this.enableThinking = enableThinking;
        this.samplingPolicy = samplingPolicy;
    }

    static default(): RunConfig {
        return new RunConfig(1024, true, SamplingPolicy.default());
    }

    withTokensLimit(tokensLimit: number): RunConfig {
        return new RunConfig(tokensLimit, this.enableThinking, this.samplingPolicy);
    }

    withEnableThinking(enableThinking: boolean): RunConfig {
        return new RunConfig(this.tokensLimit, enableThinking, this.samplingPolicy);
    }

    withSamplingPolicy(samplingPolicy: SamplingPolicy): RunConfig {
        return new RunConfig(this.tokensLimit, this.enableThinking, samplingPolicy);
    }

    toNapi(): NapiRunConfig {
        const napiSamplingPolicy = this.samplingPolicy.toNapi();
        const napiRunConfig: NapiRunConfig = {
            tokensLimit: this.tokensLimit,
            enableThinking: this.enableThinking,
            samplingPolicy: napiSamplingPolicy,
        };
        return napiRunConfig;
    }
}
