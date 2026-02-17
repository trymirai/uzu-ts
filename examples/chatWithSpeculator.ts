import Engine, { Message, Preset } from '@trymirai/uzu';

async function main() {
    const engine = Engine.create('API_KEY');
    const model = engine
        .chatModel('Qwen/Qwen3-0.6B')
        .download((update) => {
            console.log('Progress:', update.progress);
        });

    const messages = [
        Message.system('You are a helpful assistant'),
        Message.user('Tell me a short, funny story about a robot')
    ];

    const outputGeneral = await model
        .replyToMessages(
            messages,
            (partialOutput) => {
                return true;
            },
        );
    console.log('Generation speed t/s (general):', outputGeneral.stats.generateStats?.tokensPerSecond ?? 0);

    const outputWithSpeculator = await model
        .preset(Preset.chat())
        .replyToMessages(
            messages,
            (partialOutput) => {
                return true;
            },
        );
    console.log('Generation speed t/s (with chat speculator):', outputWithSpeculator.stats.generateStats?.tokensPerSecond ?? 0);
}

main().catch((error) => {
    console.error(error);
});
