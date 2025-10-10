import { Output as NapiOutput, Session as NapiSession } from '../napi/uzu';
import { Input } from './input';
import { Output } from './output';
import { RunConfig } from './runConfig';

export class Session {
    private readonly napiSession: NapiSession;

    constructor(napiSession: NapiSession) {
        this.napiSession = napiSession;
    }

    run(
        input: Input,
        config: RunConfig = RunConfig.default(),
        progress: (partialOutput: Output) => boolean = () => true,
    ): Output {
        const napiInput = input.toNapi();
        const napiConfig = config.toNapi();
        const napiProgress = (partialOutput: NapiOutput) => progress(Output.fromNapi(partialOutput));
        const napiOutput = this.napiSession.run(napiInput, napiConfig, napiProgress);
        return Output.fromNapi(napiOutput);
    }
}
