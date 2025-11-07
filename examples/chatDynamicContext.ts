import Engine, { Config, ContextMode, Input, RunConfig } from '@trymirai/uzu';

async function main() {
    const engine = await Engine.load('API_KEY');

    const model = await engine.chatModel('Qwen/Qwen3-0.6B');
    await engine.downloadChatModel(model, (update) => {
        console.log('Progress:', update.progress);
    });

    const config = Config
        .default()
        .withContextMode(ContextMode.dynamic());
    const session = engine.chatSession(model, config);

    const requests = [
        'Tell about London',
        'Compare with New York',
        'Compare the population of the two',
    ];
    const runConfig = RunConfig
        .default()
        .withTokensLimit(1024)
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
