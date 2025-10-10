import Engine, { Preset, SamplingMethod } from '@trymirai/uzu';

async function main() {
    const textToSummarize =
        "A Large Language Model (LLM) is a type of artificial intelligence that processes and generates human-like text. It is trained on vast datasets containing books, articles, and web content, allowing it to understand and predict language patterns. LLMs use deep learning, particularly transformer-based architectures, to analyze text, recognize context, and generate coherent responses. These models have a wide range of applications, including chatbots, content creation, translation, and code generation. One of the key strengths of LLMs is their ability to generate contextually relevant text based on prompts. They utilize self-attention mechanisms to weigh the importance of words within a sentence, improving accuracy and fluency. Examples of popular LLMs include OpenAI's GPT series, Google's BERT, and Meta's LLaMA. As these models grow in size and sophistication, they continue to enhance human-computer interactions, making AI-powered communication more natural and effective.";
    const prompt = `Text is: "${textToSummarize}". Write only summary itself.`;

    const output = await Engine.create('API_KEY')
        .model('Alibaba-Qwen3-0.6B')
        .download((update) => {
            console.log('Progress:', update.progress);
        })
        .preset(Preset.summarization())
        .session()
        .tokensLimit(256)
        .enableThinking(false)
        .samplingMethod(SamplingMethod.greedy())
        .reply(prompt);

    console.log('Summary:', output.text.original);
    console.log(
        'Model runs:',
        output.stats.prefillStats.modelRun.count + (output.stats.generateStats?.modelRun.count ?? 0),
    );
    console.log('Tokens count:', output.stats.totalStats.tokensCountOutput);
}

main().catch((error) => {
    console.error(error);
});
