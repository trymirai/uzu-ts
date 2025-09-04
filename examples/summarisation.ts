import {
    Engine,
    Phase,
    type LicenseStatus,
    type LocalModel,
    type ModelDownloadState,
    type ModelID,
    type SessionConfig,
    type SessionInput,
    type SessionRunConfig,
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
    const localModelId = 'Meta-Llama-3.2-1B-Instruct-bfloat16'

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

    const modelId: ModelID = { type: 'Local', id: localModelId }
    const session = engine.createSession(modelId)

    // snippet:session-load
    const config: SessionConfig = {
        preset: { type: 'Summarization' },
        samplingSeed: { type: 'Default' },
        contextLength: { type: 'Default' },
    }
    session.load(config)
    // endsnippet:session-load

    console.log('Loaded Summarization preset.')

    const textToSummarize =
        'A Large Language Model (LLM) is a type of AI that processes and generates text using transformer-based architectures trained on vast datasets. They power chatbots, translation, code assistants, and more.'
    // snippet:session-input
    const input: SessionInput = {
        type: 'Text',
        text: `Text is: "${textToSummarize}". Write only summary itself.`,
    }
    // endsnippet:session-input

    // snippet:session-run-config
    const runConfig: SessionRunConfig = {
        tokensLimit: 256,
        samplingConfig: { type: 'Argmax' },
    }
    // endsnippet:session-run-config

    try {
        process.stdout.write('Summary: ')
        const handlePartialOutput = createPartialOutputHandler()
        // snippet:session-run
        const output = session.run(input, runConfig, (partialOutput) => {
            return handlePartialOutput(partialOutput)
        })
        // endsnippet:session-run
        console.log('\n--- End of Generation ---')
        console.log('Final Stats:', output.stats)
    } catch (e) {
        console.error('Summarization session failed:', e)
    }
}

main().catch((err) => {
    console.error('Unexpected error:', err)
})


