import options from '../options';
import { bash, dependencies } from '../lib/utils';
import { HexColor, MatugenColors, RecursiveOptionsObject } from '../lib/types/options.types';
import { initializeTrackers } from './optionsTrackers';
import { generateMatugenColors, getMatugenHex, replaceHexValues } from '../services/matugen/index';
import { isHexColor } from '../shared/variables';
import { readFile, writeFile } from 'astal/file';
import { App } from 'astal/gtk3';
import { initializeHotReload } from './utils/hotReload';

const deps = [
    'font',
    'theme',
    'bar.flatButtons',
    'bar.position',
    'bar.battery.charging',
    'bar.battery.blocks',
];

function extractVariables(
    theme: RecursiveOptionsObject,
    prefix = '',
    matugenColors?: MatugenColors,
): string[] {
    let result = [] as string[];
    for (const key in theme) {
        if (!theme.hasOwnProperty(key)) {
            continue;
        }

        const themeValue = theme[key];

        const newPrefix = prefix ? `${prefix}-${key}` : key;

        const replacedValue =
            isHexColor(themeValue.value) && matugenColors !== undefined
                ? replaceHexValues(themeValue.value, matugenColors)
                : themeValue.value;

        if (typeof themeValue === 'function') {
            result.push(`$${newPrefix}: ${replacedValue};`);
            continue;
        }
        if (typeof themeValue !== 'object' || themeValue === null || Array.isArray(themeValue)) continue;

        if (typeof themeValue.value !== 'undefined') {
            result.push(`$${newPrefix}: ${replacedValue};`);
        } else {
            result = result.concat(extractVariables(themeValue, newPrefix, matugenColors));
        }
    }

    return result;
}

async function extractMatugenizedVariables(matugenColors: MatugenColors): Promise<string[]> {
    try {
        const result = [] as string[];
        const optArray = options.array();

        for (let i = 0; i < optArray.length; i++) {
            const opt = optArray[i];
            const name = opt.id;

            if (name.startsWith('theme.') === false) {
                continue;
            }

            const value = opt.value;

            if (!isHexColor(value) && matugenColors !== undefined) {
                result.push(`$${name.replace('theme.', '').split('.').join('-')}: ${value};`);
                continue;
            }

            const matugenColor = getMatugenHex(value as HexColor, matugenColors);

            result.push(`$${name.replace('theme.', '').split('.').join('-')}: ${matugenColor};`);
        }

        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const resetCss = async (): Promise<void> => {
    if (!dependencies('sass')) return;

    let variables: string[] = [];
    try {
        const matugenColors = await generateMatugenColors();

        if (options.theme.matugen.get() && matugenColors) {
            variables = await extractMatugenizedVariables(matugenColors);
        } else {
            variables = extractVariables(options.theme as RecursiveOptionsObject, '', undefined);
        }

        const vars = `${TMP}/variables.scss`;
        const css = `${TMP}/main.css`;
        const scss = `${TMP}/entry.scss`;
        const localScss = `${SRC_DIR}/src/scss/main.scss`;
        const moduleScss = `${CONFIG_DIR}/modules.scss`;

        const themeVariables = variables;
        const integratedVariables = themeVariables;

        const imports = [vars].map((f) => `@import '${f}';`);

        writeFile(vars, integratedVariables.join('\n'));

        let mainScss = readFile(localScss);
        mainScss = `${imports}\n${mainScss}`;

        const moduleScssFile = readFile(moduleScss);
        mainScss = `${mainScss}\n${moduleScssFile}`;

        writeFile(scss, mainScss);

        await bash(`sass --load-path=${SRC_DIR}/src/scss ${scss} ${css}`);

        App.apply_css(css, true);
    } catch (error) {
        console.error(error);
    }
};

initializeTrackers(resetCss);
initializeHotReload();

options.handler(deps, resetCss);

await resetCss();
