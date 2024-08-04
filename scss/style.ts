import options from "options";
import { bash, dependencies } from "lib/utils";
import { MatugenColors } from "lib/types/options";
import { initializeTrackers } from "./options_trackers";

const { scheme_type, contrast } = options.theme.matugen_settings;

const deps = [
    "font",
    "theme",
    "bar.flatButtons",
    "bar.position",
    "bar.battery.charging",
    "bar.battery.blocks",
];

async function generateMatugenColors() {
    try {
        const normalizedContrast = contrast.value > 1 ? 1
            : contrast.value < -1 ? -1
                : contrast.value
        const wallpaperPath = options.wallpaper.image.value;
        const contents = await bash(`matugen image ${wallpaperPath} -t scheme-${scheme_type.value} --contrast ${normalizedContrast} --json hex`);

        return JSON.parse(contents).colors[options.theme.matugen_settings.mode.value];
    } catch (error) {
        const errMsg = `An error occurred while generating matugen colors: ${error}`;
        console.error(errMsg);
    }
}

const replaceHexValues = (incomingHex: string, matugenColors: MatugenColors) => {
    if (!options.theme.matugen.value) {
        return incomingHex;
    }

    const matugenColorMap = {
        "rosewater": matugenColors.secondary,
        "flamingo": matugenColors.secondary,
        "pink": matugenColors.tertiary,
        "mauve": matugenColors.primary,
        "red": matugenColors.tertiary,
        "maroon": matugenColors.primary,
        "peach": matugenColors.tertiary,
        "yellow": matugenColors.secondary,
        "green": matugenColors.primary,
        "teal": matugenColors.secondary,
        "sky": matugenColors.secondary,
        "sapphire": matugenColors.primary,
        "blue": matugenColors.primary,
        "lavender": matugenColors.primary,
        "text": matugenColors.on_background,
        "subtext1": matugenColors.outline,
        "subtext2": matugenColors.outline,
        "overlay2": matugenColors.outline,
        "overlay1": matugenColors.outline,
        "overlay0": matugenColors.outline,
        "surface2": matugenColors.outline,
        "surface1": matugenColors.surface_bright,
        "surface0": matugenColors.surface_bright,
        "base2": matugenColors.inverse_on_surface,
        "base": matugenColors.inverse_on_surface,
        "mantle": matugenColors.surface_dim,
        "crust": matugenColors.surface_dim
    };

    const defaultColorMap = {
        "rosewater": "#f5e0dc",
        "flamingo": "#f2cdcd",
        "pink": "#f5c2e7",
        "mauve": "#cba6f7",
        "red": "#f38ba8",
        "maroon": "#eba0ac",
        "peach": "#fab387",
        "yellow": "#f9e2af",
        "green": "#a6e3a1",
        "teal": "#94e2d5",
        "sky": "#89dceb",
        "sapphire": "#74c7ec",
        "blue": "#89b4fa",
        "lavender": "#b4befe",
        "text": "#cdd6f4",
        "subtext1": "#bac2de",
        "subtext2": "#a6adc8",
        "overlay2": "#9399b2",
        "overlay1": "#7f849c",
        "overlay0": "#6c7086",
        "surface2": "#585b70",
        "surface1": "#45475a",
        "surface0": "#313244",
        "base2": "#242438",
        "base": "#1e1e2e",
        "mantle": "#181825",
        "crust": "#11111b"
    };
    for (let curColor of Object.keys(defaultColorMap)) {
        if (defaultColorMap[curColor] === incomingHex) {
            return matugenColorMap[curColor];
        }
    }

    return incomingHex;
}

function extractVariables(theme: typeof options.theme, prefix = "", matugenColors: MatugenColors) {
    let result = [] as string[];
    for (let key in theme) {
        if (theme.hasOwnProperty(key)) {
            const value = theme[key];

            const newPrefix = prefix ? `${prefix}-${key}` : key;

            const isColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value.value);
            const replacedValue = isColor && matugenColors !== undefined ? replaceHexValues(value.value, matugenColors) : value.value;
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                if (typeof value.value !== 'undefined') {
                    result.push(`$${newPrefix}: ${replacedValue};`);
                } else {
                    result = result.concat(extractVariables(value, newPrefix, matugenColors));
                }
            } else if (typeof value === 'function' && value.name === 'opt') {
                replaceHexValues(value.value, matugenColors);
                result.push(`$${newPrefix}: ${replacedValue};`);
            }
        }
    }
    return result;
}

async function resetCss() {
    if (!dependencies("sass")) return;

    try {
        const matugenColors = await generateMatugenColors();
        console.log(JSON.stringify(matugenColors, null, 2));

        const variables = [
            ...extractVariables(options.theme, '', matugenColors),
        ];

        const vars = `${App.configDir}/scss/variables.scss`;
        const css = `${TMP}/main.css`;
        const scss = `${App.configDir}/scss/entry.scss`;
        const localScss = `${App.configDir}/scss/main.scss`;

        const themeVariables = variables;
        const integratedVariables = themeVariables;

        const imports = [vars].map(f => `@import '${f}';`);

        await Utils.writeFile(integratedVariables.join("\n"), vars);

        let mainScss = Utils.readFile(localScss);
        mainScss = `${imports}\n${mainScss}`;

        await Utils.writeFile(mainScss, scss);

        await bash(`sass ${scss} ${css}`);

        App.applyCss(css, true);
    } catch (error) {
        error instanceof Error
            ? logError(error)
            : console.error(error);
    }
}

initializeTrackers(resetCss);

Utils.monitorFile(`${App.configDir}/scss/style`, resetCss);
options.handler(deps, resetCss);
await resetCss();

