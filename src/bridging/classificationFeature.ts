import { ClassificationFeature as NapiClassificationFeature } from '../napi/uzu';
import { ToNapi } from './napi';

export class ClassificationFeature implements ToNapi<NapiClassificationFeature> {
    readonly name: string;
    readonly values: string[];

    constructor(name: string, values: string[]) {
        this.name = name;
        this.values = values;
    }

    toNapi(): NapiClassificationFeature {
        const result: NapiClassificationFeature = {
            name: this.name,
            values: this.values,
        };
        return result;
    }
}
