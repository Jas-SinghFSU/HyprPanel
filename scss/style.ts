import options from 'options';
import { bash, dependencies } from 'lib/utils';
import { MatugenColors, RecursiveOptionsObject } from 'lib/types/options';
import { initializeTrackers } from './optionsTrackers';
import { generateMatugenColors, replaceHexValues } from '../services/matugen/index';

const deps = ['font', 'theme', 'bar.flatButtons', 'bar.position', 'bar.battery.charging', 'bar.battery.blocks'];

function extractVariables(theme: RecursiveOptionsObject, prefix = '', matugenColors?: MatugenColors): string[] {
    let result = [] as string[];
    for (const key in theme) {
        if (!theme.hasOwnProperty(key)) {
            continue;
        }

        const value = theme[key];

        const newPrefix = prefix ? `${prefix}-${key}` : key;

        const isColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value.value);
        const replacedValue =
            isColor && matugenColors !== undefined ? replaceHexValues(value.value, matugenColors) : value.value;

        if (typeof value === 'function') {
            result.push(`$${newPrefix}: ${replacedValue};`);
            continue;
        }
        if (typeof value !== 'object' || value === null || Array.isArray(value)) continue;

        if (typeof value.value !== 'undefined') {
            result.push(`$${newPrefix}: ${replacedValue};`);
        } else {
            result = result.concat(extractVariables(value as RecursiveOptionsObject, newPrefix, matugenColors));
        }
    }

    return result;
}

const resetCss = async (): Promise<void> => {
    if (!dependencies('sass')) return;

    try {
        const matugenColors = await generateMatugenColors();

        const variables = [...extractVariables(options.theme, '', matugenColors)];

        const vars = `${TMP}/variables.scss`;
        const css = `${TMP}/main.css`;
        const scss = `${TMP}/entry.scss`;
        const localScss = `${App.configDir}/scss/main.scss`;

        const themeVariables = variables;
        const integratedVariables = themeVariables;

        const imports = [vars].map((f) => `@import '${f}';`);

        await Utils.writeFile(integratedVariables.join('\n'), vars);

        let mainScss = Utils.readFile(localScss);
        mainScss = `${imports}\n${mainScss}`;

        await Utils.writeFile(mainScss, scss);

        await bash(`sass --load-path=${App.configDir}/scss/ ${scss} ${css}`);

        App.applyCss(css, true);
    } catch (error) {
        console.error(error);
    }
};

initializeTrackers(resetCss);

Utils.monitorFile(`${App.configDir}/scss/style`, resetCss);
options.handler(deps, resetCss);
await resetCss();
