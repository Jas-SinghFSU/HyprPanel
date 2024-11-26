import options from '../options';
import { bash, dependencies } from '../lib/utils';
import { MatugenColors, RecursiveOptionsObject } from '../lib/types/options';
import { initializeTrackers } from './optionsTrackers';
import { generateMatugenColors, replaceHexValues } from '../services/matugen/index';
import { isHexColor } from '../globals/variables';
import { monitorFile, readFile, writeFile } from 'astal/file';
import { App } from 'astal/gtk3';

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

const resetCss = async (): Promise<void> => {
    if (!dependencies('sass')) return;

    try {
        const matugenColors = await generateMatugenColors();

        const variables = extractVariables(options.theme as RecursiveOptionsObject, '', matugenColors);

        const vars = `${TMP}/variables.scss`;
        const css = `${TMP}/main.css`;
        const scss = `${TMP}/entry.scss`;
        const localScss = `${SRC}/scss/main.scss`;

        const themeVariables = variables;
        const integratedVariables = themeVariables;

        const imports = [vars].map((f) => `@import '${f}';`);

        writeFile(vars, integratedVariables.join('\n'));

        let mainScss = readFile(localScss);
        mainScss = `${imports}\n${mainScss}`;

        writeFile(scss, mainScss);

        await bash(`sass --load-path=${SRC}/scss/ ${scss} ${css}`);

        App.apply_css(css, true);
    } catch (error) {
        console.error(error);
    }
};

initializeTrackers(resetCss);

monitorFile(`${SRC}/scss/style`, resetCss);
options.handler(deps, resetCss);
await resetCss();
