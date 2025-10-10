import { EngineError, EngineErrorCode } from '../error';
import { FinishReason as NapiFinishReason, Output as NapiOutput } from '../napi/uzu';
import { FinishReason } from './finishReason';
import { Stats } from './stats';
import { Text } from './text';

export class Output {
    readonly text: Text;
    readonly stats: Stats;
    readonly finishReason: FinishReason | null;

    private constructor(text: Text, stats: Stats, finishReason: FinishReason | null) {
        this.text = text;
        this.stats = stats;
        this.finishReason = finishReason;
    }

    private static napiFinishReasonToFinishReason(napiFinishReason: NapiFinishReason): FinishReason {
        switch (napiFinishReason) {
            case 0:
                return FinishReason.Stop;
            case 1:
                return FinishReason.Length;
            case 2:
                return FinishReason.Cancelled;
            case 3:
                return FinishReason.ContextLimitReached;
            default:
                throw new EngineError(EngineErrorCode.UnexpectedFinishReason);
        }
    }

    static fromNapi(napiEntity: NapiOutput): Output {
        const text = Text.fromNapi(napiEntity.text);
        const stats = Stats.fromNapi(napiEntity.stats);
        const finishReason =
            napiEntity.finishReason ? Output.napiFinishReasonToFinishReason(napiEntity.finishReason) : null;
        return new Output(text, stats, finishReason);
    }
}
