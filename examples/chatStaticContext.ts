import Engine, { Config, ContextMode, Input, Message, RunConfig } from '@trymirai/uzu';

function listToString(list: string[]): string {
    return "[" + list.map((item) => `"${item}"`).join(", ") + "]";
}

async function main() {
    const engine = await Engine.load('API_KEY');

    const model = await engine.chatModel('Qwen/Qwen3-0.6B');
    await engine.downloadChatModel(model, (update) => {
        console.log('Progress:', update.progress);
    });

    const instructions =
        `Your task is to name countries for each city in the given list.
        For example for ${listToString(["Helsenki", "Stockholm", "Barcelona"])} the answer should be ${listToString(["Finland", "Sweden", "Spain"])}.`;
    const config = Config
        .default()
        .withContextMode(ContextMode.static(Input.messages([Message.system(instructions)])));
    const session = engine.chatSession(model, config);

    const requests = [
        listToString(["New York", "London", "Lisbon", "Paris", "Berlin"]),
        listToString(["Bangkok", "Tokyo", "Seoul", "Beijing", "Delhi"]),
    ];
    const runConfig = RunConfig
        .default()
        .withEnableThinking(false);

    for (const request of requests) {
        const output = session.run(Input.text(request), runConfig, (partialOutput) => {
            return true;
        });

        console.log('Request:', request);
        console.log('Response:', output.text.original.trim());
        console.log('-------------------------');
    }
}

main().catch((error) => {
    console.error(error);
});
