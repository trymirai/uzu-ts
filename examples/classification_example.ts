import ProgressBar from 'progress'
import {
    Engine,
    Phase,
    type LicenseStatus,
    type LocalModel,
    type SessionClassificationFeature,
    type SessionConfig,
    type SessionInput,
    type SessionRunConfig,
} from '../uzu'
import { API_KEY } from './api_key'

async function main() {
    console.log('Starting Uzu Classification demo...')

    const engine = new Engine()

    // Set your Mirai API key here
    const apiKey = API_KEY

    try {
        console.log('Activating license...')
        const licenseStatus: LicenseStatus = await engine.activate(apiKey)
        console.log('License status:', licenseStatus.type)
        if (licenseStatus.type !== 'Activated' && licenseStatus.type !== 'GracePeriodActive') {
            throw new Error(`License activation failed: ${licenseStatus.type}`)
        }
    } catch (e) {
        console.error('Failed to activate license:', e)
        return
    }

    console.log('Updating model registry...')
    const registry: LocalModel[] = await engine.updateRegistry()
    console.log(`Registry updated. Found ${registry.length} models.`)

    const modelIdentifier = 'Meta-Llama-3.2-1B-Instruct-bfloat16'
    console.log(`Checking model: ${modelIdentifier}`)

    const state = engine.getState(modelIdentifier)
    if (state.phase !== Phase.Downloaded) {
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

    const session = engine.createSession({ type: 'Local', id: modelIdentifier })

    const feature: SessionClassificationFeature = {
        name: 'sentiment',
        values: ['Happy', 'Sad', 'Angry', 'Fearful', 'Surprised', 'Disgusted'],
    }

    const textToDetectFeature =
        "Today's been awesome! Everything just feels right, and I can't stop smiling."
    const classificationPrompt =
        `Text is: "${textToDetectFeature}". Choose ${feature.name} from the list: ${feature.values.join(', ')}. ` +
        "Answer with one word. Don't add a dot at the end."
    const input: SessionInput = { type: 'Text', text: classificationPrompt }

    const config: SessionConfig = {
        preset: { type: 'Classification', feature },
        samplingSeed: { type: 'Default' },
        contextLength: { type: 'Default' },
    }
    session.load(config)
    console.log('Loaded Classification preset.')

    const runConfig: SessionRunConfig = {
        tokensLimit: 32,
        samplingConfig: { type: 'Argmax' },
    }

    try {
        process.stdout.write('Prediction: ')
        let lastLength = 0
        const output = session.run(input, runConfig, (partial) => {
            const newText = partial.text.substring(lastLength)
            process.stdout.write(newText)
            lastLength = partial.text.length
            return true
        })
        console.log('\n--- End of Generation ---')
        console.log('Final Stats:', output.stats)
    } catch (e) {
        console.error('Classification session failed:', e)
    }
}

main().catch((err) => {
    console.error('Unexpected error:', err)
})


