import Engine, { ClassificationFeature, Config, Input, Message, Preset, RunConfig, SamplingMethod, SamplingPolicy } from '@trymirai/uzu';

async function interactorsExample() {
    // snippet:quick-start
    const output = await Engine
        .create('API_KEY')
        .chatModel('Qwen/Qwen3-0.6B')
        .reply('Tell me a short, funny story about a robot');
    // endsnippet:quick-start

    console.log(output.text.original);
}

async function manualGeneralExample() {
    // snippet:engine-create
    const engine = await Engine.load('API_KEY');
    // endsnippet:engine-create

    // snippet:model-choose
    const model = await engine.chatModel('Qwen/Qwen3-0.6B');
    // endsnippet:model-choose

    // snippet:model-download
    await engine.downloadChatModel(model, (update) => {
        console.log('Progress:', update.progress);
    });
    // endsnippet:model-download

    // snippet:session-create-general
    const config = Config
        .default()
        .withPreset(Preset.general());

    const session = engine.chatSession(model, config);
    // endsnippet:session-create-general

    // snippet:session-input-general
    const input = Input.messages([
        Message.system('You are a helpful assistant'),
        Message.user('Tell me a short, funny story about a robot'),
    ]);
    // endsnippet:session-input-general

    // snippet:session-run-general
    const runConfig = RunConfig
        .default()
        .withTokensLimit(128)
        .withEnableThinking(true)
        .withSamplingPolicy(SamplingPolicy.default());

    const output = session.run(input, runConfig, (partialOutput) => {
        return true;
    });
    // endsnippet:session-run-general

    console.log(output.text.original);
}

async function manualSummarizationExample() {
    const engine = await Engine.load('API_KEY');
    const model = await engine.chatModel('Qwen/Qwen3-0.6B');
    await engine.downloadChatModel(model, (update) => {
        console.log('Progress:', update.progress);
    });

    // snippet:session-create-summarization
    const config = Config
        .default()
        .withPreset(Preset.summarization());

    const session = engine.chatSession(model, config);
    // endsnippet:session-create-summarization

    // snippet:session-input-summarization
    const textToSummarize =
        "A Large Language Model (LLM) is a type of artificial intelligence that processes and generates human-like text. It is trained on vast datasets containing books, articles, and web content, allowing it to understand and predict language patterns. LLMs use deep learning, particularly transformer-based architectures, to analyze text, recognize context, and generate coherent responses. These models have a wide range of applications, including chatbots, content creation, translation, and code generation. One of the key strengths of LLMs is their ability to generate contextually relevant text based on prompts. They utilize self-attention mechanisms to weigh the importance of words within a sentence, improving accuracy and fluency. Examples of popular LLMs include OpenAI's GPT series, Google's BERT, and Meta's LLaMA. As these models grow in size and sophistication, they continue to enhance human-computer interactions, making AI-powered communication more natural and effective.";
    const input = Input.text(`Text is: "${textToSummarize}". Write only summary itself.`);
    // endsnippet:session-input-summarization

    // snippet:session-run-summarization
    const runConfig = RunConfig
        .default()
        .withTokensLimit(256)
        .withEnableThinking(false)
        .withSamplingPolicy(SamplingPolicy.custom(SamplingMethod.greedy()));

    const output = session.run(input, runConfig, (partialOutput) => {
        return true;
    });
    // endsnippet:session-run-summarization

    console.log(output.text.original);
}

async function manualClassificationExample() {
    const engine = await Engine.load('API_KEY');
    const model = await engine.chatModel('Qwen/Qwen3-0.6B');
    await engine.downloadChatModel(model, (update) => {
        console.log('Progress:', update.progress);
    });

    // snippet:session-create-classification
    const feature = new ClassificationFeature('sentiment', [
        'Happy',
        'Sad',
        'Angry',
        'Fearful',
        'Surprised',
        'Disgusted',
    ]);
    const config = Config
        .default()
        .withPreset(Preset.classification(feature));

    const session = engine.chatSession(model, config);
    // endsnippet:session-create-classification

    // snippet:session-input-classification
    const textToDetectFeature =
        "Today's been awesome! Everything just feels right, and I can't stop smiling.";
    const prompt =
        `Text is: "${textToDetectFeature}". Choose ${feature.name} from the list: ${feature.values.join(', ')}. ` +
        "Answer with one word. Don't add a dot at the end.";
    const input = Input.text(prompt);
    // endsnippet:session-input-classification

    // snippet:session-run-classification
    const runConfig = RunConfig
        .default()
        .withTokensLimit(32)
        .withEnableThinking(false)
        .withSamplingPolicy(SamplingPolicy.custom(SamplingMethod.greedy()));

    const output = session.run(input, runConfig, (partialOutput) => {
        return true;
    });
    // endsnippet:session-run-classification

    console.log(output.text.original);
}

async function main() {
    await interactorsExample();
    await manualGeneralExample();
    await manualSummarizationExample();
    await manualClassificationExample();
}

main().catch((error) => {
    console.error(error);
});
