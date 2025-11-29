import { Config as NapiConfig } from '../napi/uzu';
import { AsyncBatchSize } from './asyncBatchSize';
import { ContextLength } from './contextLength';
import { ContextMode } from './contextMode';
import { ToNapi } from './napi';
import { PrefillStepSize } from './prefillStepSize';
import { Preset } from './preset';
import { SamplingSeed } from './samplingSeed';

export class Config implements ToNapi<NapiConfig> {
    readonly preset: Preset;
    readonly contextMode: ContextMode;
    readonly contextLength: ContextLength;
    readonly prefillStepSize: PrefillStepSize;
    readonly samplingSeed: SamplingSeed;
    readonly asyncBatchSize: AsyncBatchSize;

    constructor(
        preset: Preset,
        contextMode: ContextMode,
        contextLength: ContextLength,
        prefillStepSize: PrefillStepSize,
        samplingSeed: SamplingSeed,
        asyncBatchSize: AsyncBatchSize,
    ) {
        this.preset = preset;
        this.contextMode = contextMode;
        this.contextLength = contextLength;
        this.prefillStepSize = prefillStepSize;
        this.samplingSeed = samplingSeed;
        this.asyncBatchSize = asyncBatchSize;
    }

    static default(): Config {
        return new Config(
            Preset.general(),
            ContextMode.none(),
            ContextLength.default(),
            PrefillStepSize.default(),
            SamplingSeed.default(),
            AsyncBatchSize.default(),
        );
    }

    withPreset(preset: Preset): Config {
        return new Config(
            preset,
            this.contextMode,
            this.contextLength,
            this.prefillStepSize,
            this.samplingSeed,
            this.asyncBatchSize,
        );
    }

    withContextMode(contextMode: ContextMode): Config {
        return new Config(
            this.preset,
            contextMode,
            this.contextLength,
            this.prefillStepSize,
            this.samplingSeed,
            this.asyncBatchSize,
        );
    }

    withContextLength(contextLength: ContextLength): Config {
        return new Config(
            this.preset,
            this.contextMode,
            contextLength,
            this.prefillStepSize,
            this.samplingSeed,
            this.asyncBatchSize,
        );
    }

    withPrefillStepSize(prefillStepSize: PrefillStepSize): Config {
        return new Config(
            this.preset,
            this.contextMode,
            this.contextLength,
            prefillStepSize,
            this.samplingSeed,
            this.asyncBatchSize,
        );
    }

    withSamplingSeed(samplingSeed: SamplingSeed): Config {
        return new Config(
            this.preset,
            this.contextMode,
            this.contextLength,
            this.prefillStepSize,
            samplingSeed,
            this.asyncBatchSize,
        );
    }

    withAsyncBatchSize(asyncBatchSize: AsyncBatchSize): Config {
        return new Config(
            this.preset,
            this.contextMode,
            this.contextLength,
            this.prefillStepSize,
            this.samplingSeed,
            asyncBatchSize,
        );
    }

    toNapi(): NapiConfig {
        const napiConfig: NapiConfig = {
            preset: this.preset.toNapi(),
            contextMode: this.contextMode.toNapi(),
            contextLength: this.contextLength.toNapi(),
            prefillStepSize: this.prefillStepSize.toNapi(),
            samplingSeed: this.samplingSeed.toNapi(),
            asyncBatchSize: this.asyncBatchSize.toNapi(),
        };
        return napiConfig;
    }
}
