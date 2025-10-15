import Engine, { Message } from '@trymirai/uzu';

async function main() {
    const output = await Engine.create('API_KEY')
        .model('Qwen/Qwen3-0.6B')
        .download((update) => {
            console.log('Progress:', update.progress);
        })
        .replyToMessages(
            [
                Message.system('You are a helpful assistant'),
                Message.user('Tell me a short, funny story about a robot')
            ],
            (partialOutput) => {
                return true;
            },
        );
    console.log(output.text.original);
}

main().catch((error) => {
    console.error(error);
});
