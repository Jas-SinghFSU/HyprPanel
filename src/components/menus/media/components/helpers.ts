const media = await Service.import('mpris');
import options from 'options.js';
import { MprisPlayer } from 'types/service/mpris';
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
    media.connect('changed', () => {
        const statusOrder = {
            Playing: 1,
            Paused: 2,
            Stopped: 3,
        };

        const isPlaying = media.players.find((p) => p['play_back_status'] === 'Playing');

        const playerStillExists = media.players.some((p) => curPlayer.value === p['bus_name']);

        const nextPlayerUp = media.players.sort(
            (a, b) => statusOrder[a['play_back_status']] - statusOrder[b['play_back_status']],
        )[0].bus_name;

        if (isPlaying || !playerStillExists) {
            curPlayer.value = nextPlayerUp;
        }
    });
};

export const getPlayerInfo = (): MprisPlayer | undefined => {
    if (media.players.length === 0) {
        return;
    }
    return media.players.find((p) => p.bus_name === curPlayer.value) || media.players[0];
};
