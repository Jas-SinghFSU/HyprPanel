const speakerIcons = {
    101: 'audio-volume-overamplified-symbolic',
    66: 'audio-volume-high-symbolic',
    34: 'audio-volume-medium-symbolic',
    1: 'audio-volume-low-symbolic',
    0: 'audio-volume-muted-symbolic',
} as const;

const inputIcons = {
    101: 'microphone-sensitivity-high-symbolic',
    66: 'microphone-sensitivity-high-symbolic',
    34: 'microphone-sensitivity-medium-symbolic',
    1: 'microphone-sensitivity-low-symbolic',
    0: 'microphone-disabled-symbolic',
};

type IconVolumes = keyof typeof speakerIcons;

const getIcon = (audioVol: number, isMuted: boolean): Record<string, string> => {
    const thresholds: IconVolumes[] = [101, 66, 34, 1, 0];
    const icon = isMuted ? 0 : thresholds.find((threshold) => threshold <= audioVol * 100) || 0;

    return {
        spkr: speakerIcons[icon],
        mic: inputIcons[icon],
    };
};

export { getIcon };
