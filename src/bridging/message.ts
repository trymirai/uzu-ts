import { Message as NapiMessage, Role as NapiRole } from '../napi/uzu';
import { ToNapi } from './napi';
import { Role } from './role';

export class Message implements ToNapi<NapiMessage> {
    readonly role: Role;
    readonly content: string;
    readonly reasoningContent: string | null;

    private constructor(role: Role, content: string, reasoningContent: string | null = null) {
        this.role = role;
        this.content = content;
        this.reasoningContent = reasoningContent;
    }

    static system(content: string): Message {
        return new Message(Role.System, content);
    }

    static user(content: string): Message {
        return new Message(Role.User, content);
    }

    static assistant(content: string, reasoningContent: string | null = null): Message {
        return new Message(Role.Assistant, content, reasoningContent);
    }

    private static roleToNapiRole(role: Role): NapiRole {
        switch (role) {
            case Role.System:
                return 0;
            case Role.User:
                return 1;
            case Role.Assistant:
                return 2;
        }
    }

    toNapi(): NapiMessage {
        const napiRole: NapiRole = Message.roleToNapiRole(this.role);
        const napiMessage: NapiMessage = {
            role: napiRole,
            content: this.content,
        };
        if (this.reasoningContent) {
            napiMessage.reasoningContent = this.reasoningContent;
        }
        return napiMessage;
    }
}
