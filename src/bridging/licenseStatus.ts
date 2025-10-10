import { EngineError, EngineErrorCode } from '../error';
import { LicenseStatus as NapiLicenseStatus } from '../napi/uzu';

export enum LicenseStatus {
    NotActivated = 'NotActivated',
    PaymentRequired = 'PaymentRequired',
    GracePeriodActive = 'GracePeriodActive',
    Activated = 'Activated',
    NetworkError = 'NetworkError',
    InvalidApiKey = 'InvalidApiKey',
    SignatureMismatch = 'SignatureMismatch',
    Timeout = 'Timeout',
    HttpError = 'HttpError',
}

export function licenseStatusFromNapiLicenseStatus(napiLicenseStatus: NapiLicenseStatus): LicenseStatus {
    switch (napiLicenseStatus.type) {
        case 'NotActivated':
            return LicenseStatus.NotActivated;
        case 'PaymentRequired':
            return LicenseStatus.PaymentRequired;
        case 'GracePeriodActive':
            return LicenseStatus.GracePeriodActive;
        case 'Activated':
            return LicenseStatus.Activated;
        case 'NetworkError':
            return LicenseStatus.NetworkError;
        case 'InvalidApiKey':
            return LicenseStatus.InvalidApiKey;
        case 'SignatureMismatch':
            return LicenseStatus.SignatureMismatch;
        case 'Timeout':
            return LicenseStatus.Timeout;
        case 'HttpError':
            return LicenseStatus.HttpError;
        default:
            throw new EngineError(EngineErrorCode.UnexpectedLicenseStatus);
    }
}
