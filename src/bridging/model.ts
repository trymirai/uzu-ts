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

    private constructor(repoId: string, type: ModelType, kind: ModelKind, name: string) {
        this.repoId = repoId;
        this.type = type;
        this.kind = kind;
        this.name = name;
    }

    static fromNapiLocalModel(napiLocalModel: NapiLocalModel): Model {
        return new Model(napiLocalModel.identifier, ModelType.Local, ModelKind.Text, napiLocalModel.name);
    }

    static fromNapiCloudModel(napiCloudModel: NapiCloudModel): Model {
        return new Model(napiCloudModel.repoId, ModelType.Cloud, ModelKind.Text, napiCloudModel.name);
    }
}
