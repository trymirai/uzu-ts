import { TotalStats as NapiTotalStats } from '../napi/uzu';

export class TotalStats {
    readonly duration: number;
    readonly tokensCountInput: number;
    readonly tokensCountOutput: number;

    private constructor(duration: number, tokensCountInput: number, tokensCountOutput: number) {
        this.duration = duration;
        this.tokensCountInput = tokensCountInput;
        this.tokensCountOutput = tokensCountOutput;
    }

    static fromNapi(napiEntity: NapiTotalStats): TotalStats {
        const duration = napiEntity.duration;
        const tokensCountInput = Number(napiEntity.tokensCountInput);
        const tokensCountOutput = Number(napiEntity.tokensCountOutput);
        return new TotalStats(duration, tokensCountInput, tokensCountOutput);
    }
}
