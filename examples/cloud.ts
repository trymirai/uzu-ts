import Engine from '@trymirai/uzu';

async function main() {
    const output = await Engine
        .create('API_KEY')
        .chatModel('openai/gpt-oss-120b')
        .reply('How LLMs work');
    console.log(output.text.original);
}

main().catch((error) => {
    console.error(error);
});
