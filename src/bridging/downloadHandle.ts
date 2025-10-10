import { ModelDownloadHandle as NapiModelDownloadHandle } from '../napi/uzu';
import { DownloadProgressUpdate } from './downloadProgressUpdate';
import { DownloadState } from './downloadState';

export class DownloadHandle {
    private readonly napiDownloadHandle: NapiModelDownloadHandle;

    constructor(napiDownloadHandle: NapiModelDownloadHandle) {
        this.napiDownloadHandle = napiDownloadHandle;
    }

    identifier(): string {
        return this.napiDownloadHandle.identifier();
    }

    async state(): Promise<DownloadState> {
        const napiDownloadState = await this.napiDownloadHandle.state();
        return DownloadState.fromNapi(napiDownloadState);
    }

    async download(): Promise<void> {
        await this.napiDownloadHandle.download();
    }

    async pause(): Promise<void> {
        await this.napiDownloadHandle.pause();
    }

    async delete(): Promise<void> {
        await this.napiDownloadHandle.delete();
    }

    progressUpdate(): AsyncIterable<DownloadProgressUpdate> {
        const source = this.napiDownloadHandle.progress();
        return (async function* () {
            for await (const update of source) {
                yield DownloadProgressUpdate.fromNapi(update);
            }
        })();
    }
}
