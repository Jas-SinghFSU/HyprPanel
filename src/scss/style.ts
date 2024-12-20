import options from '../options';
import { bash, dependencies } from '../lib/utils';
import { MatugenColors, RecursiveOptionsObject } from '../lib/types/options';
import { initializeTrackers } from './optionsTrackers';
import { generateMatugenColors, getMatugenHex, replaceHexValues } from '../services/matugen/index';
import { isHexColor } from '../globals/variables';
import { readFile, writeFile } from 'astal/file';
import { App } from 'astal/gtk3';
import { initializeHotReload } from './utils/hotReload';
import { defaultFile } from 'src/lib/option';

const deps = ['font', 'theme', 'bar.flatButtons', 'bar.position', 'bar.battery.charging', 'bar.battery.blocks'];

function extractVariables(theme: RecursiveOptionsObject, prefix = '', matugenColors?: MatugenColors): string[] {
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

        const defaultFileContent = JSON.parse(readFile(defaultFile) || '{}');

        for (const key in defaultFileContent) {
            if (key.startsWith('theme.') === false) {
                continue;
            }
            const configValue = defaultFileContent[key];

            if (!isHexColor(configValue) && matugenColors !== undefined) {
                result.push(`$${key.replace('theme.', '').split('.').join('-')}: ${configValue};`);
                continue;
            }

            const matugenColor = getMatugenHex(configValue, matugenColors);

            result.push(`$${key.replace('theme.', '').split('.').join('-')}: ${matugenColor};`);
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

        const themeVariables = variables;
        const integratedVariables = themeVariables;

        const imports = [vars].map((f) => `@import '${f}';`);

        writeFile(vars, integratedVariables.join('\n'));

        let mainScss = readFile(localScss);
        mainScss = `${imports}\n${mainScss}`;

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
