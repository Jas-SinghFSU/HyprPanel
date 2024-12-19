import { VolumeIcons } from 'src/lib/types/volume';

const icons: VolumeIcons = {
    101: '󰕾',
    66: '󰕾',
    34: '󰖀',
    1: '󰕿',
    0: '󰝟',
};

/**
 * Retrieves the appropriate volume icon based on the volume level and mute status.
 *
 * This function returns the corresponding volume icon based on the provided volume level and mute status.
 * It uses predefined mappings for volume icons.
 *
 * @param isMuted A boolean indicating whether the volume is muted.
 * @param vol The current volume level as a number between 0 and 1.
 *
 * @returns The corresponding volume icon as a string.
 */
export const getIcon = (isMuted: boolean, vol: number): string => {
    if (isMuted) return icons[0];

    const foundVol = [101, 66, 34, 1, 0].find((threshold) => threshold <= vol * 100);

    if (foundVol !== undefined) {
        return icons[foundVol];
    }

    return icons[101];
};
