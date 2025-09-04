import {
    Engine,
    Phase,
    type LicenseStatus,
    type LocalModel,
    type ModelDownloadState,
    type ModelID,
    type SessionClassificationFeature,
    type SessionConfig,
    type SessionInput,
    type SessionRunConfig,
} from '../uzu'
import { resolvedApiKey as apiKey, createPartialOutputHandler, createProgressHandler } from './common'

async function main() {
    console.log('Starting Uzu Classification demo...')

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

    // snippet:classification-feature
    const feature: SessionClassificationFeature = {
        name: 'sentiment',
        values: ['Happy', 'Sad', 'Angry', 'Fearful', 'Surprised', 'Disgusted'],
    }
    // endsnippet:classification-feature

    // snippet:session-load
    const config: SessionConfig = {
        preset: { type: 'Classification', feature },
        samplingSeed: { type: 'Default' },
        contextLength: { type: 'Default' },
    }
    session.load(config)
    // endsnippet:session-load

    console.log('Loaded Classification preset.')

    // snippet:session-input
    const textToDetectFeature =
        "Today's been awesome! Everything just feels right, and I can't stop smiling."
    const classificationPrompt =
        `Text is: "${textToDetectFeature}". Choose ${feature.name} from the list: ${feature.values.join(', ')}. ` +
        "Answer with one word. Don't add a dot at the end."
    const input: SessionInput = { type: 'Text', text: classificationPrompt }
    // endsnippet:session-input

    // snippet:session-run-config
    const runConfig: SessionRunConfig = {
        tokensLimit: 32,
        samplingConfig: { type: 'Argmax' },
    }
    // endsnippet:session-run-config

    try {
        process.stdout.write('Prediction: ')
        const handlePartialOutput = createPartialOutputHandler()
        // snippet:session-run
        const output = session.run(input, runConfig, (partialOutput) => {
            return handlePartialOutput(partialOutput)
        })
        // endsnippet:session-run
        console.log('\n--- End of Generation ---')
        console.log('Final Stats:', output.stats)
    } catch (e) {
        console.error('Classification session failed:', e)
    }
}

main().catch((err) => {
    console.error('Unexpected error:', err)
})


