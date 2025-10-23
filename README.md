<p align="center">
  <picture>
    <img alt="Mirai" src="https://artifacts.trymirai.com/social/github/uzu-typescript.jpg" style="max-width: 100%;">
  </picture>
</p>

<a href="https://artifacts.trymirai.com/social/about_us.mp3"><img src="https://img.shields.io/badge/Listen-Podcast-red" alt="Listen to our podcast"></a>
<a href="https://docsend.com/v/76bpr/mirai2025"><img src="https://img.shields.io/badge/View-Deck-red" alt="View our deck"></a>
<a href="mailto:alexey@getmirai.co,dima@getmirai.co,aleksei@getmirai.co?subject=Interested%20in%20Mirai"><img src="https://img.shields.io/badge/Send-Email-green" alt="Contact us"></a>
<a href="https://docs.trymirai.com/app-integration/overview"><img src="https://img.shields.io/badge/Read-Docs-blue" alt="Read docs"></a>
[![npm (scoped)](https://img.shields.io/npm/v/%40trymirai%2Fuzu)](https://www.npmjs.com/package/@trymirai/uzu)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

# uzu-ts

Node package for [uzu](https://github.com/trymirai/uzu), a **high-performance** inference engine for AI models on Apple Silicon. It allows you to deploy AI directly in your app with **zero latency**, **full data privacy**, and **no inference costs**. You don’t need an ML team or weeks of setup - one developer can handle everything in minutes. Key features:

- Simple, high-level API
- Specialized configurations with significant performance boosts for common use cases like classification and summarization
- [Broad model support](https://trymirai.com/models)

## Quick Start

Add the `uzu` dependency to your project's `package.json`:

```json
"dependencies": {
    "@trymirai/uzu": "0.1.36"
}
```

Set up your project through [Platform](https://platform.trymirai.com) and obtain an `API_KEY`. Then, choose the model you want from the [library](https://platform.trymirai.com/models) and run it with the following snippet using the corresponding identifier:

```ts
const output = await Engine
    .create('API_KEY')
    .model('Qwen/Qwen3-0.6B')
    .reply('Tell me a short, funny story about a robot');
```

Everything from model downloading to inference configuration is handled automatically. Refer to the [documentation](https://docs.trymirai.com) for details on how to customize each step of the process.

## Examples

Place the `API_KEY` you obtained earlier in the corresponding example file, and then run it using one of the following commands:

```bash
pnpm run tsn examples/chat.ts
pnpm run tsn examples/summarization.ts
pnpm run tsn examples/classification.ts
```

### Chat

In this example, we will download a model and get a reply to a specific list of messages:

```ts
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
```

### Summarization

In this example, we will use the `summarization` preset to generate a summary of the input text:

```ts
import Engine, { Preset, SamplingMethod } from '@trymirai/uzu';

async function main() {
    const textToSummarize =
        "A Large Language Model (LLM) is a type of artificial intelligence that processes and generates human-like text. It is trained on vast datasets containing books, articles, and web content, allowing it to understand and predict language patterns. LLMs use deep learning, particularly transformer-based architectures, to analyze text, recognize context, and generate coherent responses. These models have a wide range of applications, including chatbots, content creation, translation, and code generation. One of the key strengths of LLMs is their ability to generate contextually relevant text based on prompts. They utilize self-attention mechanisms to weigh the importance of words within a sentence, improving accuracy and fluency. Examples of popular LLMs include OpenAI's GPT series, Google's BERT, and Meta's LLaMA. As these models grow in size and sophistication, they continue to enhance human-computer interactions, making AI-powered communication more natural and effective.";
    const prompt = `Text is: "${textToSummarize}". Write only summary itself.`;

    const output = await Engine.create('API_KEY')
        .model('Qwen/Qwen3-0.6B')
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
```

You will notice that the model’s run count is lower than the actual number of generated tokens due to speculative decoding, which significantly improves generation speed.

### Classification

In this example, we will use the `classification` preset to determine the sentiment of the user's input:

```ts
import Engine, { ClassificationFeature, Preset, SamplingMethod } from '@trymirai/uzu';

async function main() {
    const feature = new ClassificationFeature('sentiment', [
        'Happy',
        'Sad',
        'Angry',
        'Fearful',
        'Surprised',
        'Disgusted',
    ]);
    const textToDetectFeature =
        "Today's been awesome! Everything just feels right, and I can't stop smiling.";
    const prompt =
        `Text is: "${textToDetectFeature}". Choose ${feature.name} from the list: ${feature.values.join(', ')}. ` +
        "Answer with one word. Don't add a dot at the end.";

    const output = await Engine.create('API_KEY')
        .model('Qwen/Qwen3-0.6B')
        .download((update) => {
            console.log('Progress:', update.progress);
        })
        .preset(Preset.classification(feature))
        .session()
        .tokensLimit(32)
        .enableThinking(false)
        .samplingMethod(SamplingMethod.greedy())
        .reply(prompt);

    console.log('Prediction:', output.text.original);
    console.log('Stats:', output.stats);
}

main().catch((error) => {
    console.error(error);
});
```

You can view the stats to see that the answer will be ready immediately after the prefill step, and actual generation won’t even start due to speculative decoding, which significantly improves generation speed.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
