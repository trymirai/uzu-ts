export enum EngineErrorCode {
    APIKeyNotFound = 'apiKeyNotFound',
    ModelNotFound = 'modelNotFound',
    ExpectedLocalModel = 'expectedLocalModel',
    UnexpectedDownloadPhase = 'unexpectedDownloadPhase',
    UnexpectedFinishReason = 'unexpectedFinishReason',
    UnexpectedLicenseStatus = 'unexpectedLicenseStatus',
    UnexpectedModelType = 'unexpectedModelType',
    LicenseNotActivated = 'licenseNotActivated',
    Unknown = 'unknown',
}

const errorCodeToMessage = {
    [EngineErrorCode.APIKeyNotFound]: 'API key not found',
    [EngineErrorCode.ModelNotFound]: 'Model not found',
    [EngineErrorCode.ExpectedLocalModel]: 'Expected local model',
    [EngineErrorCode.UnexpectedDownloadPhase]: 'Unexpected download phase',
    [EngineErrorCode.UnexpectedFinishReason]: 'Unexpected finish reason',
    [EngineErrorCode.UnexpectedLicenseStatus]: 'Unexpected license status',
    [EngineErrorCode.UnexpectedModelType]: 'Unexpected model type',
    [EngineErrorCode.LicenseNotActivated]: 'License not activated',
    [EngineErrorCode.Unknown]: 'Unknown error',
};

export class EngineError extends Error {
    constructor(code: EngineErrorCode) {
        const message = errorCodeToMessage[code] ?? errorCodeToMessage[EngineErrorCode.Unknown];
        super(message);
        this.name = 'EngineError';
    }
}

export function unwrapOrThrow<T>(value: T | null | undefined, errorCode: EngineErrorCode): T {
    if (value === null || value === undefined) {
        throw new EngineError(errorCode);
    }
    return value;
}
