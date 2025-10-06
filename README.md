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
- Observable model manager

## Examples

Set up your project via [Platform](https://platform.trymirai.com), obtain an `MIRAI_API_KEY`.

```bash
# Set your API key in `examples/common.ts`, then run the examples
pnpm run chat
pnpm run summarisation
pnpm run classification
```

## Setup

Add the `uzu` dependency to your project's `package.json`:

```json
"dependencies": {
    "@trymirai/uzu": "0.1.21"
}
```

Create and activate engine:

```ts
const engine = new Engine()
const licenseStatus: LicenseStatus = await engine.activate(apiKey)
```

### Refresh models registry / list cloud models:

```ts
const localModels: LocalModel[] = await engine.updateRegistry()
const localModelId = 'Meta-Llama-3.2-1B-Instruct'
```

### Download with progress handle

```ts
const donwloadHandle = engine.downloadHandle(localModelId)
donwloadHandle.start()

for await (const donwloadProgress of donwloadHandle.progress()) {
    // Implement a custom download progress handler
    handleProgress(donwloadProgress)
}
```

Alternatively, you may use engine to control and observe model download:

```ts
const modelState: ModelDownloadState = engine.getState(localModelId)

// engine.download(localModelId)
// engine.pause(localModelId)
// engine.resume(localModelId)
// engine.stop(localModelId)
// engine.delete(localModelId)
```

### Session

`Session` is the core entity used to communicate with the model:

```ts
const modelId: ModelID = { type: 'Local', id: localModelId }
const config: Config = {
    preset: { type: 'General' },
    prefillStepSize: { type: 'Default' },
    contextLength: { type: 'Default' },
    samplingSeed: { type: 'Default' },
}
const session: Session = engine.createSession(modelId, config)
```

### Chat

After creating it, you can run the `Session` with a specific prompt or a list of messages:

```ts
const input: Input = {
    type: 'Messages',
    messages: [
        {
            role: Role.System,
            content: 'You are a helpful assistant.'
        },
        {
            role: Role.User,
            content: 'Tell me a short, funny story about a robot.'
        },
    ],
}
```

```ts
const runConfig: RunConfig = {
    tokensLimit: 128,
    enableThinking: true,
    samplingPolicy: { type: 'Default' },
}

const output = session.run(input, runConfig, (partialOutput) => {
    // Implement a custom partial output handler
    return handlePartialOutput(partialOutput)
})
```

### Summarization

In this example, we will extract a summary of the input text:

```ts
const modelId: ModelID = { type: 'Local', id: localModelId }
const config: Config = {
    preset: { type: 'Summarization' },
    prefillStepSize: { type: 'Default' },
    contextLength: { type: 'Default' },
    samplingSeed: { type: 'Default' },
}
const session = engine.createSession(modelId, config)
```

```ts
const textToSummarize =
    'A Large Language Model (LLM) is a type of AI that processes and generates text using transformer-based architectures trained on vast datasets. They power chatbots, translation, code assistants, and more.'
const input: Input = {
    type: 'Text',
    text: `Text is: "${textToSummarize}". Write only summary itself.`,
}
```

```ts
const runConfig: RunConfig = {
    tokensLimit: 256,
    enableThinking: true,
    samplingPolicy: { type: 'Custom', value: { type: 'Greedy' } },
}

const output = session.run(input, runConfig, (partialOutput) => {
    // Implement a custom partial output handler
    return handlePartialOutput(partialOutput)
})
```

### Classification

Let’s look at a case where you need to classify input text based on a specific feature, such as `sentiment`:

```ts
const feature: ClassificationFeature = {
    name: 'sentiment',
    values: ['Happy', 'Sad', 'Angry', 'Fearful', 'Surprised', 'Disgusted'],
}
const config: Config = {
    preset: { type: 'Classification', feature },
    prefillStepSize: { type: 'Default' },
    contextLength: { type: 'Default' },
    samplingSeed: { type: 'Default' },
}

const modelId: ModelID = { type: 'Local', id: localModelId }
const session = engine.createSession(modelId, config)
```

```ts
const textToDetectFeature =
    "Today's been awesome! Everything just feels right, and I can't stop smiling."
const classificationPrompt =
    `Text is: "${textToDetectFeature}". Choose ${feature.name} from the list: ${feature.values.join(', ')}. ` +
    "Answer with one word. Don't add a dot at the end."
const input: Input = { type: 'Text', text: classificationPrompt }
```

```ts
const runConfig: RunConfig = {
    tokensLimit: 32,
    enableThinking: true,
    samplingPolicy: { type: 'Custom', value: { type: 'Greedy' } },
}

const output = session.run(input, runConfig, (partialOutput) => {
    // Implement a custom partial output handler
    return handlePartialOutput(partialOutput)
})
```

In this example, you will get the answer `Happy` immediately after the prefill step, and the actual generation won't even start.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.