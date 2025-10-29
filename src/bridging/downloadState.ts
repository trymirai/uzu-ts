import { EngineError, EngineErrorCode } from '../error';
import {
    ModelDownloadPhase as NapiModelDownloadPhase,
    ModelDownloadState as NapiModelDownloadState,
} from '../napi/uzu';

export enum DownloadPhase {
    NotDownloaded = 'NotDownloaded',
    Downloading = 'Downloading',
    Paused = 'Paused',
    Downloaded = 'Downloaded',
    Locked = 'Locked',
    Error = 'Error',
}

export class DownloadState {
    readonly totalKbytes: number;
    readonly downloadedKbytes: number;
    readonly phase: DownloadPhase;
    readonly error: string | null;

    private constructor(
        totalKbytes: number,
        downloadedKbytes: number,
        phase: DownloadPhase,
        error: string | null,
    ) {
        this.totalKbytes = totalKbytes;
        this.downloadedKbytes = downloadedKbytes;
        this.phase = phase;
        this.error = error;
    }

    private static napiPhaseToDownloadPhase(napiPhase: NapiModelDownloadPhase): DownloadPhase {
        switch (napiPhase) {
            case 0:
                return DownloadPhase.NotDownloaded;
            case 1:
                return DownloadPhase.Downloading;
            case 2:
                return DownloadPhase.Paused;
            case 3:
                return DownloadPhase.Downloaded;
            case 4:
                return DownloadPhase.Locked;
            case 5:
                return DownloadPhase.Error;
            default:
                throw new EngineError(EngineErrorCode.UnexpectedDownloadPhase);
        }
    }

    static fromNapi(napiDownloadState: NapiModelDownloadState): DownloadState {
        const phase = DownloadState.napiPhaseToDownloadPhase(napiDownloadState.phase);
        return new DownloadState(
            napiDownloadState.totalKbytes,
            napiDownloadState.downloadedKbytes,
            phase,
            napiDownloadState.error ?? null,
        );
    }
}
