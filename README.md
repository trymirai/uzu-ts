<p align="center">
  <picture>
    <img alt="Mirai" src="https://artifacts.trymirai.com/social/github/uzu-typescript.jpg" style="max-width: 100%;">
  </picture>
</p>

<a href="https://artifacts.trymirai.com/social/about_us.mp3"><img src="https://img.shields.io/badge/Listen-Podcast-red" alt="Listen to our podcast"></a>
<a href="https://docsend.com/v/76bpr/mirai2025"><img src="https://img.shields.io/badge/View-Deck-red" alt="View our deck"></a>
<a href="mailto:alexey@getmirai.co,dima@getmirai.co,aleksei@getmirai.co?subject=Interested%20in%20Mirai"><img src="https://img.shields.io/badge/Send-Email-green" alt="Contact us"></a>
<a href="https://docs.trymirai.com/components/inference-engine"><img src="https://img.shields.io/badge/Read-Docs-blue" alt="Read docs"></a>
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
# Set your API key in `examples/api_key.ts`, then run the examples
pnpm run chat
pnpm run summarisation
pnpm run classification
```

## Setup

Add the `uzu` dependency to your project's `package.json`:

```json
"dependencies": {
    "@trymirai/uzu": "0.1.12"
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
const localModelId = 'Meta-Llama-3.2-1B-Instruct-bfloat16'
```

### Download with progress handle

```ts
const donwloadHandle = engine.downloadHandle(localModelId)
donwloadHandle.start()

for await (const donwloadProgress of donwloadHandle.progress()) {
    handleProgress(donwloadProgress)
}
```

Alternatively, you may use engine to control and observe model download:

```ts
// engine.download(localModelId)
// engine.pause(localModelId)
// engine.resume(localModelId)
// engine.stop(localModelId)
// engine.delete(localModelId)

const modelState: ModelDownloadState = engine.getState(localModelId)
```

### Session

`Session` is the core entity used to communicate with the model:

```ts
// Choose one of the two options below by commenting/uncommenting:
// const modelId: ModelID = { type: 'Cloud', id: cloudRepoId }
const modelId: ModelID = { type: 'Local', id: localModelId }
const session: Session = engine.createSession(modelId)
```

### Chat

Load `Session` with a chat-configured config and run it with a specific prompt or a list of messages:

```ts
const config: SessionConfig = {
    preset: { type: 'General' },
    samplingSeed: { type: 'Custom', seed: 12345 },
    contextLength: { type: 'Default' },
}
session.load(config)
```

```ts
const input: SessionInput = {
    type: 'Messages',
    messages: [
        {
            role: SessionMessageRole.System,
            content: 'You are a helpful assistant.'
        },
        {
            role: SessionMessageRole.User,
            content: 'Tell me a short, funny story about a robot.'
        },
    ],
}
```

```ts
const runConfig: SessionRunConfig = {
    tokensLimit: 128,
    samplingConfig: { type: 'Argmax' },
}
```

```ts
const output = session.run(input, runConfig, (partialOutput) => {
    return handlePartialOutput(partialOutput)
})
```

### Summarization

In this example, we will extract a summary of the input text:

```ts
const config: SessionConfig = {
    preset: { type: 'Summarization' },
    samplingSeed: { type: 'Default' },
    contextLength: { type: 'Default' },
}
session.load(config)
```

```ts
const input: SessionInput = {
    type: 'Text',
    text: `Text is: "${textToSummarize}". Write only summary itself.`,
}
```

```ts
const runConfig: SessionRunConfig = {
    tokensLimit: 256,
    samplingConfig: { type: 'Argmax' },
}
```

```ts
const output = session.run(input, runConfig, (partialOutput) => {
    return handlePartialOutput(partialOutput)
})
```

### Classification

Let’s look at a case where you need to classify input text based on a specific feature, such as `sentiment`:

```ts
const feature: SessionClassificationFeature = {
    name: 'sentiment',
    values: ['Happy', 'Sad', 'Angry', 'Fearful', 'Surprised', 'Disgusted'],
}
```

```ts
const config: SessionConfig = {
    preset: { type: 'Classification', feature },
    samplingSeed: { type: 'Default' },
    contextLength: { type: 'Default' },
}
session.load(config)
```

```ts
const textToDetectFeature =
    "Today's been awesome! Everything just feels right, and I can't stop smiling."
const classificationPrompt =
    `Text is: "${textToDetectFeature}". Choose ${feature.name} from the list: ${feature.values.join(', ')}. ` +
    "Answer with one word. Don't add a dot at the end."
const input: SessionInput = { type: 'Text', text: classificationPrompt }
```

```ts
const runConfig: SessionRunConfig = {
    tokensLimit: 32,
    samplingConfig: { type: 'Argmax' },
}
```

```ts
const output = session.run(input, runConfig, (partialOutput) => {
    return handlePartialOutput(partialOutput)
})
```

In this example, you will get the answer `Happy` immediately after the prefill step, and the actual generation won't even start.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


