import Engine, { GrammarConfig } from '@trymirai/uzu';
import * as z from "zod";

const CountryType = z.object({
    name: z.string(),
    capital: z.string(),
});
const CountryListType = z.array(CountryType);

async function main() {
    const output = await Engine.create('API_KEY')
        .chatModel('Qwen/Qwen3-0.6B')
        .download((update) => {
            console.log('Progress:', update.progress);
        })
        .session()
        .enableThinking(false)
        .grammarConfig(GrammarConfig.fromType(CountryListType))
        .reply(
            "Give me a JSON object containing a list of 3 countries, where each country has name and capital fields",
            (partialOutput) => {
                return true;
            },
        );

    const countries = output.text.parsed.structuredResponse(CountryListType);
    console.log(countries);
}

main().catch((error) => {
    console.error(error);
});
