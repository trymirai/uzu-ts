import { Config } from '../bridging/config';
import { ContextLength } from '../bridging/contextLength';
import { DownloadProgressUpdate } from '../bridging/downloadProgressUpdate';
import { DownloadPhase } from '../bridging/downloadState';
import { Message } from '../bridging/message';
import { Model } from '../bridging/model';
import { ModelType } from '../bridging/modelType';
import { Output } from '../bridging/output';
import { PrefillStepSize } from '../bridging/prefillStepSize';
import { Preset } from '../bridging/preset';
import { RunConfig } from '../bridging/runConfig';
import { SamplingSeed } from '../bridging/samplingSeed';
import { DownloadInteractor } from './downloadInteractor';
import { Interactor, InteractorEntity } from './interactor';
import { ModelsInteractor } from './modelsInteractor';
import { SessionInteractor } from './sessionInteractor';

export class ModelInteractor implements Interactor<Model> {
    readonly modelsInteractor: ModelsInteractor;
    readonly entity: InteractorEntity<Model>;
    readonly config: Config;

    constructor(modelsInteractor: ModelsInteractor, model: InteractorEntity<Model>, config: Config) {
        this.modelsInteractor = modelsInteractor;
        this.entity = model;
        this.config = config;
    }

    async finalize(): Promise<Model> {
        return await this.entity;
    }

    /* Downloading */

    downloading(): DownloadInteractor {
        const handlePromise = (async () => {
            const model = await this.finalize();
            const engine = await this.modelsInteractor.engineInteractor.finalize();
            const handle = engine.downloadHandle(model);
            return handle;
        })();
        return new DownloadInteractor(this, handlePromise);
    }

    download(callback?: (progressUpdate: DownloadProgressUpdate) => void): ModelInteractor {
        const modelPromise = (async () => {
            const downloadInteractor = this.downloading();
            const handle = await downloadInteractor.finalize();
            const state = await handle.state();
            switch (state.phase) {
                case DownloadPhase.Downloaded:
                    break;
                default:
                    await downloadInteractor
                        .resume()
                        .onProgressUpdate(callback ?? (() => {}))
                        .finalize();
                    break;
            }
            return this.finalize();
        })();
        return new ModelInteractor(this.modelsInteractor, modelPromise, this.config);
    }

    /* Config */

    preset(preset: Preset): ModelInteractor {
        const config = this.config.withPreset(preset);
        return new ModelInteractor(this.modelsInteractor, this.entity, config);
    }

    prefillStepSize(prefillStepSize: PrefillStepSize): ModelInteractor {
        const config = this.config.withPrefillStepSize(prefillStepSize);
        return new ModelInteractor(this.modelsInteractor, this.entity, config);
    }

    contextLength(contextLength: ContextLength): ModelInteractor {
        const config = this.config.withContextLength(contextLength);
        return new ModelInteractor(this.modelsInteractor, this.entity, config);
    }

    samplingSeed(samplingSeed: SamplingSeed): ModelInteractor {
        const config = this.config.withSamplingSeed(samplingSeed);
        return new ModelInteractor(this.modelsInteractor, this.entity, config);
    }

    /* Session */

    session(): SessionInteractor {
        const sessionPromise = (async () => {
            const engine = await this.modelsInteractor.engineInteractor.finalize();

            let model = await this.finalize();
            if (model.type === ModelType.Local) {
                model = await this.download().finalize();
            }

            const session = engine.session(model, this.config);
            return session;
        })();
        return new SessionInteractor(this, sessionPromise, RunConfig.default());
    }

    async reply(text: string, progress: (partialOutput: Output) => boolean = () => true): Promise<Output> {
        return await this.session().reply(text, progress);
    }

    async replyToMessages(
        messages: Message[],
        progress: (partialOutput: Output) => boolean = () => true,
    ): Promise<Output> {
        return await this.session().replyToMessages(messages, progress);
    }
}
