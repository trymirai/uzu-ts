import { CloudModel as NapiCloudModel, LocalModel as NapiLocalModel } from '../napi/uzu';

export enum ModelType {
    Local = 'local',
    Cloud = 'cloud',
}

export enum ModelKind {
    Text = 'text',
}

export class Model {
    readonly repoId: string;
    readonly type: ModelType;
    readonly kind: ModelKind;
    readonly name: string;
    readonly vendor: string;
    readonly isThinking: boolean;

    private constructor(
        repoId: string,
        type: ModelType,
        kind: ModelKind,
        name: string,
        vendor: string,
        isThinking: boolean,
    ) {
        this.repoId = repoId;
        this.type = type;
        this.kind = kind;
        this.name = name;
        this.vendor = vendor;
        this.isThinking = isThinking;
    }

    static fromNapiLocalModel(napiLocalModel: NapiLocalModel): Model {
        return new Model(
            napiLocalModel.identifier,
            ModelType.Local,
            ModelKind.Text,
            napiLocalModel.name,
            napiLocalModel.vendor,
            napiLocalModel.outputParserRegex !== undefined,
        );
    }

    static fromNapiCloudModel(napiCloudModel: NapiCloudModel): Model {
        return new Model(
            napiCloudModel.repoId,
            ModelType.Cloud,
            ModelKind.Text,
            napiCloudModel.name,
            napiCloudModel.vendor,
            napiCloudModel.outputParserRegex !== undefined,
        );
    }
}
