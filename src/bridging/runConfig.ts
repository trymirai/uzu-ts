import { RunConfig as NapiRunConfig } from '../napi/uzu';
import { GrammarConfig } from './grammarConfig';
import { ToNapi } from './napi';
import { SamplingPolicy } from './samplingPolicy';

export class RunConfig implements ToNapi<NapiRunConfig> {
    readonly tokensLimit: number;
    readonly enableThinking: boolean;
    readonly samplingPolicy: SamplingPolicy;
    readonly grammarConfig: GrammarConfig | null;

    private constructor(
        tokensLimit: number,
        enableThinking: boolean,
        samplingPolicy: SamplingPolicy,
        grammarConfig: GrammarConfig | null,
    ) {
        this.tokensLimit = tokensLimit;
        this.enableThinking = enableThinking;
        this.samplingPolicy = samplingPolicy;
        this.grammarConfig = grammarConfig;
    }

    static default(): RunConfig {
        return new RunConfig(1024, true, SamplingPolicy.default(), null);
    }

    withTokensLimit(tokensLimit: number): RunConfig {
        return new RunConfig(tokensLimit, this.enableThinking, this.samplingPolicy, this.grammarConfig);
    }

    withEnableThinking(enableThinking: boolean): RunConfig {
        return new RunConfig(this.tokensLimit, enableThinking, this.samplingPolicy, this.grammarConfig);
    }

    withSamplingPolicy(samplingPolicy: SamplingPolicy): RunConfig {
        return new RunConfig(this.tokensLimit, this.enableThinking, samplingPolicy, this.grammarConfig);
    }

    withGrammarConfig(grammarConfig: GrammarConfig | null): RunConfig {
        return new RunConfig(this.tokensLimit, this.enableThinking, this.samplingPolicy, grammarConfig);
    }

    toNapi(): NapiRunConfig {
        const napiSamplingPolicy = this.samplingPolicy.toNapi();
        let napiRunConfig: NapiRunConfig = {
            tokensLimit: this.tokensLimit,
            enableThinking: this.enableThinking,
            samplingPolicy: napiSamplingPolicy,
        };
        if (this.grammarConfig !== null) {
            let napiGrammarConfig = this.grammarConfig.toNapi();
            napiRunConfig.grammarConfig = napiGrammarConfig;
        }
        return napiRunConfig;
    }
}
