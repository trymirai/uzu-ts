import { ChatSession as NapiChatSession, Output as NapiOutput } from '../napi/uzu';
import { Input } from './input';
import { Output } from './output';
import { RunConfig } from './runConfig';

export class ChatSession {
    private readonly napiChatSession: NapiChatSession;

    constructor(napiChatSession: NapiChatSession) {
        this.napiChatSession = napiChatSession;
    }

    run(
        input: Input,
        config: RunConfig = RunConfig.default(),
        progress: (partialOutput: Output) => boolean = () => true,
    ): Output {
        const napiInput = input.toNapi();
        const napiConfig = config.toNapi();
        const napiProgress = (partialOutput: NapiOutput) => progress(Output.fromNapi(partialOutput));
        const napiOutput = this.napiChatSession.run(napiInput, napiConfig, napiProgress);
        return Output.fromNapi(napiOutput);
    }
}
