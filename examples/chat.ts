import {
    Engine,
    Phase,
    Role,
    type Config,
    type Input,
    type LicenseStatus,
    type LocalModel,
    type ModelDownloadState,
    type ModelID,
    type RunConfig,
    type Session,
} from '../uzu'
import { resolvedApiKey as apiKey, createPartialOutputHandler, createProgressHandler } from './common'

async function main() {
    console.log('Starting Uzu showcase...')

    // snippet:activation
    const engine = new Engine()
    const licenseStatus: LicenseStatus = await engine.activate(apiKey)
    // endsnippet:activation

    console.log('License status:', licenseStatus.type)

    if (
        licenseStatus.type !== 'Activated' &&
        licenseStatus.type !== 'GracePeriodActive'
    ) {
        console.error('Failed to activate license:', licenseStatus.type)
        return
    }

    console.log('Updating model registry...')

    // snippet:registry
    const localModels: LocalModel[] = await engine.updateRegistry()
    const localModelId = 'Meta-Llama-3.2-1B-Instruct'
    // endsnippet:registry

    console.log(`Registry updated. Found ${localModels.length} models.`)
    console.log(`Checking model: ${localModelId}`)

    // snippet:storage-methods
    const modelState: ModelDownloadState = engine.getState(localModelId)

    // engine.download(localModelId)
    // engine.pause(localModelId)
    // engine.resume(localModelId)
    // engine.stop(localModelId)
    // engine.delete(localModelId)
    // endsnippet:storage-methods

    if (modelState.phase !== Phase.Downloaded) {
        console.log('Model not downloaded. Starting download...')

        const handleProgress = createProgressHandler()

        // snippet:download-handle
        const donwloadHandle = engine.downloadHandle(localModelId)
        donwloadHandle.start()

        for await (const donwloadProgress of donwloadHandle.progress()) {
            // Implement a custom download progress handler
            handleProgress(donwloadProgress)
        }
        // endsnippet:download-handle
    }


    console.log('Model is ready for use.')

    // snippet:session-create-general
    const modelId: ModelID = { type: 'Local', id: localModelId }
    const config: Config = {
        preset: { type: 'General' },
        prefillStepSize: { type: 'Default' },
        contextLength: { type: 'Default' },
        samplingSeed: { type: 'Default' },
    }
    const session: Session = engine.createSession(modelId, config)
    // endsnippet:session-create-general

    console.log('Loaded General Chat preset.')

    // snippet:session-input-general
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
    // endsnippet:session-input-general

    try {
        console.log('User: Tell me a short, funny story about a robot.')
        process.stdout.write('Assistant: ')
        const handlePartialOutput = createPartialOutputHandler()
        // snippet:session-run-general
        const runConfig: RunConfig = {
            tokensLimit: 128,
            enableThinking: true,
            samplingPolicy: { type: 'Default' },
        }

        const output = session.run(input, runConfig, (partialOutput) => {
            // Implement a custom partial output handler
            return handlePartialOutput(partialOutput)
        })
        // endsnippet:session-run-general
        console.log('\n--- End of Generation ---')
        console.log('Final Stats:', output.stats)
    } catch (e) {
        console.error('Chat session failed:', e)
    }
}

main().catch((err) => {
    console.error('An unexpected error occurred:', err)
})


