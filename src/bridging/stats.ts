import { Stats as NapiStats } from '../napi/uzu';
import { StepStats } from './stepStats';
import { TotalStats } from './totalStats';

export class Stats {
    readonly prefillStats: StepStats;
    readonly generateStats: StepStats | null;
    readonly totalStats: TotalStats;

    private constructor(prefillStats: StepStats, generateStats: StepStats | null, totalStats: TotalStats) {
        this.prefillStats = prefillStats;
        this.generateStats = generateStats;
        this.totalStats = totalStats;
    }

    static fromNapi(napiEntity: NapiStats): Stats {
        const prefillStats = StepStats.fromNapi(napiEntity.prefillStats);
        const generateStats = napiEntity.generateStats ? StepStats.fromNapi(napiEntity.generateStats) : null;
        const totalStats = TotalStats.fromNapi(napiEntity.totalStats);
        return new Stats(prefillStats, generateStats, totalStats);
    }
}
