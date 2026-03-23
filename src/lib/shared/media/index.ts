import AstalMpris from 'gi://AstalMpris?version=0.1';

const normalizeName = (name: string): string => name.toLowerCase().replace(/\s+/g, '_');

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
export const isPlayerIgnored = (player: AstalMpris.Player | null | undefined, filter: string[]): boolean => {
    if (!player) {
        return false;
    }

    const playerFilters = new Set(filter.map(normalizeName));

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
export const filterPlayers = (players: AstalMpris.Player[], filter: string[]): AstalMpris.Player[] => {
    const filteredPlayers = players.filter((player: AstalMpris.Player) => {
        return !isPlayerIgnored(player, filter);
    });

    return filteredPlayers;
};
