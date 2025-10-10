import { Config as NapiConfig } from '../napi/uzu';
import { ContextLength } from './contextLength';
import { ToNapi } from './napi';
import { PrefillStepSize } from './prefillStepSize';
import { Preset } from './preset';
import { SamplingSeed } from './samplingSeed';

export class Config implements ToNapi<NapiConfig> {
    readonly preset: Preset;
    readonly prefillStepSize: PrefillStepSize;
    readonly contextLength: ContextLength;
    readonly samplingSeed: SamplingSeed;

    constructor(
        preset: Preset,
        prefillStepSize: PrefillStepSize,
        contextLength: ContextLength,
        samplingSeed: SamplingSeed,
    ) {
        this.preset = preset;
        this.prefillStepSize = prefillStepSize;
        this.contextLength = contextLength;
        this.samplingSeed = samplingSeed;
    }

    static default(): Config {
        return new Config(
            Preset.general(),
            PrefillStepSize.default(),
            ContextLength.default(),
            SamplingSeed.default(),
        );
    }

    withPreset(preset: Preset): Config {
        return new Config(preset, this.prefillStepSize, this.contextLength, this.samplingSeed);
    }

    withPrefillStepSize(prefillStepSize: PrefillStepSize): Config {
        return new Config(this.preset, prefillStepSize, this.contextLength, this.samplingSeed);
    }

    withContextLength(contextLength: ContextLength): Config {
        return new Config(this.preset, this.prefillStepSize, contextLength, this.samplingSeed);
    }

    withSamplingSeed(samplingSeed: SamplingSeed): Config {
        return new Config(this.preset, this.prefillStepSize, this.contextLength, samplingSeed);
    }

    toNapi(): NapiConfig {
        const napiConfig: NapiConfig = {
            preset: this.preset.toNapi(),
            prefillStepSize: this.prefillStepSize.toNapi(),
            contextLength: this.contextLength.toNapi(),
            samplingSeed: this.samplingSeed.toNapi(),
        };
        return napiConfig;
    }
}
