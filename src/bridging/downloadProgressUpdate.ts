import { ProgressUpdate as NapiProgressUpdate } from '../napi/uzu';

export class DownloadProgressUpdate {
    readonly completedBytes: number;
    readonly totalBytes: number | null;
    readonly progress: number;

    private constructor(completedBytes: number, totalBytes: number | null, progress: number) {
        this.completedBytes = completedBytes;
        this.totalBytes = totalBytes;
        this.progress = progress;
    }

    static fromNapi(napiDownloadProgress: NapiProgressUpdate): DownloadProgressUpdate {
        return new DownloadProgressUpdate(
            napiDownloadProgress.completedBytes,
            napiDownloadProgress.totalBytes ?? null,
            napiDownloadProgress.progress,
        );
    }
}
