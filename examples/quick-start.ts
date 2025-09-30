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

async function main() {
    //activate
    const engine = new Engine()
    const licenseStatus: LicenseStatus = await engine.activate("API_KEY")
    if (
        licenseStatus.type !== 'Activated' &&
        licenseStatus.type !== 'GracePeriodActive'
    ) {
        return
    }

    //update models list
    const localModels: LocalModel[] = await engine.updateRegistry()
    const localModelId = 'Meta-Llama-3.2-1B-Instruct'

    //download model
    const modelState: ModelDownloadState = engine.getState(localModelId)
    if (modelState.phase !== Phase.Downloaded) {
        const donwloadHandle = engine.downloadHandle(localModelId)
        donwloadHandle.start()
        for await (const donwloadProgress of donwloadHandle.progress()) {
            console.log("Progress:", donwloadProgress.progress)
        }
    }

    //create inference session
    const modelId: ModelID = { type: 'Local', id: localModelId }
    const config: Config = {
        preset: { type: 'General' },
        prefillStepSize: { type: 'Default' },
        contextLength: { type: 'Default' },
        samplingSeed: { type: 'Default' },
    }
    const session: Session = engine.createSession(modelId, config)

    //create input
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

    //run
    const runConfig: RunConfig = {
        tokensLimit: 128,
        enableThinking: true,
        samplingPolicy: { type: 'Default' },
    }
    try {
        const output = session.run(input, runConfig, (partialOutput) => {
            return true
        })
        console.log('Output:', output)
    } catch (err) {
        console.error('Error:', err)
    }
}

main().catch((err) => {
    console.error('An unexpected error occurred:', err)
})