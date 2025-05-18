import { distroIcons } from '../../lib/constants/distro';
import { distro } from '../../lib/variables';

/**
 * Retrieves the icon for the current distribution
 * @returns The icon for the current distribution as a string
 */
export function getDistroIcon(): string {
    const icon = distroIcons.find(([id]) => id === distro.id);
    return icon ? icon[1] : '';
}
