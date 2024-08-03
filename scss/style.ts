/* eslint-disable max-len */
import GLib from "gi://GLib?version=2.0"
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

// Conversion functions
function hexToRgb(hex: string) {
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
    };
}

async function generateMatugenColors(imagePath: string): Promise<Record<string, string>> {
    const contents = await bash(`matugen image ${imagePath} --mode dark --json hex`);
    return JSON.parse(contents).colors.dark;
}

function rgbToXyz({ r, g, b }: { r: number, g: number, b: number }) {
    r /= 255; g /= 255; b /= 255;

    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    return {
        x: (r * 0.4124 + g * 0.3576 + b * 0.1805) * 100,
        y: (r * 0.2126 + g * 0.7152 + b * 0.0722) * 100,
        z: (r * 0.0193 + g * 0.1192 + b * 0.9505) * 100
    };
}

function xyzToLab({ x, y, z }: { x: number, y: number, z: number }) {
    x /= 95.047; y /= 100; z /= 108.883;

    x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

    return {
        l: (116 * y) - 16,
        a: 500 * (x - y),
        b: 200 * (y - z)
    };
}

function hexToLab(hex: string) {
    const rgb = hexToRgb(hex);
    const xyz = rgbToXyz(rgb);
    return xyzToLab(xyz);
}

// CIEDE2000 color difference function
function ciede2000(lab1: { l: number, a: number, b: number }, lab2: { l: number, a: number, b: number }) {
    const { l: L1, a: A1, b: B1 } = lab1;
    const { l: L2, a: A2, b: B2 } = lab2;

    const kL = 1;
    const kC = 1;
    const kH = 1;

    const ΔL = L2 - L1;
    const L_ = (L1 + L2) / 2;

    const C1 = Math.sqrt(A1 * A1 + B1 * B1);
    const C2 = Math.sqrt(A2 * A2 + B2 * B2);
    const C_ = (C1 + C2) / 2;

    const G = 0.5 * (1 - Math.sqrt(Math.pow(C_, 7) / (Math.pow(C_, 7) + Math.pow(25, 7))));
    const a1_ = (1 + G) * A1;
    const a2_ = (1 + G) * A2;

    const C1_ = Math.sqrt(a1_ * a1_ + B1 * B1);
    const C2_ = Math.sqrt(a2_ * a2_ + B2 * B2);
    const C__ = (C1_ + C2_) / 2;

    const h1_ = Math.atan2(B1, a1_);
    const h2_ = Math.atan2(B2, a2_);

    const ΔC = C2_ - C1_;
    const Δh_ = 2 * Math.sqrt(C1_ * C2_) * Math.sin((h2_ - h1_) / 2);
    const H_ = (Math.abs(h1_ - h2_) > Math.PI) ? (h1_ + h2_ + 2 * Math.PI) / 2 : (h1_ + h2_) / 2;

    const T = 1 - 0.17 * Math.cos(H_ - Math.PI / 6) + 0.24 * Math.cos(2 * H_) + 0.32 * Math.cos(3 * H_ + Math.PI / 30) - 0.20 * Math.cos(4 * H_ - 63 * Math.PI / 180);

    const SL = 1 + (0.015 * Math.pow(L_ - 50, 2)) / Math.sqrt(20 + Math.pow(L_ - 50, 2));
    const SC = 1 + 0.045 * C__;
    const SH = 1 + 0.015 * C__ * T;

    const Δθ = 30 * Math.PI / 180 * Math.exp(-Math.pow((H_ - 275) / 25, 2));
    const RC = 2 * Math.sqrt(Math.pow(C__, 7) / (Math.pow(C__, 7) + Math.pow(25, 7)));
    const RT = -Math.sin(2 * Δθ) * RC;

    return Math.sqrt(Math.pow(ΔL / SL, 2) + Math.pow(ΔC / SC, 2) + Math.pow(Δh_ / SH, 2) + RT * (ΔC / SC) * (Δh_ / SH));
}

// Find closest colors using CIEDE2000
function findClosestColors(color: string, palette: Record<string, string>, numClosest = 1): string[] {
    const targetLab = hexToLab(color);
    const colors = Object.values(palette).map(hexColor => ({
        color: hexColor,
        distance: ciede2000(targetLab, hexToLab(hexColor)),
    }));

    colors.sort((a, b) => a.distance - b.distance);

    return colors.slice(0, numClosest).map(c => c.color);
}

function replaceColors(variables: string[], mainColors: string[]): string[] {
    const colorRegex = /#[0-9A-Fa-f]{6}/;

    return variables.map(variable => {
        const match = variable.match(colorRegex);
        if (match) {
            const originalColor = match[0];
            const closestColors = findClosestColors(originalColor, mainColors);
            const randomColor = closestColors[Math.floor(Math.random() * closestColors.length)];
            return variable.replace(originalColor, randomColor);
        }
        return variable;
    });
}

async function resetCss() {
    if (!dependencies("sass"))
        return

    try {
        const wallpaperPath = "/home/jaskir/Pictures/Wallpapers/Mocha_Wolf.png";
        const matugenColors = await generateMatugenColors(wallpaperPath);
        console.log(JSON.stringify(matugenColors, null, 2));


        const vars = `${App.configDir}/scss/variables.scss`
        const css = `${TMP}/main.css`
        const scss = `${App.configDir}/scss/entry.scss`
        const localScss = `${App.configDir}/scss/main.scss`;

        const themeVariables = variables();
        let integratedVariables;

        if (options.theme.matugen.value) {
            integratedVariables = replaceColors(themeVariables, matugenColors);
        } else {
            integratedVariables = themeVariables;
        }


        const imports = [vars].map(f => `@import '${f}';`)

        await Utils.writeFile(integratedVariables.join("\n"), vars)

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
