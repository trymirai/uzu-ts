import * as z from 'zod';
import { GrammarConfig as NapiGrammarConfig } from '../napi/uzu';
import { ToNapi } from './napi';

export class GrammarConfig implements ToNapi<NapiGrammarConfig> {
    private readonly napiGrammarConfig: NapiGrammarConfig;

    private constructor(napiGrammarConfig: NapiGrammarConfig) {
        this.napiGrammarConfig = napiGrammarConfig;
    }

    static jsonSchema(schema: string): GrammarConfig {
        let a = z.object({
            name: z.string(),
            age: z.number(),
        });
        const napiGrammarConfig: NapiGrammarConfig = { type: 'JsonSchema', schema: schema };
        return new GrammarConfig(napiGrammarConfig);
    }

    static regex(pattern: string): GrammarConfig {
        const napiGrammarConfig: NapiGrammarConfig = { type: 'Regex', pattern: pattern };
        return new GrammarConfig(napiGrammarConfig);
    }

    static builtinJson(): GrammarConfig {
        const napiGrammarConfig: NapiGrammarConfig = { type: 'BuiltinJson' };
        return new GrammarConfig(napiGrammarConfig);
    }

    static fromType(type: z.ZodType): GrammarConfig {
        let schema = z.toJSONSchema(type);
        let schemaString = JSON.stringify(schema);
        return GrammarConfig.jsonSchema(schemaString);
    }

    toNapi(): NapiGrammarConfig {
        return this.napiGrammarConfig;
    }
}
