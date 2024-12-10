import { Binding } from 'astal';
import { bind, Variable } from 'astal';
import AstalMpris from 'gi://AstalMpris?version=0.1';
import { mediaArtUrl } from 'src/globals/media';
import { mprisService } from 'src/lib/constants/services';
import options from 'src/options';

const { tint, color } = options.theme.bar.menus.menu.media.card;

const curPlayer = Variable('');

export const generateAlbumArt = (imageUrl: string): string => {
    const userTint = tint.value;
    const userHexColor = color.value;

    const r = parseInt(userHexColor.slice(1, 3), 16);
    const g = parseInt(userHexColor.slice(3, 5), 16);
    const b = parseInt(userHexColor.slice(5, 7), 16);

    const alpha = userTint / 100;

    const css = `background-image: linear-gradient(
                rgba(${r}, ${g}, ${b}, ${alpha}),
                rgba(${r}, ${g}, ${b}, ${alpha}),
                ${userHexColor} 65em
            ), url("${imageUrl}");`;

    return css;
};

export const initializeActivePlayerHook = (): void => {
    mprisService.connect('changed', () => {
        const statusOrder = {
            [AstalMpris.PlaybackStatus.PLAYING]: 1,
            [AstalMpris.PlaybackStatus.PAUSED]: 2,
            [AstalMpris.PlaybackStatus.STOPPED]: 3,
        };

        const isPlaying = mprisService.players.find((p) => p['playbackStatus'] === AstalMpris.PlaybackStatus.PLAYING);

        const playerStillExists = mprisService.players.some((player) => curPlayer.set(player.busName));

        const nextPlayerUp = mprisService.players.sort(
            (a, b) => statusOrder[a.playbackStatus] - statusOrder[b.playbackStatus],
        )[0].bus_name;

        if (isPlaying || !playerStillExists) {
            curPlayer.set(nextPlayerUp);
        }
    });
};

export const getBackground = (): Binding<string> => {
    return Variable.derive([bind(color), bind(tint), bind(mediaArtUrl)], (_, __, artUrl) => {
        return generateAlbumArt(artUrl);
    })();
};
