import { StepStats as NapiStepStats } from '../napi/uzu';
import { RunStats } from './runStats';

export class StepStats {
    readonly duration: number;
    readonly suffixLength: number;
    readonly tokensCount: number;
    readonly tokensPerSecond: number;
    readonly processedTokensPerSecond: number;
    readonly modelRun: RunStats;
    readonly run: RunStats | null;

    private constructor(
        duration: number,
        suffixLength: number,
        tokensCount: number,
        tokensPerSecond: number,
        processedTokensPerSecond: number,
        modelRun: RunStats,
        run: RunStats | null,
    ) {
        this.duration = duration;
        this.suffixLength = suffixLength;
        this.tokensCount = tokensCount;
        this.tokensPerSecond = tokensPerSecond;
        this.processedTokensPerSecond = processedTokensPerSecond;
        this.modelRun = modelRun;
        this.run = run;
    }

    static fromNapi(napiEntity: NapiStepStats): StepStats {
        const duration = napiEntity.duration;
        const suffixLength = Number(napiEntity.suffixLength);
        const tokensCount = Number(napiEntity.tokensCount);
        const tokensPerSecond = napiEntity.tokensPerSecond;
        const processedTokensPerSecond = napiEntity.processedTokensPerSecond;
        const modelRun = RunStats.fromNapi(napiEntity.modelRun);
        const run = napiEntity.run ? RunStats.fromNapi(napiEntity.run) : null;
        return new StepStats(
            duration,
            suffixLength,
            tokensCount,
            tokensPerSecond,
            processedTokensPerSecond,
            modelRun,
            run,
        );
    }
}
