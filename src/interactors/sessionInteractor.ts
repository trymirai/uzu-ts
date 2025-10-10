import { Input } from '../bridging/input';
import { Message } from '../bridging/message';
import { Output } from '../bridging/output';
import { RunConfig } from '../bridging/runConfig';
import { SamplingMethod } from '../bridging/samplingMethod';
import { SamplingPolicy } from '../bridging/samplingPolicy';
import { Session } from '../bridging/session';
import { Interactor, InteractorEntity } from './interactor';
import { ModelInteractor } from './modelInteractor';

export class SessionInteractor implements Interactor<Session> {
    readonly modelInteractor: ModelInteractor;
    readonly entity: InteractorEntity<Session>;
    readonly config: RunConfig;

    constructor(modelInteractor: ModelInteractor, session: InteractorEntity<Session>, config: RunConfig) {
        this.modelInteractor = modelInteractor;
        this.entity = session;
        this.config = config;
    }

    async finalize(): Promise<Session> {
        return await this.entity;
    }

    /* Config */

    tokensLimit(tokensLimit: number): SessionInteractor {
        const config = this.config.withTokensLimit(tokensLimit);
        return new SessionInteractor(this.modelInteractor, this.entity, config);
    }

    enableThinking(enableThinking: boolean): SessionInteractor {
        const config = this.config.withEnableThinking(enableThinking);
        return new SessionInteractor(this.modelInteractor, this.entity, config);
    }

    samplingPolicy(samplingPolicy: SamplingPolicy): SessionInteractor {
        const config = this.config.withSamplingPolicy(samplingPolicy);
        return new SessionInteractor(this.modelInteractor, this.entity, config);
    }

    samplingMethod(samplingMethod: SamplingMethod): SessionInteractor {
        const config = this.config.withSamplingPolicy(SamplingPolicy.custom(samplingMethod));
        return new SessionInteractor(this.modelInteractor, this.entity, config);
    }

    /* Run */

    async run(input: Input, progress: (partialOutput: Output) => boolean = () => true): Promise<Output> {
        const outputPromise = (async () => {
            const session = await this.finalize();
            const output = session.run(input, this.config, progress);
            return output;
        })();
        const output = await outputPromise;
        return output;
    }

    async reply(text: string, progress: (partialOutput: Output) => boolean = () => true): Promise<Output> {
        return await this.run(Input.text(text), progress);
    }

    async replyToMessages(
        messages: Message[],
        progress: (partialOutput: Output) => boolean = () => true,
    ): Promise<Output> {
        return await this.run(Input.messages(messages), progress);
    }
}
