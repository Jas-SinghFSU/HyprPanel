#!/usr/bin/env node

/**
 * compare_themes.js
 *
 * A Node.js script to compare theme JSON files against base themes and add missing keys,
 * as well as remove any properties that don't exist in the corresponding base theme.
 * It assigns values based on matching colors, specific property mappings, or randomly selects from border colors.
 *
 * Usage:
 *   node compare_themes.js [--dry-run] [themes_directory]
 *
 * If no themes_directory is provided, it defaults to '~/.config/ags/themes'.
 */

const fs = require('fs').promises;
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
 * Loads and parses a JSON file asynchronously.
 *
 * @param {string} filePath - The path to the JSON file.
 * @returns {Promise<Object>} The parsed JSON object.
 */
const loadJSON = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(formatMessage(COLORS.FG_RED, `Error reading or parsing '${filePath}': ${error.message}`));
        process.exit(1);
    }
};

/**
 * Saves a JSON object to a file with indentation asynchronously.
 *
 * @param {string} filePath - The path to the JSON file.
 * @param {Object} data - The JSON data to save.
 */
const saveJSON = async (filePath, data) => {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        await fs.writeFile(filePath, jsonString, 'utf8');
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
 * @param {Object} specialKeyMappings - A map of special keys to their source keys.
 * @param {string} currentKey - The key currently being processed.
 * @param {Object} baseTheme - The base theme JSON object.
 * @returns {*} The best matching value or null if a random selection is needed.
 */
const determineBestMatchValue = (baseValue, valueToKeysMap, targetJSON, specialKeyMappings, currentKey, baseTheme) => {
    if (specialKeyMappings.hasOwnProperty(currentKey)) {
        const sourceKey = specialKeyMappings[currentKey];
        if (targetJSON.hasOwnProperty(sourceKey)) {
            console.log(formatMessage(COLORS.FG_CYAN, `🔍 Found source key '${sourceKey}' in target JSON.`));
            return targetJSON[sourceKey];
        } else if (baseTheme && baseTheme.hasOwnProperty(sourceKey)) {
            console.log(formatMessage(COLORS.FG_CYAN, `🔍 Found source key '${sourceKey}' in base theme.`));
            return baseTheme[sourceKey];
        } else {
            console.warn(
                formatMessage(
                    COLORS.FG_YELLOW,
                    `⚠️ Source key '${sourceKey}' for special key '${currentKey}' not found. Using random border color.`,
                ),
            );
            return null;
        }
    }

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
const backupTheme = async (themePath) => {
    try {
        const backupDir = path.join(path.dirname(themePath), 'backup');
        await fs.mkdir(backupDir, { recursive: true });
        const backupPath = path.join(backupDir, path.basename(themePath));
        await fs.copyFile(themePath, backupPath);
        console.log(formatMessage(COLORS.FG_CYAN, `Backup created at '${backupPath}'.`));
    } catch (error) {
        console.error(formatMessage(COLORS.FG_RED, `❌ Error creating backup for '${themePath}': ${error.message}`));
    }
};

/**
 * Processes a single theme by adding missing keys and removing extra keys.
 *
 * @param {string} themePath - The path to the theme file.
 * @param {Object} baseTheme - The base JSON object.
 * @param {boolean} dryRun - If true, no changes will be written to files.
 * @param {Object} specialKeyMappings - A map of special keys to their source keys.
 * @returns {Promise<void>}
 */
const processTheme = async (themePath, baseTheme, dryRun, specialKeyMappings = {}) => {
    const themeJSON = await loadJSON(themePath);
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

        for (const key of missingKeys) {
            if (isExcludedKey(key)) {
                console.log(formatMessage(COLORS.FG_MAGENTA, `❗ Excluded key from addition: "${key}"`));
                continue;
            }

            const baseValue = baseTheme[key];
            const bestValue = determineBestMatchValue(
                baseValue,
                valueToKeysMap,
                themeJSON,
                specialKeyMappings,
                key,
                baseTheme,
            );

            if (bestValue !== null) {
                themeJSON[key] = bestValue;
                console.log(formatMessage(COLORS.FG_GREEN, `➕ Added key: "${key}": "${bestValue}"`));
            } else {
                if (borderColors.length === 0) {
                    console.error(formatMessage(COLORS.FG_RED, '❌ Error: No border colors available to assign.'));
                    continue;
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
        }
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

        for (const key of extraKeys) {
            delete themeJSON[key];
            console.log(formatMessage(COLORS.FG_RED, `➖ Removed key: "${key}"`));
            hasChanges = true;
        }
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
            await backupTheme(themePath);
            await saveJSON(themePath, themeJSON);
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
const main = async () => {
    const args = process.argv.slice(2);
    const dryRunIndex = args.indexOf('--dry-run');
    const dryRun = dryRunIndex !== -1;
    if (dryRun) {
        args.splice(dryRunIndex, 1);
        console.log(formatMessage(COLORS.FG_CYAN, '🔍 Running in Dry-Run mode. No files will be modified.'));
    }

    const themesDir = args[0] || path.join(os.homedir(), '.config', 'ags', 'themes');

    try {
        await fs.access(themesDir);
    } catch (error) {
        console.error(formatMessage(COLORS.FG_RED, `❌ Error: Themes directory '${themesDir}' does not exist.`));
        process.exit(1);
    }

    const baseThemeFile = 'catppuccin_mocha.json';
    const baseThemeSplitFile = 'catppuccin_mocha_split.json';
    const baseThemeVividFile = 'catppuccin_mocha_vivid.json';
    const baseThemePath = path.join(themesDir, baseThemeFile);
    const baseThemeSplitPath = path.join(themesDir, baseThemeSplitFile);
    const baseThemeVividPath = path.join(themesDir, baseThemeVividFile);

    const baseThemes = [
        { file: baseThemeFile, path: baseThemePath },
        { file: baseThemeSplitFile, path: baseThemeSplitPath },
        { file: baseThemeVividFile, path: baseThemeVividPath },
    ];

    for (const theme of baseThemes) {
        try {
            await fs.access(theme.path);
        } catch (error) {
            console.error(
                formatMessage(COLORS.FG_RED, `❌ Error: Base theme '${theme.file}' does not exist in '${themesDir}'.`),
            );
            process.exit(1);
        }
    }

    const [baseTheme, baseThemeSplit, baseThemeVivid] = await Promise.all([
        loadJSON(baseThemePath),
        loadJSON(baseThemeSplitPath),
        loadJSON(baseThemeVividPath),
    ]);

    const themeFiles = (await fs.readdir(themesDir)).filter((file) => file.endsWith('.json'));

    const specialKeyMappings = {
        'theme.bar.menus.menu.bluetooth.scroller.color': 'theme.bar.menus.menu.bluetooth.label.color',
        'theme.bar.menus.menu.network.scroller.color': 'theme.bar.menus.menu.network.label.color',
    };

    const queue = [...themeFiles].filter(
        (file) =>
            !['catppuccin_mocha.json', 'catppuccin_mocha_split.json', 'catppuccin_mocha_vivid.json'].includes(file),
    );

    const processQueue = async () => {
        while (queue.length > 0) {
            const promises = [];
            for (let i = 0; i < concurrencyLimit && queue.length > 0; i++) {
                const file = queue.shift();
                const themePath = path.join(themesDir, file);
                let correspondingBaseTheme;

                if (file.endsWith('_split.json')) {
                    correspondingBaseTheme = baseThemeSplit;
                } else if (file.endsWith('_vivid.json')) {
                    correspondingBaseTheme = baseThemeVivid;
                } else {
                    correspondingBaseTheme = baseTheme;
                }

                promises.push(
                    processTheme(themePath, correspondingBaseTheme, dryRun, specialKeyMappings).catch((error) => {
                        console.error(formatMessage(COLORS.FG_RED, `❌ Error processing '${file}': ${error.message}`));
                    }),
                );
            }
            await Promise.all(promises);
        }
    };

    await processQueue();

    console.log(formatMessage(COLORS.FG_GREEN, '\n🎉 All themes have been processed.'));
};

main();
