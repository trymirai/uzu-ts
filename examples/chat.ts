import {
    Engine,
    Phase,
    SessionMessageRole,
    type LicenseStatus,
    type LocalModel,
    type ModelDownloadState,
    type ModelID,
    type Session,
    type SessionConfig,
    type SessionInput,
    type SessionRunConfig,
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
    const localModelId = 'Meta-Llama-3.2-1B-Instruct-bfloat16'

    // endsnippet:registry

    console.log(`Registry updated. Found ${localModels.length} models.`)
    console.log(`Checking model: ${localModelId}`)

    // snippet:model-state

    // engine.download(localModelId)
    // engine.pause(localModelId)
    // engine.resume(localModelId)
    // engine.stop(localModelId)
    // engine.delete(localModelId)

    const modelState: ModelDownloadState = engine.getState(localModelId)

    // endsnippet:model-state

    if (modelState.phase !== Phase.Downloaded) {
        console.log('Model not downloaded. Starting download...')

        const handleProgress = createProgressHandler()

        // snippet:download

        const donwloadHandle = engine.downloadHandle(localModelId)
        donwloadHandle.start()

        for await (const donwloadProgress of donwloadHandle.progress()) {
            handleProgress(donwloadProgress)
        }
        // endsnippet:download
    }


    console.log('Model is ready for use.')

    // snippet:session-create

    // Choose one of the two options below by commenting/uncommenting:
    // const modelId: ModelID = { type: 'Cloud', id: cloudRepoId }
    const modelId: ModelID = { type: 'Local', id: localModelId }
    const session: Session = engine.createSession(modelId)

    // endsnippet:session-create

    // snippet:session-load
    const config: SessionConfig = {
        preset: { type: 'General' },
        samplingSeed: { type: 'Custom', seed: 12345 },
        contextLength: { type: 'Default' },
    }
    session.load(config)
    // endsnippet:session-load

    console.log('Loaded General Chat preset.')

    // snippet:session-input
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
    // endsnippet:session-input

    // snippet:session-run-config
    const runConfig: SessionRunConfig = {
        tokensLimit: 128,
        samplingConfig: { type: 'Argmax' },
    }
    // endsnippet:session-run-config

    try {
        console.log('User: Tell me a short, funny story about a robot.')
        process.stdout.write('Assistant: ')
        const handlePartialOutput = createPartialOutputHandler()
        // snippet:session-run
        const output = session.run(input, runConfig, (partialOutput) => {
            return handlePartialOutput(partialOutput)
        })
        // endsnippet:session-run
        console.log('\n--- End of Generation ---')
        console.log('Final Stats:', output.stats)
    } catch (e) {
        console.error('Chat session failed:', e)
    }
}

main().catch((err) => {
    console.error('An unexpected error occurred:', err)
})


