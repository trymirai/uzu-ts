import { EngineError, EngineErrorCode, unwrapOrThrow } from '../error';
import { EngineInteractor } from '../interactors/engineInteractor';
import { Engine as NapiEngine, ModelID as NapiModelID } from '../napi/uzu';
import { readEnv } from '../utilities/env';
import { Config } from './config';
import { DownloadHandle } from './downloadHandle';
import { LicenseStatus, licenseStatusFromNapiLicenseStatus } from './licenseStatus';
import { Model, ModelKind, ModelType } from './model';
import { Session } from './session';

export class Engine {
    private readonly napiEngine: NapiEngine;

    private constructor(napiEngine: NapiEngine) {
        this.napiEngine = napiEngine;
    }

    static async load(apiKey: string | undefined = undefined): Promise<Engine> {
        const resolvedApiKey = unwrapOrThrow(
            apiKey ?? readEnv('MIRAI_API_KEY'),
            EngineErrorCode.APIKeyNotFound,
        );

        const napiEngine = new NapiEngine();

        const napiLicenseStatus = await napiEngine.activate(resolvedApiKey);
        const licenseStatus = licenseStatusFromNapiLicenseStatus(napiLicenseStatus);
        switch (licenseStatus) {
            case LicenseStatus.Activated:
            case LicenseStatus.GracePeriodActive:
                break;
            default:
                throw new EngineError(EngineErrorCode.LicenseNotActivated);
        }

        return new Engine(napiEngine);
    }

    static create(apiKey: string | undefined = undefined): EngineInteractor {
        const enginePromise = (async () => {
            return await Engine.load(apiKey);
        })();
        return new EngineInteractor(enginePromise);
    }

    async models(types: ModelType[] | null = null, kinds: ModelKind[] | null = null): Promise<Model[]> {
        function isTypeAllowed(type: ModelType): boolean {
            return types === null || types.includes(type);
        }

        function isKindAllowed(kind: ModelKind): boolean {
            return kinds === null || kinds.includes(kind);
        }

        let results: Model[] = [];
        if (isTypeAllowed(ModelType.Local) && isKindAllowed(ModelKind.Text)) {
            const napiLocalModels = this.napiEngine.getLocalModels();
            results.push(...napiLocalModels.map(Model.fromNapiLocalModel));
        }
        if (isTypeAllowed(ModelType.Cloud) && isKindAllowed(ModelKind.Text)) {
            const napiCloudModels = await this.napiEngine.getCloudModels();
            results.push(...napiCloudModels.map(Model.fromNapiCloudModel));
        }
        return results;
    }

    async model(repoId: string): Promise<Model> {
        const models = await this.models();
        const model = models.find((model) => model.repoId === repoId);
        return unwrapOrThrow(model, EngineErrorCode.ModelNotFound);
    }

    downloadHandle(model: Model): DownloadHandle {
        if (model.type !== ModelType.Local) {
            throw new EngineError(EngineErrorCode.ExpectedLocalModel);
        }
        return new DownloadHandle(this.napiEngine.downloadHandle(model.repoId));
    }

    private static napiModelId(model: Model): NapiModelID {
        switch (model.type) {
            case ModelType.Local:
                return { type: 'Local', id: model.repoId };
            case ModelType.Cloud:
                return { type: 'Cloud', id: model.repoId };
        }
    }

    session(model: Model, config: Config = Config.default()): Session {
        if (model.kind !== ModelKind.Text) {
            throw new EngineError(EngineErrorCode.ExpectedTextModel);
        }
        const napiModelId = Engine.napiModelId(model);
        const napiConfig = config.toNapi();
        return new Session(this.napiEngine.createSession(napiModelId, napiConfig));
    }
}
