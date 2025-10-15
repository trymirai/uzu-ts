import Engine, { ClassificationFeature, Preset, SamplingMethod } from '@trymirai/uzu';

async function main() {
    const feature = new ClassificationFeature('sentiment', [
        'Happy',
        'Sad',
        'Angry',
        'Fearful',
        'Surprised',
        'Disgusted',
    ]);
    const textToDetectFeature =
        "Today's been awesome! Everything just feels right, and I can't stop smiling.";
    const prompt =
        `Text is: "${textToDetectFeature}". Choose ${feature.name} from the list: ${feature.values.join(', ')}. ` +
        "Answer with one word. Don't add a dot at the end.";

    const output = await Engine.create('API_KEY')
        .model('Qwen/Qwen3-0.6B')
        .download((update) => {
            console.log('Progress:', update.progress);
        })
        .preset(Preset.classification(feature))
        .session()
        .tokensLimit(32)
        .enableThinking(false)
        .samplingMethod(SamplingMethod.greedy())
        .reply(prompt);

    console.log('Prediction:', output.text.original);
    console.log('Stats:', output.stats);
}

main().catch((error) => {
    console.error(error);
});
