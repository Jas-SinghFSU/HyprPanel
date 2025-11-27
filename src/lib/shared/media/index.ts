import AstalMpris from 'gi://AstalMpris?version=0.1';

const normalizeName = (name: string): string => name.toLowerCase().replace(/\s+/g, '_');

/**
 * Gets the desktop entry name from an MPRIS player.
 *
 * The desktop entry typically contains the actual application name,
 * which is more reliable than the bus name for Electron apps.
 *
 * @param player The MPRIS player.
 *
 * @returns The desktop entry name or empty string.
 */
const getDesktopEntry = (player: AstalMpris.Player): string => {
    try {
        // Desktop entry is usually the app name (e.g., "tidal-hifi", "zaap", "brave")
        return player.entry || '';
    } catch {
        return '';
    }
};

/**
 * Extracts the process name from an MPRIS bus name.
 *
 * Examples:
 * - "org.mpris.MediaPlayer2.spotify" -> "spotify"
 * - "org.mpris.MediaPlayer2.firefox.instance1234" -> "firefox"
 *
 * @param busName The MPRIS bus name.
 *
 * @returns The extracted process name.
 */
const extractProcessName = (busName: string): string => {
    const parts = busName.split('.');
    if (parts.length >= 4 && parts[0] === 'org' && parts[1] === 'mpris' && parts[2] === 'MediaPlayer2') {
        // Get the part after org.mpris.MediaPlayer2
        const processName = parts[3];
        // Remove instance suffixes if present
        return processName.split('.')[0];
    }
    return busName;
};

/**
 * Checks if a media player should be ignored based on the filter list.
 *
 * This function determines whether the provided MPRIS player should be filtered out
 * by checking the identity property.
 *
 * @param player The MPRIS player to check.
 * @param filter Array of identity names to ignore (e.g., ["Brave", "TIDAL Hi-Fi", "Zaap"]).
 *
 * @returns True if the player should be ignored, false otherwise.
 */
export const isPlayerIgnored = (
    player: AstalMpris.Player | null | undefined,
    filter: string[],
): boolean => {
    if (!player) {
        return false;
    }

    const playerFilters = new Set(filter.map(normalizeName));

    // Use identity as the primary identifier
    const identity = player.identity || '';
    const normalizedIdentity = normalizeName(identity);
    
    return playerFilters.has(normalizedIdentity);
};

/**
 * Filters a list of MPRIS players based on the ignore list.
 *
 * This function removes players from the list that match entries in the filter array.
 *
 * @param players Array of MPRIS players to filter.
 * @param filter Array of application names to ignore.
 *
 * @returns Filtered array of players.
 */
export const filterPlayers = (
    players: AstalMpris.Player[],
    filter: string[],
): AstalMpris.Player[] => {
    const filteredPlayers = players.filter((player: AstalMpris.Player) => {
        return !isPlayerIgnored(player, filter);
    });

    return filteredPlayers;
};
