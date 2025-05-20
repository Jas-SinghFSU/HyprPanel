import { Binding } from 'astal';
import { bind, Variable } from 'astal';
import options from 'src/configuration';
import { mediaArtUrl } from 'src/services/media';

const { tint, color } = options.theme.bar.menus.menu.media.card;

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
function generateAlbumArt(imageUrl: string): string {
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
}
