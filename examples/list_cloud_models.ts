import { Engine, type CloudModel, type LicenseStatus } from '../uzu'
import { API_KEY } from './api_key'

async function main() {
    const engine = new Engine()
    const apiKey = API_KEY

    try {
        const licenseStatus: LicenseStatus = await engine.activate(apiKey)
        if (
            licenseStatus.type !== 'Activated' &&
            licenseStatus.type !== 'GracePeriodActive'
        ) {
            throw new Error(`License activation failed: ${licenseStatus.type}`)
        }
    } catch (e) {
        console.error('Failed to activate license:', e)
        process.exit(1)
    }

    try {
        const models: CloudModel[] = await engine.getCloudModels()
        console.log(JSON.stringify(models, null, 2))
    } catch (e) {
        console.error('Failed to fetch cloud models:', e)
        process.exit(1)
    }
}

main()
