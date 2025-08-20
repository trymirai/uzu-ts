import ProgressBar from 'progress'
import {
    Engine,
    Phase,
    SessionMessageRole,
    type LicenseStatus,
    type LocalModel,
    type ModelID,
    type SessionConfig,
    type SessionInput,
    type SessionMessage,
    type SessionRunConfig,
} from '../uzu'
import { API_KEY } from './api_key'

function createMessagesInput(messages: SessionMessage[]): SessionInput {
    return { type: 'Messages', messages }
}

async function main() {
    console.log('Starting Uzu showcase...')

    const engine = new Engine()

    const apiKey = API_KEY

    try {
        console.log('Activating license...')
        const licenseStatus: LicenseStatus = await engine.activate(apiKey)
        console.log('License status:', licenseStatus.type)
        if (
            licenseStatus.type !== 'Activated' &&
            licenseStatus.type !== 'GracePeriodActive'
        ) {
            throw new Error(`License activation failed: ${licenseStatus.type}`)
        }
    } catch (e) {
        console.error('Failed to activate license:', e)
        return
    }

    console.log('Updating model registry...')
    const registry: LocalModel[] = await engine.updateRegistry()
    console.log(`Registry updated. Found ${registry.length} models.`)
    // To explore available cloud models instead, uncomment:
    // const cloudModels = await engine.getCloudModels()
    // console.log('Available cloud models:', cloudModels)

    const modelIdentifier = 'Meta-Llama-3.2-1B-Instruct-bfloat16'
    console.log(`Checking model: ${modelIdentifier}`)

    const modelState = engine.getState(modelIdentifier)
    if (modelState.phase !== Phase.Downloaded) {
        console.log('Model not downloaded. Starting download...')
        const handle = engine.downloadHandle(modelIdentifier)
        handle.start()

        let bar: ProgressBar | null = null
        for await (const upd of handle.progress()) {
            if (!bar) {
                if (upd.totalBytes) {
                    const totalKiB = Math.floor(upd.totalBytes / 1024)
                    bar = new ProgressBar('Downloading [:bar] :percent | :current/:total KiB', {
                        total: totalKiB,
                        width: 30,
                    })
                } else {
                    bar = new ProgressBar('Downloading [:bar] :percent', {
                        total: 1000,
                        width: 30,
                    })
                }
            }

            bar.update(Math.min(upd.progress, 1))
            if (upd.progress >= 1.0) break
        }
        if (bar) bar.terminate()
    }

    console.log('Model is ready for use.')

    // Choose one of the two options below by commenting/uncommenting:
    // 1) Local model (default)
    // const modelId: ModelID = { type: 'Local', id: modelIdentifier }
    // 2) Cloud model (uncomment the line below and set your repoId; also comment out the Local registry/download section above)
    const cloudRepoId = 'meta-llama/Llama-4-Maverick-17B-128E-Instruct'
    const modelId: ModelID = { type: 'Cloud', id: cloudRepoId }

    const session = engine.createSession(modelId)

    const chatConfig: SessionConfig = {
        preset: { type: 'General' },
        samplingSeed: { type: 'Custom', seed: 12345 },
        contextLength: { type: 'Default' },
    }
    session.load(chatConfig)
    console.log('Loaded General Chat preset.')

    const chatInput = createMessagesInput([
        { role: SessionMessageRole.System, content: 'You are a helpful assistant.' },
        { role: SessionMessageRole.User, content: 'Tell me a short, funny story about a robot.' },
    ])

    const chatRunConfig: SessionRunConfig = {
        tokensLimit: 128,
        samplingConfig: { type: 'Argmax' },
    }

    try {
        console.log('User: Tell me a short, funny story about a robot.')
        process.stdout.write('Assistant: ')
        let lastLength = 0
        const chatOutput = session.run(chatInput, chatRunConfig, (partialOutput) => {
            const newText = partialOutput.text.substring(lastLength)
            process.stdout.write(newText)
            lastLength = partialOutput.text.length
            return true
        })
        console.log('\n--- End of Generation ---')
        console.log('Final Stats:', chatOutput.stats)
    } catch (e) {
        console.error('Chat session failed:', e)
    }
}

main().catch((err) => {
    console.error('An unexpected error occurred:', err)
})


