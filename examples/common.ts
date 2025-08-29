import ProgressBar from 'progress'
import type { ProgressUpdate, SessionOutput } from '../uzu'

// Visit https://platform.trymirai.com/ to get your API key.
export const apiKey = 'MIRAI_API_KEY'

export function createProgressHandler(): (upd: ProgressUpdate) => void {
    let bar: ProgressBar | null = null
    return (upd: ProgressUpdate): void => {
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
        if (upd.progress >= 1.0) {
            bar?.terminate?.()
        }
    }
}

export function createPartialOutputHandler(): (partial: SessionOutput) => boolean {
    let lastLength = 0
    return (partial: SessionOutput): boolean => {
        const newText = partial.text.substring(lastLength)
        process.stdout.write(newText)
        lastLength = partial.text.length
        return true
    }
}


