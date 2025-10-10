import { Config } from '../bridging/config';
import { Model } from '../bridging/model';
import { EngineErrorCode, unwrapOrThrow } from '../error';
import { EngineInteractor } from './engineInteractor';
import { Interactor, InteractorEntity } from './interactor';
import { ModelInteractor } from './modelInteractor';

export class ModelsInteractor implements Interactor<Model[]> {
    readonly engineInteractor: EngineInteractor;
    readonly entity: InteractorEntity<Model[]>;

    constructor(engineInteractor: EngineInteractor, models: InteractorEntity<Model[]>) {
        this.engineInteractor = engineInteractor;
        this.entity = models;
    }

    async finalize(): Promise<Model[]> {
        return await this.entity;
    }

    get(repoId: string): ModelInteractor {
        const modelPromise = (async () => {
            const models = await this.finalize();
            const model = models.find((model) => model.repoId === repoId);
            return unwrapOrThrow(model, EngineErrorCode.ModelNotFound);
        })();
        return new ModelInteractor(this, modelPromise, Config.default());
    }
}
