import { ChatModel } from '../bridging/chatModel';
import { Config } from '../bridging/config';
import { EngineErrorCode, unwrapOrThrow } from '../error';
import { ChatModelInteractor } from './chatModelInteractor';
import { EngineInteractor } from './engineInteractor';
import { Interactor, InteractorEntity } from './interactor';

export class ChatModelsInteractor implements Interactor<ChatModel[]> {
    readonly engineInteractor: EngineInteractor;
    readonly entity: InteractorEntity<ChatModel[]>;

    constructor(engineInteractor: EngineInteractor, models: InteractorEntity<ChatModel[]>) {
        this.engineInteractor = engineInteractor;
        this.entity = models;
    }

    async finalize(): Promise<ChatModel[]> {
        return await this.entity;
    }

    get(repoId: string): ChatModelInteractor {
        const modelPromise = (async () => {
            const models = await this.finalize();
            const model = models.find((model) => model.repoId === repoId);
            return unwrapOrThrow(model, EngineErrorCode.ModelNotFound);
        })();
        return new ChatModelInteractor(this, modelPromise, Config.default());
    }
}
