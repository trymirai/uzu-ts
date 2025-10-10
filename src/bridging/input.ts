import { Input as NapiInput, Message as NapiMessage } from '../napi/uzu';
import { Message } from './message';
import { ToNapi } from './napi';

export class Input implements ToNapi<NapiInput> {
    private readonly napiInput: NapiInput;

    private constructor(napiInput: NapiInput) {
        this.napiInput = napiInput;
    }

    static text(text: string): Input {
        const napiInput: NapiInput = { type: 'Text', text };
        return new Input(napiInput);
    }

    static messages(messages: Message[]): Input {
        const napiMessages: NapiMessage[] = messages.map((message) => message.toNapi());
        const napiInput: NapiInput = {
            type: 'Messages',
            messages: napiMessages,
        };
        return new Input(napiInput);
    }

    toNapi(): NapiInput {
        return this.napiInput;
    }
}
