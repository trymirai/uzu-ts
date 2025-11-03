import { ChatModel as NapiChatModel } from '../napi/uzu';
import { ModelType, modelTypeFromNapiModelType, modelTypeToNapiModelType } from './modelType';

export class ChatModel {
    readonly repoId: string;
    readonly type: ModelType;
    readonly name: string;
    readonly vendor: string;
    readonly quantization: string | null;
    readonly outputParserRegex: string | null;

    get isThinking(): boolean {
        return this.outputParserRegex !== null;
    }

    private constructor(
        repoId: string,
        type: ModelType,
        name: string,
        vendor: string,
        quantization: string | null,
        outputParserRegex: string | null,
    ) {
        this.repoId = repoId;
        this.type = type;
        this.name = name;
        this.vendor = vendor;
        this.quantization = quantization;
        this.outputParserRegex = outputParserRegex;
    }

    static fromNapiChatModel(napiChatModel: NapiChatModel): ChatModel {
        return new ChatModel(
            napiChatModel.repoId,
            modelTypeFromNapiModelType(napiChatModel.type),
            napiChatModel.name,
            napiChatModel.vendor,
            napiChatModel.quantization ?? null,
            napiChatModel.outputParserRegex ?? null,
        );
    }

    toNapi(): NapiChatModel {
        const napiChatModel: NapiChatModel = {
            repoId: this.repoId,
            type: modelTypeToNapiModelType(this.type),
            name: this.name,
            vendor: this.vendor,
            ...(this.quantization !== null && { quantization: this.quantization }),
            ...(this.outputParserRegex !== null && { outputParserRegex: this.outputParserRegex }),
        };
        return napiChatModel;
    }
}
