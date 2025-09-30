import {
    Engine,
    Phase,
    type ClassificationFeature,
    type Config,
    type Input,
    type LicenseStatus,
    type LocalModel,
    type ModelDownloadState,
    type ModelID,
    type RunConfig
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

    // snippet:session-create-classification
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
    // endsnippet:session-create-classification

    console.log('Loaded Classification preset.')

    // snippet:session-input-classification
    const textToDetectFeature =
        "Today's been awesome! Everything just feels right, and I can't stop smiling."
    const classificationPrompt =
        `Text is: "${textToDetectFeature}". Choose ${feature.name} from the list: ${feature.values.join(', ')}. ` +
        "Answer with one word. Don't add a dot at the end."
    const input: Input = { type: 'Text', text: classificationPrompt }
    // endsnippet:session-input-classification

    try {
        process.stdout.write('Prediction: ')
        const handlePartialOutput = createPartialOutputHandler()
        // snippet:session-run-classification
        const runConfig: RunConfig = {
            tokensLimit: 32,
            enableThinking: true,
            samplingPolicy: { type: 'Custom', value: { type: 'Greedy' } },
        }

        const output = session.run(input, runConfig, (partialOutput) => {
            // Implement a custom partial output handler
            return handlePartialOutput(partialOutput)
        })
        // endsnippet:session-run-classification
        console.log('\n--- End of Generation ---')
        console.log('Final Stats:', output.stats)
    } catch (e) {
        console.error('Classification session failed:', e)
    }
}

main().catch((err) => {
    console.error('Unexpected error:', err)
})


