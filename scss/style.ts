/* eslint-disable max-len */
import { type Opt } from "lib/option"
import options from "options"
import { bash, dependencies } from "lib/utils"

const deps = [
    "font",
    "theme",
    "bar.flatButtons",
    "bar.position",
    "bar.battery.charging",
    "bar.battery.blocks",
]

const $ = (name: string, value: string | Opt<any>) => `$${name}: ${value};`

function extractVariables(theme: any, prefix: string = ""): string[] {
    let result: string[] = [];
    for (let key in theme) {
        if (theme.hasOwnProperty(key)) {
            const value = theme[key];
            const newPrefix = prefix ? `${prefix}-${key}` : key;

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Check if the object contains an Opt value or is a nested object
                if (typeof value.value !== 'undefined') {
                    result.push($(`${newPrefix}`, `${value.value}`));
                } else {
                    result = result.concat(extractVariables(value, newPrefix));
                }
            } else if (typeof value === 'function' && value.name === 'opt') {
                result.push($(`${newPrefix}`, value));
            }
        }
    }
    return result;
}

const variables = () => [
    ...extractVariables(options.theme),
];

async function resetCss() {
    if (!dependencies("sass"))
        return

    try {
        const vars = `${App.configDir}/scss/variables.scss`
        const css = `${TMP}/main.css`
        const scss = `${App.configDir}/scss/entry.scss`
        const localScss = `${App.configDir}/scss/main.scss`;

        const imports = [vars].map(f => `@import '${f}';`)

        await Utils.writeFile(variables().join("\n"), vars)

        let mainScss = Utils.readFile(localScss);
        mainScss = `${imports}\n${mainScss}`;

        await Utils.writeFile(mainScss, scss)

        await bash(`sass ${scss} ${css}`);

        App.applyCss(css, true);
    } catch (error) {
        error instanceof Error
            ? logError(error)
            : console.error(error)
    }
}

Utils.monitorFile(`${App.configDir}/scss/style`, resetCss)
options.handler(deps, resetCss)
await resetCss()
