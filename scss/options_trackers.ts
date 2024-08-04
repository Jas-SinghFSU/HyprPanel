import options from "options";
import Wallpaper from "services/Wallpaper";

const { matugen } = options.theme;
const { mode, scheme_type, contrast } = options.theme.matugen_settings;

export const initializeTrackers = (resetCssFunc: Function) => {
    matugen.connect("changed", () => {
        options.resetTheme();
        resetCssFunc();
    })

    mode.connect("changed", () => {
        options.resetTheme();
        resetCssFunc();
    })
    scheme_type.connect("changed", () => {
        options.resetTheme();
        resetCssFunc();
    })
    contrast.connect("changed", () => {
        options.resetTheme();
        resetCssFunc();
    })

    Wallpaper.connect("changed", () => {
        if (options.theme.matugen.value) {
            options.resetTheme();
            resetCssFunc();
        }
    })

}
