<p align="center">
  <picture>
    <img alt="Mirai" src="https://artifacts.trymirai.com/social/github/uzu-typescript.jpg" style="max-width: 100%;">
  </picture>
</p>

<a href="https://artifacts.trymirai.com/social/about_us.mp3"><img src="https://img.shields.io/badge/Listen-Podcast-red" alt="Listen to our podcast"></a>
<a href="https://docsend.com/v/76bpr/mirai2025"><img src="https://img.shields.io/badge/View-Deck-red" alt="View our deck"></a>
<a href="mailto:alexey@getmirai.co,dima@getmirai.co,aleksei@getmirai.co?subject=Interested%20in%20Mirai"><img src="https://img.shields.io/badge/Send-Email-green" alt="Contact us"></a>
<a href="https://docs.trymirai.com/components/inference-engine"><img src="https://img.shields.io/badge/Read-Docs-blue" alt="Read docs"></a>
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

# uzu-ts

Node package for [uzu](https://github.com/trymirai/uzu), a **high-performance** inference engine for AI models on Apple Silicon. It allows you to deploy AI directly in your app with **zero latency**, **full data privacy**, and **no inference costs**. You don’t need an ML team or weeks of setup - one developer can handle everything in minutes. Key features:

- Simple, high-level API
- Specialized configurations with significant performance boosts for common use cases like classification and summarization
- [Broad model support](https://trymirai.com/models)
- Observable model manager

## Quick Start

```bash
# Set your API key in `examples/api_key.ts`, then run the examples
pnpm run chat
pnpm run summarize
pnpm run classify
```

### Setup

Add the `uzu-ts` dependency to your project:

Set up your project via [Platform](https://platform.trymirai.com), obtain an `API_KEY`, and initialize engine:

```ts
import { Engine } from './uzu'

const engine = new Engine()
const licenseStatus = await engine.activate('API_KEY')
```

### Refresh models registry / list cloud models:

```ts
const registry = await engine.updateRegistry()
const modelIdentifiers = registry.map((m) => m.identifier)

// To explore available cloud models:
const cloudModels = await engine.getCloudModels()
console.log('Cloud models:', cloudModels)
```

### Download with progress handle

```ts
const modelIdentifier = 'Meta-Llama-3.2-1B-Instruct-bfloat16'

const handle = engine.downloadHandle(modelIdentifier)
handle.start()

for await (const downloadProgress of handle.progress()) {
  console.log(`Progress: ${Math.round(downloadProgress.progress * 100)}%`)
}
```

Alternatively, you may use engine to control and observe model download:

```ts
engine.download(modelIdentifier)
engine.pause(modelIdentifier)
engine.resume(modelIdentifier)
engine.delete(modelIdentifier)

// ... later you can query state
const state = engine.getState(modelIdentifier)
```

Possible model state values:

- `.notDownloaded`
- `.downloading(progress: Double)`
- `.paused(progress: Double)`
- `.downloaded`
- `.error(message: String)`

### Session

`Session` is the core entity used to communicate with the model:

```ts
import { type ModelID } from './uzu'

const modelIdentifier = 'Meta-Llama-3.2-1B-Instruct-bfloat16'

// Choose one of the two options below by commenting/uncommenting:
// 1) Local model (default)
// const modelId: ModelID = { type: 'Local', id: modelIdentifier }

// 2) Cloud model (uncomment and set your repoId; you can list with engine.getCloudModels())
const cloudRepoId = 'meta-llama/Llama-4-Maverick-17B-128E-Instruct'
const modelId: ModelID = { type: 'Cloud', id: cloudRepoId }

const session = engine.createSession(modelId)
```

`Session` offers different configuration presets that can provide significant performance boosts for common use cases like classification and summarization:

```ts
import { type SessionConfig } from './uzu'

const config: SessionConfig = {
  preset: { type: 'General' },
  samplingSeed: { type: 'Default' },
  contextLength: { type: 'Default' },
}
session.load(config)
```

Once loaded, the same `Session` can be reused for multiple requests until you drop it. Each model may consume a significant amount of RAM, so it's important to keep only one session loaded at a time.

### Inference

After loading, you can run the `Session` with a specific prompt or a list of messages:

```ts
import { SessionMessageRole, type SessionInput } from './uzu'

const input: SessionInput = {
  type: 'Messages',
  messages: [
    { role: SessionMessageRole.System, content: 'You are a helpful assistant' },
    { role: SessionMessageRole.User, content: 'Tell about London' },
  ],
}

const output = session.run(
  input,
  { tokensLimit: 128, samplingConfig: { type: 'Argmax' } },
  (partialOutput) => {
    // Access the current text using partialOutput.text
    return true // Return true to continue generation
  },
)
```

`SessionOutput` also includes generation metrics such as prefill duration and tokens per second. It’s important to note that you should run a **release** build to obtain accurate metrics.

### Presets

#### Summarization

In this example, we will extract a summary of the input text:

```ts
import { type SessionConfig, type SessionInput } from './uzu'

const textToSummarize =
  'A Large Language Model (LLM) is a type of artificial intelligence that processes and generates human-like text. It is trained on vast datasets containing books, articles, and web content, allowing it to understand and predict language patterns. LLMs use deep learning, particularly transformer-based architectures, to analyze text, recognize context, and generate coherent responses. These models have a wide range of applications, including chatbots, content creation, translation, and code generation. One of the key strengths of LLMs is their ability to generate contextually relevant text based on prompts. They utilize self-attention mechanisms to weigh the importance of words within a sentence, improving accuracy and fluency. Examples of popular LLMs include OpenAI's GPT series, Google's BERT, and Meta's LLaMA. As these models grow in size and sophistication, they continue to enhance human-computer interactions, making AI-powered communication more natural and effective.'
const text = `Text is: "${textToSummarize}". Write only summary itself.`

const config: SessionConfig = {
  preset: { type: 'Summarization' },
  samplingSeed: { type: 'Default' },
  contextLength: { type: 'Default' },
}
session.load(config)

const input: SessionInput = { type: 'Text', text }

const output = session.run(
  input,
  { tokensLimit: 1024, samplingConfig: { type: 'Argmax' } },
  () => true,
)
```

This will generate 34 output tokens with only 5 model runs during the generation phase, instead of 34 runs.

#### Classification

Let’s look at a case where you need to classify input text based on a specific feature, such as `sentiment`:

```ts
import { type SessionClassificationFeature, type SessionConfig, type SessionInput } from './uzu'

const feature: SessionClassificationFeature = {
  name: 'sentiment',
  values: ['Happy', 'Sad', 'Angry', 'Fearful', 'Surprised', 'Disgusted'],
}

const textToDetectFeature = "Today's been awesome! Everything just feels right, and I can't stop smiling."
const text = `Text is: "${textToDetectFeature}". Choose ${feature.name} from the list: ${feature.values.join(
  ', ',
)}. Answer with one word. Don't add a dot at the end.`

const config: SessionConfig = {
  preset: { type: 'Classification', feature },
  samplingSeed: { type: 'Default' },
  contextLength: { type: 'Default' },
}
session.load(config)

const input: SessionInput = { type: 'Text', text }

const output = session.run(
  input,
  { tokensLimit: 32, samplingConfig: { type: 'Argmax' } },
  () => true,
)
```

In this example, you will get the answer `Happy` immediately after the prefill step, and the actual generation won't even start.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.