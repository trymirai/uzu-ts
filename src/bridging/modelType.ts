import { EngineError, EngineErrorCode } from '../error';
import { ModelType as NapiModelType } from '../napi/uzu';

export enum ModelType {
    Local = 'Local',
    Cloud = 'Cloud',
}

export function modelTypeFromNapiModelType(napiModelType: NapiModelType): ModelType {
    switch (napiModelType) {
        case 0:
            return ModelType.Local;
        case 1:
            return ModelType.Cloud;
        default:
            throw new EngineError(EngineErrorCode.UnexpectedModelType);
    }
}

export function modelTypeToNapiModelType(modelType: ModelType): NapiModelType {
    switch (modelType) {
        case ModelType.Local:
            return 0;
        case ModelType.Cloud:
            return 1;
    }
}
