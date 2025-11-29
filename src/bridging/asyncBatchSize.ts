import { AsyncBatchSize as NapiAsyncBatchSize } from '../napi/uzu';
import { ToNapi } from './napi';

export class AsyncBatchSize implements ToNapi<NapiAsyncBatchSize> {
    private readonly napiAsyncBatchSize: NapiAsyncBatchSize;

    private constructor(napiAsyncBatchSize: NapiAsyncBatchSize) {
        this.napiAsyncBatchSize = napiAsyncBatchSize;
    }

    static default(): AsyncBatchSize {
        const napiAsyncBatchSize: NapiAsyncBatchSize = { type: 'Default' };
        return new AsyncBatchSize(napiAsyncBatchSize);
    }

    static custom(size: number): AsyncBatchSize {
        const napiAsyncBatchSize: NapiAsyncBatchSize = { type: 'Custom', size };
        return new AsyncBatchSize(napiAsyncBatchSize);
    }

    toNapi(): NapiAsyncBatchSize {
        return this.napiAsyncBatchSize;
    }
}
