import { Binding } from 'astal';
import { bind, Variable } from 'astal';
import AstalMpris from 'gi://AstalMpris?version=0.1';
import { mediaArtUrl } from 'src/globals/media';
import { mprisService } from 'src/lib/constants/services';
import options from 'src/options';

const { tint, color } = options.theme.bar.menus.menu.media.card;

const curPlayer = Variable('');

/**
 * Generates CSS for album art with a tinted background.
 *
 * This function creates a CSS string for the album art background using the provided image URL.
 * It applies a linear gradient tint based on the user's theme settings for tint and color.
 *
 * @param imageUrl The URL of the album art image.
 *
 * @returns A CSS string for the album art background.
 */
export const generateAlbumArt = (imageUrl: string): string => {
    const userTint = tint.get();
    const userHexColor = color.get();

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

/**
 * Initializes the active player hook.
 *
 * This function sets up a listener for changes in the MPRIS service.
 * It updates the current player based on the playback status and the order of players.
 */
export const initializeActivePlayerHook = (): void => {
    mprisService.connect('changed', () => {
        const statusOrder = {
            [AstalMpris.PlaybackStatus.PLAYING]: 1,
            [AstalMpris.PlaybackStatus.PAUSED]: 2,
            [AstalMpris.PlaybackStatus.STOPPED]: 3,
        };

        const isPlaying = mprisService
            .get_players()
            .find((p) => p['playbackStatus'] === AstalMpris.PlaybackStatus.PLAYING);

        const playerStillExists = mprisService.get_players().some((player) => curPlayer.set(player.busName));

        const nextPlayerUp = mprisService
            .get_players()
            .sort((a, b) => statusOrder[a.playbackStatus] - statusOrder[b.playbackStatus])[0].bus_name;

        if (isPlaying || !playerStillExists) {
            curPlayer.set(nextPlayerUp);
        }
    });
};

/**
 * Retrieves the background binding for the media card.
 *
 * This function sets up a derived variable that updates the background CSS for the media card
 * based on the current theme settings for color, tint, and media art URL.
 *
 * @returns A Binding<string> representing the background CSS for the media card.
 */
export const getBackground = (): Binding<string> => {
    return Variable.derive([bind(color), bind(tint), bind(mediaArtUrl)], (_, __, artUrl) => {
        return generateAlbumArt(artUrl);
    })();
};
