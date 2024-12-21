import { MediaTags } from 'src/lib/types/audio.js';
import { Opt } from 'src/lib/option';
import AstalMpris from 'gi://AstalMpris?version=0.1';
import { Variable } from 'astal';

/**
 * Retrieves the icon for a given media player.
 *
 * This function returns the appropriate icon for the provided media player name based on a predefined mapping.
 * If no match is found, it returns a default icon.
 *
 * @param playerName The name of the media player.
 *
 * @returns The icon for the media player as a string.
 */
const getIconForPlayer = (playerName: string): string => {
    const windowTitleMap = [
        ['Firefox', '󰈹'],
        ['Microsoft Edge', '󰇩'],
        ['Discord', ''],
        ['Plex', '󰚺'],
        ['Spotify', '󰓇'],
        ['Vlc', '󰕼'],
        ['Mpv', ''],
        ['Rhythmbox', '󰓃'],
        ['Google Chrome', ''],
        ['Brave Browser', '󰖟'],
        ['Chromium', ''],
        ['Opera', ''],
        ['Vivaldi', '󰖟'],
        ['Waterfox', '󰈹'],
        ['Thorium', '󰈹'],
        ['Zen Browser', '󰈹'],
        ['Floorp', '󰈹'],
        ['(.*)', '󰝚'],
    ];

    const foundMatch = windowTitleMap.find((wt) => RegExp(wt[0], 'i').test(playerName));

    return foundMatch ? foundMatch[1] : '󰝚';
};

/**
 * Checks if a given tag is a valid media tag.
 *
 * This function determines whether the provided tag is a valid media tag by checking it against a predefined list of media tag keys.
 *
 * @param tag The tag to check.
 *
 * @returns True if the tag is a valid media tag, false otherwise.
 */
const isValidMediaTag = (tag: unknown): tag is keyof MediaTags => {
    if (typeof tag !== 'string') {
        return false;
    }

    const mediaTagKeys = ['title', 'artists', 'artist', 'album', 'name', 'identity'] as const;
    return (mediaTagKeys as readonly string[]).includes(tag);
};

/**
 * Generates a media label based on the provided options.
 *
 * This function creates a media label string by formatting the media tags according to the specified format.
 * It truncates the label if it exceeds the specified truncation size and returns a default label if no media is playing.
 *
 * @param truncation_size The maximum size of the label before truncation.
 * @param show_label A boolean indicating whether to show the label.
 * @param format The format string for the media label.
 * @param songIcon A variable to store the icon for the current song.
 * @param activePlayer A variable representing the active media player.
 *
 * @returns The generated media label as a string.
 */
export const generateMediaLabel = (
    truncation_size: Opt<number>,
    show_label: Opt<boolean>,
    format: Opt<string>,
    songIcon: Variable<string>,
    activePlayer: Variable<AstalMpris.Player | undefined>,
): string => {
    const currentPlayer = activePlayer.get();

    if (!currentPlayer || !show_label.get()) {
        songIcon.set(getIconForPlayer(activePlayer.get()?.identity || ''));
        return `Media`;
    }

    const { title, identity, artist, album, busName } = currentPlayer;
    songIcon.set(getIconForPlayer(identity));

    const mediaTags: MediaTags = {
        title: title,
        artists: artist,
        artist: artist,
        album: album,
        name: busName,
        identity: identity,
    };

    const mediaFormat = format.get();

    const truncatedLabel = mediaFormat.replace(
        /{(title|artists|artist|album|name|identity)(:[^}]*)?}/g,
        (_, p1: string | undefined, p2: string | undefined) => {
            if (!isValidMediaTag(p1)) {
                return '';
            }
            const value = p1 !== undefined ? mediaTags[p1] : '';
            const suffix = p2?.length ? p2.slice(1) : '';
            return value ? value + suffix : '';
        },
    );

    const maxLabelSize = truncation_size.get();

    let mediaLabel = truncatedLabel;

    if (maxLabelSize > 0 && truncatedLabel.length > maxLabelSize) {
        mediaLabel = `${truncatedLabel.substring(0, maxLabelSize)}...`;
    }

    return mediaLabel.length ? mediaLabel : 'Media';
};
