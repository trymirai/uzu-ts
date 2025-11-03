import { Engine } from '../bridging/engine';
import { ModelType } from '../bridging/modelType';
import { ChatModelInteractor } from './chatModelInteractor';
import { ChatModelsInteractor } from './chatModelsInteractor';
import { Interactor, InteractorEntity } from './interactor';

export class EngineInteractor implements Interactor<Engine> {
    readonly entity: InteractorEntity<Engine>;
    readonly modelTypeFilter: ModelType[] | null;

    constructor(engine: InteractorEntity<Engine>, modelTypeFilter: ModelType[] | null = null) {
        this.entity = engine;
        this.modelTypeFilter = modelTypeFilter;
    }

    async finalize(): Promise<Engine> {
        return await this.entity;
    }

    /* Models */

    filterTypes(types: ModelType[] | null): EngineInteractor {
        return new EngineInteractor(this.entity, types);
    }

    chatModels(): ChatModelsInteractor {
        const modelsPromise = (async () => {
            const engine = await this.finalize();
            return await engine.chatModels(this.modelTypeFilter);
        })();
        return new ChatModelsInteractor(this, modelsPromise);
    }

    chatModel(repoId: string): ChatModelInteractor {
        const models = this.chatModels();
        return models.get(repoId);
    }
}
