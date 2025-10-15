import { ModelType as NapiModelType } from '../napi/uzu';

export enum ModelType {
    Local = 'Local',
    Cloud = 'Cloud',
}

export function modelTypeToNapi(modelType: ModelType): NapiModelType {
    switch (modelType) {
        case ModelType.Local:
            return 0;
        case ModelType.Cloud:
            return 1;
    }
}
