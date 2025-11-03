import { ChatSession } from '../bridging/chatSession';
import { Input } from '../bridging/input';
import { Message } from '../bridging/message';
import { Output } from '../bridging/output';
import { RunConfig } from '../bridging/runConfig';
import { SamplingMethod } from '../bridging/samplingMethod';
import { SamplingPolicy } from '../bridging/samplingPolicy';
import { ChatModelInteractor } from './chatModelInteractor';
import { Interactor, InteractorEntity } from './interactor';

export class ChatSessionInteractor implements Interactor<ChatSession> {
    readonly modelInteractor: ChatModelInteractor;
    readonly entity: InteractorEntity<ChatSession>;
    readonly config: RunConfig;

    constructor(
        modelInteractor: ChatModelInteractor,
        session: InteractorEntity<ChatSession>,
        config: RunConfig,
    ) {
        this.modelInteractor = modelInteractor;
        this.entity = session;
        this.config = config;
    }

    async finalize(): Promise<ChatSession> {
        return await this.entity;
    }

    /* Config */

    tokensLimit(tokensLimit: number): ChatSessionInteractor {
        const config = this.config.withTokensLimit(tokensLimit);
        return new ChatSessionInteractor(this.modelInteractor, this.entity, config);
    }

    enableThinking(enableThinking: boolean): ChatSessionInteractor {
        const config = this.config.withEnableThinking(enableThinking);
        return new ChatSessionInteractor(this.modelInteractor, this.entity, config);
    }

    samplingPolicy(samplingPolicy: SamplingPolicy): ChatSessionInteractor {
        const config = this.config.withSamplingPolicy(samplingPolicy);
        return new ChatSessionInteractor(this.modelInteractor, this.entity, config);
    }

    samplingMethod(samplingMethod: SamplingMethod): ChatSessionInteractor {
        const config = this.config.withSamplingPolicy(SamplingPolicy.custom(samplingMethod));
        return new ChatSessionInteractor(this.modelInteractor, this.entity, config);
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
