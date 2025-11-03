import { EngineError, EngineErrorCode, unwrapOrThrow } from '../error';
import { EngineInteractor } from '../interactors/engineInteractor';
import { Engine as NapiEngine } from '../napi/uzu';
import { readEnv } from '../utilities/env';
import { ChatModel } from './chatModel';
import { ChatSession } from './chatSession';
import { Config } from './config';
import { DownloadHandle } from './downloadHandle';
import { DownloadProgressUpdate } from './downloadProgressUpdate';
import { DownloadPhase, DownloadState } from './downloadState';
import { LicenseStatus, licenseStatusFromNapiLicenseStatus } from './licenseStatus';
import { ModelType, modelTypeToNapiModelType } from './modelType';

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

    getDownloadState(repoId: string): DownloadState {
        let downloadState = this.napiEngine.getModelDownloadState(repoId);
        return DownloadState.fromNapi(downloadState);
    }

    downloadHandle(repoId: string): DownloadHandle {
        return new DownloadHandle(this.napiEngine.createModelDownloadHandle(repoId));
    }

    async chatModels(types: ModelType[] | null = null): Promise<ChatModel[]> {
        let typesToFilter: ModelType[] = types ?? [ModelType.Local, ModelType.Cloud];
        let napiModelTypes = typesToFilter.map(modelTypeToNapiModelType);
        let napiChatModels = await this.napiEngine.getChatModels(napiModelTypes);
        let results: ChatModel[] = napiChatModels.map(ChatModel.fromNapiChatModel);
        return results;
    }

    async chatModel(repoId: string, types: ModelType[] | null = null): Promise<ChatModel> {
        const chatModels = await this.chatModels(types);
        const chatModel = chatModels.find((model) => model.repoId === repoId);
        return unwrapOrThrow(chatModel, EngineErrorCode.ModelNotFound);
    }

    async downloadChatModel(
        chatModel: ChatModel,
        progress: (progressUpdate: DownloadProgressUpdate) => void = () => {},
    ): Promise<DownloadState> {
        switch (chatModel.type) {
            case ModelType.Local:
                break;
            case ModelType.Cloud:
                throw new EngineError(EngineErrorCode.UnexpectedModelType);
        }

        const downloadHandle = this.downloadHandle(chatModel.repoId);
        const state = await downloadHandle.state();
        switch (state.phase) {
            case DownloadPhase.Downloaded:
                break;
            default:
                await downloadHandle.download();
                for await (const progressUpdate of downloadHandle.progressUpdate()) {
                    progress(progressUpdate);
                }
                break;
        }

        const finalState = await downloadHandle.state();
        return finalState;
    }

    chatSession(chatModel: ChatModel, config: Config = Config.default()): ChatSession {
        const napiChatModel = chatModel.toNapi();
        const napiConfig = config.toNapi();
        return new ChatSession(this.napiEngine.createChatSession(napiChatModel, napiConfig));
    }
}
