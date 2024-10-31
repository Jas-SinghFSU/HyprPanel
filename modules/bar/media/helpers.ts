import { MediaTags } from 'lib/types/audio.js';
import { Opt } from 'lib/option';
import { Variable } from 'types/variable';
import { MprisPlayer } from 'types/service/mpris';

const getIconForPlayer = (playerName: string): string => {
    const windowTitleMap = [
        ['Firefox', '󰈹'],
        ['Microsoft Edge', '󰇩'],
        ['Discord', ''],
        ['Plex', '󰚺'],
        ['Spotify', '󰓇'],
        ['(.*)', '󰝚'],
    ];

    const foundMatch = windowTitleMap.find((wt) => RegExp(wt[0], 'i').test(playerName));

    return foundMatch ? foundMatch[1] : '󰝚';
};

const isValidMediaTag = (tag: unknown): tag is keyof MediaTags => {
    if (typeof tag !== 'string') {
        return false;
    }

    const mediaTagKeys = ['title', 'artists', 'artist', 'album', 'name', 'identity'] as const;
    return (mediaTagKeys as readonly string[]).includes(tag);
};

export const generateMediaLabel = (
    truncation_size: Opt<number>,
    show_label: Opt<boolean>,
    format: Opt<string>,
    songIcon: Variable<string>,
    activePlayer: Variable<MprisPlayer>,
): string => {
    if (activePlayer.value && show_label.value) {
        const { track_title, identity, track_artists, track_album, name } = activePlayer.value;
        songIcon.value = getIconForPlayer(identity);

        const mediaTags: MediaTags = {
            title: track_title,
            artists: track_artists.join(', '),
            artist: track_artists[0] || '',
            album: track_album,
            name: name,
            identity: identity,
        };

        const mediaFormat = format.getValue();

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

        const mediaLabel =
            truncation_size.value > 0 ? truncatedLabel.substring(0, truncation_size.value) : truncatedLabel;

        return mediaLabel.length ? mediaLabel : 'Media';
    } else {
        songIcon.value = getIconForPlayer(activePlayer.value?.identity || '');
        return `Media`;
    }
};
