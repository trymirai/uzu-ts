import { DownloadHandle } from '../bridging/downloadHandle';
import { DownloadProgressUpdate } from '../bridging/downloadProgressUpdate';
import { Interactor, InteractorEntity } from './interactor';
import { ModelInteractor } from './modelInteractor';

export class DownloadInteractor implements Interactor<DownloadHandle> {
    readonly modelInteractor: ModelInteractor;
    readonly entity: InteractorEntity<DownloadHandle>;

    constructor(modelInteractor: ModelInteractor, handle: InteractorEntity<DownloadHandle>) {
        this.modelInteractor = modelInteractor;
        this.entity = handle;
    }

    async finalize(): Promise<DownloadHandle> {
        return await this.entity;
    }

    resume() {
        return this.proxyHandleCall(async (handle) => await handle.download());
    }

    pause() {
        return this.proxyHandleCall(async (handle) => await handle.pause());
    }

    delete() {
        return this.proxyHandleCall(async (handle) => await handle.delete());
    }

    onProgressUpdate(callback: (progressUpdate: DownloadProgressUpdate) => void) {
        return this.proxyHandleCall(async (handle) => {
            for await (const update of handle.progressUpdate()) {
                callback(update);
            }
        });
    }

    private proxyHandleCall(callback: (handle: DownloadHandle) => Promise<void>): DownloadInteractor {
        const handlePromise = (async () => {
            const handle = await this.finalize();
            await callback(handle);
            return handle;
        })();
        return new DownloadInteractor(this.modelInteractor, handlePromise);
    }
}
