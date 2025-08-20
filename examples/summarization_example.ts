import ProgressBar from 'progress'
import {
    Engine,
    Phase,
    type LicenseStatus,
    type LocalModel,
    type SessionConfig,
    type SessionInput,
    type SessionRunConfig,
} from '../uzu'
import { API_KEY } from './api_key'

async function main() {
    console.log('Starting Uzu Summarization demo...')

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

    const config: SessionConfig = {
        preset: { type: 'Summarization' },
        samplingSeed: { type: 'Default' },
        contextLength: { type: 'Default' },
    }
    session.load(config)
    console.log('Loaded Summarization preset.')

    const textToSummarize =
        'A Large Language Model (LLM) is a type of AI that processes and generates text using transformer-based architectures trained on vast datasets. They power chatbots, translation, code assistants, and more.'
    const input: SessionInput = {
        type: 'Text',
        text: `Text is: "${textToSummarize}". Write only summary itself.`,
    }

    const runConfig: SessionRunConfig = {
        tokensLimit: 256,
        samplingConfig: { type: 'Argmax' },
    }

    try {
        process.stdout.write('Summary: ')
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
        console.error('Summarization session failed:', e)
    }
}

main().catch((err) => {
    console.error('Unexpected error:', err)
})


