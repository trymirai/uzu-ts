import {
    Engine,
    Phase,
    type Config,
    type Input,
    type LicenseStatus,
    type LocalModel,
    type ModelDownloadState,
    type ModelID,
    type RunConfig,
} from '../uzu'
import { resolvedApiKey as apiKey, createPartialOutputHandler, createProgressHandler } from './common'

async function main() {
    console.log('Starting Uzu Summarization demo...')

    const engine = new Engine()
    const licenseStatus: LicenseStatus = await engine.activate(apiKey)

    console.log('License status:', licenseStatus.type)

    if (
        licenseStatus.type !== 'Activated' &&
        licenseStatus.type !== 'GracePeriodActive'
    ) {
        console.error('Failed to activate license:', licenseStatus.type)
        return
    }

    console.log('Updating model registry...')

    const localModels: LocalModel[] = await engine.updateRegistry()
    const localModelId = 'Meta-Llama-3.2-1B-Instruct'

    console.log(`Registry updated. Found ${localModels.length} models.`)
    console.log(`Checking model: ${localModelId}`)

    const modelState: ModelDownloadState = engine.getState(localModelId)
    if (modelState.phase !== Phase.Downloaded) {
        console.log('Model not downloaded. Starting download...')

        const handleProgress = createProgressHandler()

        const donwloadHandle = engine.downloadHandle(localModelId)
        donwloadHandle.start()

        for await (const donwloadProgress of donwloadHandle.progress()) {
            handleProgress(donwloadProgress)
        }
    }

    console.log('Model is ready for use.')

    // snippet:session-create-summarization
    const modelId: ModelID = { type: 'Local', id: localModelId }
    const config: Config = {
        preset: { type: 'Summarization' },
        prefillStepSize: { type: 'Default' },
        contextLength: { type: 'Default' },
        samplingSeed: { type: 'Default' },
    }
    const session = engine.createSession(modelId, config)
    // endsnippet:session-create-summarization

    console.log('Loaded Summarization preset.')

    // snippet:session-input-summarization
    const textToSummarize =
        'A Large Language Model (LLM) is a type of AI that processes and generates text using transformer-based architectures trained on vast datasets. They power chatbots, translation, code assistants, and more.'
    const input: Input = {
        type: 'Text',
        text: `Text is: "${textToSummarize}". Write only summary itself.`,
    }
    // endsnippet:session-input-summarization

    try {
        process.stdout.write('Summary: ')
        const handlePartialOutput = createPartialOutputHandler()
        // snippet:session-run-summarization
        const runConfig: RunConfig = {
            tokensLimit: 256,
            enableThinking: true,
            samplingPolicy: { type: 'Custom', value: { type: 'Greedy' } },
        }

        const output = session.run(input, runConfig, (partialOutput) => {
            // Implement a custom partial output handler
            return handlePartialOutput(partialOutput)
        })
        // endsnippet:session-run-summarization
        console.log('\n--- End of Generation ---')
        console.log('Final Stats:', output.stats)
    } catch (e) {
        console.error('Summarization session failed:', e)
    }
}

main().catch((err) => {
    console.error('Unexpected error:', err)
})


