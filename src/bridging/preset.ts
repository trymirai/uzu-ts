import { Preset as NapiPreset } from '../napi/uzu';
import { ClassificationFeature } from './classificationFeature';
import { ToNapi } from './napi';

export class Preset implements ToNapi<NapiPreset> {
    private readonly napiPreset: NapiPreset;

    private constructor(napiPreset: NapiPreset) {
        this.napiPreset = napiPreset;
    }

    static general(): Preset {
        const napiPreset: NapiPreset = { type: 'General' };
        return new Preset(napiPreset);
    }

    static classification(feature: ClassificationFeature): Preset {
        const napiClassificationFeature = feature.toNapi();
        const napiPreset: NapiPreset = {
            type: 'Classification',
            feature: napiClassificationFeature,
        };
        return new Preset(napiPreset);
    }

    static summarization(): Preset {
        const napiPreset: NapiPreset = { type: 'Summarization' };
        return new Preset(napiPreset);
    }

    toNapi(): NapiPreset {
        return this.napiPreset;
    }
}
