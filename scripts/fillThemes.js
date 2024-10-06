#!/usr/bin/env node

/**
 * compare_themes.js
 *
 * A Node.js script to compare theme JSON files against base themes and add missing keys,
 * as well as remove any properties that don't exist in the corresponding base theme.
 * It assigns values based on matching colors or randomly selects from border colors.
 *
 * Usage:
 *   node compare_themes.js [--dry-run] [themes_directory]
 *
 * If no themes_directory is provided, it defaults to '~/.config/ags/themes'.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * ANSI color codes for formatting console output.
 */
const COLORS = {
    RESET: '\x1b[0m',
    FG_RED: '\x1b[31m',
    FG_GREEN: '\x1b[32m',
    FG_YELLOW: '\x1b[33m',
    FG_BLUE: '\x1b[34m',
    FG_MAGENTA: '\x1b[35m',
    FG_CYAN: '\x1b[36m',
    FG_WHITE: '\x1b[37m',
    BG_RED: '\x1b[41m',
    BG_GREEN: '\x1b[42m',
    BG_YELLOW: '\x1b[43m',
    BG_BLUE: '\x1b[44m',
    BG_MAGENTA: '\x1b[45m',
    BG_CYAN: '\x1b[46m',
    BG_WHITE: '\x1b[47m',
};

/**
 * Formats a message with the given color.
 *
 * @param {string} color - The ANSI color code.
 * @param {string} message - The message to format.
 * @returns {string} The formatted message.
 */
const formatMessage = (color, message) => `${color}${message}${COLORS.RESET}`;

/**
 * Loads and parses a JSON file.
 *
 * @param {string} filePath - The path to the JSON file.
 * @returns {Object} The parsed JSON object.
 */
const loadJSON = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(formatMessage(COLORS.FG_RED, `Error reading or parsing '${filePath}': ${error.message}`));
        process.exit(1);
    }
};

/**
 * Saves a JSON object to a file with indentation.
 *
 * @param {string} filePath - The path to the JSON file.
 * @param {Object} data - The JSON data to save.
 */
const saveJSON = (filePath, data) => {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, jsonString, 'utf8');
    } catch (error) {
        console.error(formatMessage(COLORS.FG_RED, `Error writing to '${filePath}': ${error.message}`));
        process.exit(1);
    }
};

/**
 * Finds the most common value in an array.
 *
 * @param {Array} arr - The array to analyze.
 * @returns {*} The most common value in the array.
 */
const getMostCommonValue = (arr) => {
    const frequency = {};
    let maxFreq = 0;
    let mostCommon = arr[0] || null;

    arr.forEach((value) => {
        frequency[value] = (frequency[value] || 0) + 1;
        if (frequency[value] > maxFreq) {
            maxFreq = frequency[value];
            mostCommon = value;
        }
    });

    return mostCommon;
};

/**
 * Compares two JSON objects and finds missing keys in the target.
 *
 * @param {Object} baseJSON - The base JSON object.
 * @param {Object} targetJSON - The target JSON object to compare.
 * @returns {Array<string>} An array of missing keys.
 */
const findMissingKeys = (baseJSON, targetJSON) => {
    const baseKeys = new Set(Object.keys(baseJSON));
    const targetKeys = new Set(Object.keys(targetJSON));

    const missingKeys = [...baseKeys].filter((key) => !targetKeys.has(key));
    return missingKeys;
};

/**
 * Determines if a key should be excluded based on predefined patterns.
 *
 * @param {string} key - The key to check.
 * @returns {boolean} True if the key is excluded, otherwise false.
 */
const isExcludedKey = (key) => {
    const excludedPatterns = [];

    return excludedPatterns.some((pattern) => pattern.test(key));
};

/**
 * Builds a mapping from values to their corresponding keys in the base theme.
 *
 * @param {Object} baseJSON - The base JSON object.
 * @returns {Object} A map where keys are values and values are arrays of keys.
 */
const buildValueToKeysMap = (baseJSON) => {
    const valueToKeysMap = {};

    Object.entries(baseJSON).forEach(([key, value]) => {
        if (!valueToKeysMap[value]) {
            valueToKeysMap[value] = [];
        }
        valueToKeysMap[value].push(key);
    });

    return valueToKeysMap;
};

/**
 * Collects all border colors from the base theme.
 *
 * @param {Object} baseJSON - The base JSON object.
 * @returns {Array<string>} An array of border color values.
 */
const collectBorderColors = (baseJSON) => {
    const borderColors = new Set();

    Object.entries(baseJSON).forEach(([key, value]) => {
        if (/^theme\.bar\.buttons\..*\.border$/.test(key)) {
            borderColors.add(value);
        }
    });

    return Array.from(borderColors);
};

/**
 * Determines the best match value for a missing key based on related keys.
 *
 * @param {string} baseValue - The value of the missing key in the base theme.
 * @param {Object} valueToKeysMap - A map from values to keys in the base theme.
 * @param {Object} targetJSON - The target JSON object.
 * @returns {*} The best matching value or null if a random selection is needed.
 */
const determineBestMatchValue = (baseValue, valueToKeysMap, targetJSON) => {
    const relatedBaseKeys = valueToKeysMap[baseValue] || [];

    const correspondingTargetValues = relatedBaseKeys
        .map((baseKey) => targetJSON[baseKey])
        .filter((value) => value !== undefined);

    if (correspondingTargetValues.length > 0) {
        return getMostCommonValue(correspondingTargetValues);
    }

    return null;
};

/**
 * Finds extra keys in the target JSON that are not present in the base theme.
 *
 * @param {Object} baseTheme - The base JSON object.
 * @param {Object} targetJSON - The target JSON object.
 * @returns {Array<string>} An array of extra keys.
 */
const findExtraKeys = (baseTheme, targetJSON) => {
    const validKeys = new Set(Object.keys(baseTheme));

    const targetKeys = Object.keys(targetJSON);

    const extraKeys = targetKeys.filter((key) => !validKeys.has(key) && !isExcludedKey(key));

    return extraKeys;
};

/**
 * Creates a backup of a theme file.
 *
 * @param {string} themePath - The path to the theme file.
 */
const backupTheme = (themePath) => {
    const backupDir = path.join(path.dirname(themePath), 'backup');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }
    const backupPath = path.join(backupDir, path.basename(themePath));
    fs.copyFileSync(themePath, backupPath);
    console.log(formatMessage(COLORS.FG_CYAN, `Backup created at '${backupPath}'.`));
};

/**
 * Processes a single theme by adding missing keys and removing extra keys.
 *
 * @param {string} themePath - The path to the theme file.
 * @param {Object} baseTheme - The base JSON object.
 * @param {boolean} dryRun - If true, no changes will be written to files.
 */
const processTheme = (themePath, baseTheme, dryRun) => {
    const themeJSON = loadJSON(themePath);
    const missingKeys = findMissingKeys(baseTheme, themeJSON);

    let hasChanges = false;

    if (missingKeys.length === 0) {
        console.log(formatMessage(COLORS.FG_GREEN, `✅ No missing keys in '${path.basename(themePath)}'.`));
    } else {
        console.log(
            formatMessage(
                COLORS.FG_YELLOW,
                `\n🔍 Processing '${path.basename(themePath)}': Found ${missingKeys.length} missing key(s).`,
            ),
        );

        const valueToKeysMap = buildValueToKeysMap(baseTheme);
        const borderColors = collectBorderColors(baseTheme);

        missingKeys.forEach((key) => {
            if (isExcludedKey(key)) {
                console.log(formatMessage(COLORS.FG_MAGENTA, `❗ Excluded key from addition: "${key}"`));
                return;
            }

            const baseValue = baseTheme[key];
            const bestValue = determineBestMatchValue(baseValue, valueToKeysMap, themeJSON);

            if (bestValue !== null) {
                themeJSON[key] = bestValue;
                console.log(formatMessage(COLORS.FG_GREEN, `➕ Added key: "${key}": "${bestValue}"`));
            } else {
                if (borderColors.length === 0) {
                    console.error(formatMessage(COLORS.FG_RED, '❌ Error: No border colors available to assign.'));
                    return;
                }
                const randomColor = borderColors[Math.floor(Math.random() * borderColors.length)];
                themeJSON[key] = randomColor;
                console.log(
                    formatMessage(
                        COLORS.FG_YELLOW,
                        `➕ Added key with random border color: "${key}": "${randomColor}"`,
                    ),
                );
            }

            hasChanges = true;
        });
    }

    const extraKeys = findExtraKeys(baseTheme, themeJSON);

    if (extraKeys.length === 0) {
        console.log(formatMessage(COLORS.FG_GREEN, `✅ No extra keys to remove in '${path.basename(themePath)}'.`));
    } else {
        console.log(
            formatMessage(
                COLORS.FG_YELLOW,
                `\n🗑️ Processing '${path.basename(themePath)}': Found ${extraKeys.length} extra key(s) to remove.`,
            ),
        );

        extraKeys.forEach((key) => {
            delete themeJSON[key];
            console.log(formatMessage(COLORS.FG_RED, `➖ Removed key: "${key}"`));
            hasChanges = true;
        });
    }

    if (hasChanges) {
        if (dryRun) {
            console.log(
                formatMessage(
                    COLORS.FG_CYAN,
                    `(Dry-Run) 📝 Would update '${path.basename(themePath)}' with missing and extra keys.`,
                ),
            );
        } else {
            backupTheme(themePath);
            saveJSON(themePath, themeJSON);
            console.log(
                formatMessage(COLORS.FG_GREEN, `✅ Updated '${path.basename(themePath)}' with missing and extra keys.`),
            );
        }
    } else {
        console.log(formatMessage(COLORS.FG_BLUE, `ℹ️ No changes made to '${path.basename(themePath)}'.`));
    }
};

/**
 * The main function that orchestrates the theme comparison and updating.
 */
const main = () => {
    const args = process.argv.slice(2);
    const dryRunIndex = args.indexOf('--dry-run');
    const dryRun = dryRunIndex !== -1;
    if (dryRun) {
        args.splice(dryRunIndex, 1);
        console.log(formatMessage(COLORS.FG_CYAN, '🔍 Running in Dry-Run mode. No files will be modified.'));
    }

    const themesDir = args[0] || path.join(os.homedir(), '.config', 'ags', 'themes');

    if (!fs.existsSync(themesDir)) {
        console.error(formatMessage(COLORS.FG_RED, `❌ Error: Themes directory '${themesDir}' does not exist.`));
        process.exit(1);
    }

    const baseThemeFile = 'catppuccin_mocha.json';
    const baseThemeSplitFile = 'catppuccin_mocha_split.json';
    const baseThemePath = path.join(themesDir, baseThemeFile);
    const baseThemeSplitPath = path.join(themesDir, baseThemeSplitFile);

    if (!fs.existsSync(baseThemePath)) {
        console.error(
            formatMessage(COLORS.FG_RED, `❌ Error: Base theme '${baseThemeFile}' does not exist in '${themesDir}'.`),
        );
        process.exit(1);
    }

    if (!fs.existsSync(baseThemeSplitPath)) {
        console.error(
            formatMessage(
                COLORS.FG_RED,
                `❌ Error: Base split theme '${baseThemeSplitFile}' does not exist in '${themesDir}'.`,
            ),
        );
        process.exit(1);
    }

    const baseTheme = loadJSON(baseThemePath);
    const baseThemeSplit = loadJSON(baseThemeSplitPath);

    const themeFiles = fs.readdirSync(themesDir).filter((file) => file.endsWith('.json'));

    themeFiles.forEach((file) => {
        if (file === baseThemeFile || file === baseThemeSplitFile) {
            return;
        }

        const themePath = path.join(themesDir, file);
        let correspondingBaseTheme;

        if (file.endsWith('_split.json')) {
            correspondingBaseTheme = baseThemeSplit;
        } else {
            correspondingBaseTheme = baseTheme;
        }

        try {
            processTheme(themePath, correspondingBaseTheme, dryRun);
        } catch (error) {
            console.error(formatMessage(COLORS.FG_RED, `❌ Error processing '${file}': ${error.message}`));
        }
    });

    console.log(formatMessage(COLORS.FG_GREEN, '\n🎉 All themes have been processed.'));
};

main();
