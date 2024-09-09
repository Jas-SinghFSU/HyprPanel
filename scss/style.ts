import options from "options";
import { bash, dependencies } from "lib/utils";
import { MatugenColors, RecursiveOptionsObject } from "lib/types/options";
import { initializeTrackers } from "./options_trackers";
import { generateMatugenColors, replaceHexValues } from "../services/matugen/index";
import { isHexColor, isOpt, isRecursiveOptionsObject } from "globals/variables";
import { Opt } from "lib/option";

const deps = [
    "font",
    "theme",
    "bar.flatButtons",
    "bar.position",
    "bar.battery.charging",
    "bar.battery.blocks",
];

function extractVariables(
    theme: RecursiveOptionsObject,
    prefix = "",
    matugenColors?: MatugenColors
): string[] {
    const result: string[] = [];

    for (const key in theme) {
        const newPrefix = prefix ? `${prefix}-${key}` : key;
        const value = theme[key];

        if (isOpt<boolean>(value)) {
            const { value: val } = value;
            result.push(`$${newPrefix}: ${val};`);
            continue;
        }

        if (isOpt<string | number>(value)) {
            const { value: val } = value as Opt<string | number | boolean>;

            if (typeof val === 'string' && isHexColor(val)) {
                result.push(`$${newPrefix}: ${matugenColors ? replaceHexValues(val, matugenColors) : val};`);
                continue;
            }

            result.push(`$${newPrefix}: ${val};`);
            continue;
        }

        // Handle recursive options objects
        if (isRecursiveOptionsObject(value)) {
            result.push(...extractVariables(value as RecursiveOptionsObject, newPrefix, matugenColors));
        }
    }

    return result;
}

async function resetCss() {
    if (!dependencies("sass")) return;

    try {
        const matugenColors = await generateMatugenColors();

        const variables = [
            ...extractVariables(options.theme, '', matugenColors),
        ];

        const vars = `${TMP}/variables.scss`
        const css = `${TMP}/main.css`
        const scss = `${TMP}/entry.scss`
        const localScss = `${App.configDir}/scss/main.scss`;

        const themeVariables = variables;
        const integratedVariables = themeVariables;

        const imports = [vars].map(f => `@import '${f}';`);

        await Utils.writeFile(integratedVariables.join("\n"), vars);

        let mainScss = Utils.readFile(localScss);
        mainScss = `${imports}\n${mainScss}`;

        await Utils.writeFile(mainScss, scss);

        await bash(`sass --load-path=${App.configDir}/scss/ ${scss} ${css}`);

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
