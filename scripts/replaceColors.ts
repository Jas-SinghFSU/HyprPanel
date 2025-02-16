#!/usr/bin/env ts-node
/// <reference types="node" />

/**
 * Prints usage/help information to the console.
 * Called whenever the user passes `--help` or when arguments are missing/invalid.
 */
function printUsage(): void {
    console.log(`
Usage:
  ts-node updateColors.ts <theme.json> <original_palette.json> <new_palette.json> <output.json>

Options:
  --help   Show this help message

Description:
  This script reads a theme JSON file containing old color codes, an "original" palette JSON
  (which maps color name → old hex code), and a "new" palette JSON (mapping the same color name
  → new hex code). It then replaces all old hex codes in the theme with the corresponding new hex codes,
  and saves the result to the specified output JSON file.

Examples:
  ts-node updateColors.ts theme.json original_palette.json new_palette.json updated_theme.json

  node updateColors.js theme.json original_palette.json new_palette.json updated_theme.json
`);
}

/**
 * Recursively walks a palette to build a map from old hex → new hex,
 * keyed by the same property name in the new palette if it exists.
 *
 * Example:
 *    originalPalette = { bg: "#24283b", git: { add: "#449dab" } }
 *    newPalette      = { bg: "#222436", git: { add: "#b8db87" } }
 *
 * => colorMap = {
 *      "#24283b": "#222436",
 *      "#449dab": "#b8db87"
 *    }
 *
 * @param original - The "old" palette.
 * @param updated - The "new" palette containing updated hex codes.
 * @returns A map of { oldHex.toLowerCase(): newHex }.
 */
function buildColorMap(original: Palette, updated: Palette): ColorMap {
    const map: ColorMap = {};

    for (const [key, oldVal] of Object.entries(original)) {
        const newVal = updated[key];

        if (typeof oldVal === 'string' && typeof newVal === 'string') {
            map[oldVal.toLowerCase()] = newVal;
        } else if (oldVal && typeof oldVal === 'object') {
            const oldNested = oldVal as Record<string, string>;
            const newNested = newVal && typeof newVal === 'object' ? (newVal as Record<string, string>) : {};

            for (const [nestedKey, nestedOldHex] of Object.entries(oldNested)) {
                const nestedNewHex = newNested[nestedKey];

                if (typeof nestedOldHex === 'string' && typeof nestedNewHex === 'string') {
                    map[nestedOldHex.toLowerCase()] = nestedNewHex;
                }
            }
        }
    }

    return map;
}

/**
 * Recursively replace all string values in a data structure (object, array, etc.)
 * if they appear in colorMap.
 *
 * @param node - The current portion of JSON to transform (can be object, array, string, etc.).
 * @param colorMap - An object with oldHex.toLowerCase() → newHex mappings.
 * @returns The transformed data with replaced colors.
 */
function replaceColorsInTheme(node: unknown, colorMap: ColorMap): unknown {
    if (Array.isArray(node)) {
        return node.map((item) => replaceColorsInTheme(item, colorMap));
    } else if (node && typeof node === 'object') {
        const result: Record<string, unknown> = {};

        for (const [key, val] of Object.entries(node)) {
            result[key] = replaceColorsInTheme(val, colorMap);
        }
        return result;
    } else if (typeof node === 'string') {
        const lower = node.toLowerCase();
        return colorMap[lower] ? colorMap[lower] : node;
    } else {
        return node;
    }
}

/**
 * A minimal utility wrapper to read a file asynchronously.
 *
 * @param filePath - The file path to read from.
 * @param encoding - The file encoding (default 'utf8').
 * @returns A Promise resolving to the file contents as a string.
 */
async function readFile(filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string> {
    return new Promise((resolve, reject) => {
        const fs = require('fs');
        fs.readFile(filePath, encoding, (err: Error, data: string) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

/**
 * Main function that:
 *   1. Checks for --help or missing arguments.
 *   2. Reads and parses the theme, original palette, and new palette.
 *   3. Builds the color map and applies color replacements.
 *   4. Writes the result as JSON to a new file.
 *
 *   @example
 *   ```bash
 *   ts-node updateColors.ts theme.json original_palette.json new_palette.json output.json
 *   ```
 */
async function main(): Promise<void> {
    const [, , ...args] = process.argv;

    if (args.length === 0) {
        printUsage();
        process.exit(0);
    }

    if (args.length < 4) {
        console.error('Error: Not enough arguments provided.\n');
        printUsage();
        process.exit(1);
    } else if (args.length > 4) {
        console.error('Error: Too many arguments provided.\n');
        printUsage();
        process.exit(1);
    }

    const [themePath, originalPath, newPath, outputPath] = args;

    try {
        const themeData = JSON.parse(await readFile(themePath, 'utf8'));
        const originalPalette: Palette = JSON.parse(await readFile(originalPath, 'utf8'));
        const newPalette: Palette = JSON.parse(await readFile(newPath, 'utf8'));
        const fs = require('fs');

        const colorMap = buildColorMap(originalPalette, newPalette);
        const updatedTheme = replaceColorsInTheme(themeData, colorMap);

        fs.writeFileSync(outputPath, JSON.stringify(updatedTheme, null, 2), 'utf8');

        console.log(`Successfully wrote updated theme to: ${outputPath}`);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch((err) => {
        console.error(err);
        process.exit(1);
    });
}

type Palette = Record<string, string | Record<string, string>>;

type ColorMap = Record<string, string>;
