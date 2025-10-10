import { RunStats as NapiRunStats } from '../napi/uzu';

export class RunStats {
    readonly count: number;
    readonly averageDuration: number;

    private constructor(count: number, averageDuration: number) {
        this.count = count;
        this.averageDuration = averageDuration;
    }

    static fromNapi(napiEntity: NapiRunStats): RunStats {
        const count = Number(napiEntity.count);
        const averageDuration = napiEntity.averageDuration;
        return new RunStats(count, averageDuration);
    }
}
