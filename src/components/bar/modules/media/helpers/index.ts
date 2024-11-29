import { MediaTags } from 'src/lib/types/audio.js';
import { Opt } from 'src/lib/option';
import AstalMpris from 'gi://AstalMpris?version=0.1';
import { Variable } from 'astal';

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
    activePlayer: Variable<AstalMpris.Player>,
): string => {
    if (activePlayer.get() && show_label.value) {
        const { title, identity, artist, album, busName } = activePlayer.get();
        songIcon.set(getIconForPlayer(identity));

        const mediaTags: MediaTags = {
            title: title,
            artists: artist,
            artist: artist,
            album: album,
            name: busName,
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

        const maxLabelSize = truncation_size.value;

        let mediaLabel = truncatedLabel;

        if (maxLabelSize > 0 && truncatedLabel.length > maxLabelSize) {
            mediaLabel = `${truncatedLabel.substring(0, maxLabelSize)}...`;
        }

        return mediaLabel.length ? mediaLabel : 'Media';
    } else {
        songIcon.set(getIconForPlayer(activePlayer.get()?.identity || ''));
        return `Media`;
    }
};
