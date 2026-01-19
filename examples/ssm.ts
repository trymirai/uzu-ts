import Engine from '@trymirai/uzu';

async function main() {
    const output = await Engine
        .create('API_KEY')
        .chatModel('LiquidAI/LFM2-700M')
        .download((update) => {
            console.log('Progress:', update.progress);
        })
        .reply('Tell me a short, funny story about a robot');
    console.log(output.text.original);
}

main().catch((error) => {
    console.error(error);
});
