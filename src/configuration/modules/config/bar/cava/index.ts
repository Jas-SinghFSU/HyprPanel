import { opt } from 'src/lib/options';

export default {
    showIcon: opt(true),
    icon: opt(''),
    spaceCharacter: opt(' '),
    barCharacters: opt(['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█']),
    showActiveOnly: opt(false),
    bars: opt(10),
    channels: opt(2),
    framerate: opt(60),
    samplerate: opt(44100),
    autoSensitivity: opt(true),
    lowCutoff: opt(50),
    highCutoff: opt(10000),
    noiseReduction: opt(0.77),
    stereo: opt(false),
    leftClick: opt(''),
    rightClick: opt(''),
    middleClick: opt(''),
    scrollUp: opt(''),
    scrollDown: opt(''),
};
