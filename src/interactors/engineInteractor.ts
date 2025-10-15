import { Engine } from '../bridging/engine';
import { ModelKind } from '../bridging/model';
import { ModelType } from '../bridging/modelType';
import { Interactor, InteractorEntity } from './interactor';
import { ModelInteractor } from './modelInteractor';
import { ModelsInteractor } from './modelsInteractor';

export class EngineInteractor implements Interactor<Engine> {
    readonly entity: InteractorEntity<Engine>;
    readonly modelTypeFilter: ModelType[] | null;
    readonly modelKindFilter: ModelKind[] | null;

    constructor(
        engine: InteractorEntity<Engine>,
        modelTypeFilter: ModelType[] | null = null,
        modelKindFilter: ModelKind[] | null = null,
    ) {
        this.entity = engine;
        this.modelTypeFilter = modelTypeFilter;
        this.modelKindFilter = modelKindFilter;
    }

    async finalize(): Promise<Engine> {
        return await this.entity;
    }

    /* Models */

    filterTypes(types: ModelType[] | null): EngineInteractor {
        return new EngineInteractor(this.entity, types, this.modelKindFilter);
    }

    filterKinds(kinds: ModelKind[] | null): EngineInteractor {
        return new EngineInteractor(this.entity, this.modelTypeFilter, kinds);
    }

    models(): ModelsInteractor {
        const modelsPromise = (async () => {
            const engine = await this.finalize();
            return await engine.models(this.modelTypeFilter, this.modelKindFilter);
        })();
        return new ModelsInteractor(this, modelsPromise);
    }

    model(repoId: string): ModelInteractor {
        const models = this.models();
        return models.get(repoId);
    }
}
