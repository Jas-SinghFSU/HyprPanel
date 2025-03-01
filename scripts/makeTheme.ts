#!/usr/bin/env ts-node
/// <reference types="node" />

/**
 * Provides two transformations on JSON theme data:
 *   1) makeVividTheme:
 *        Swaps .background with .text (or .total) under "theme.bar.buttons.<...>"
 *        Sets .icon to the old .background.
 *   2) makeBaseTheme:
 *        Copies .text (or .total) into .icon under "theme.bar.buttons.<...>"
 *        Leaves .background intact.
 *
 * This script now also handles additional segments between `buttons` and the
 * actual property. For example, it covers cases like:
 *   "theme.bar.buttons.modules.updates.text" (name = "modules.updates", prop = "text")
 *
 * Usage:
 *   ts-node makeTheme.ts <input.json> <output.json> [--vivid | --base | --both]
 *
 * Example:
 *   ts-node makeTheme.ts theme.json updatedTheme.json --vivid
 */

const fs = require('fs');
const path = require('path');

/**
 * Prints the usage/help text.
 */
function printUsage(): void {
    console.log(`
Usage:
  ts-node makeTheme.ts <input.json> <output.json> [--vivid | --base | --both]

Options:
  --help   Show this help message

Transforms:
  --vivid  Swap .background with .text (or .total), set .icon = old background
  --base   Set .icon = .text (or .total), leave .background alone
  --both   Apply makeVividTheme, then makeBaseTheme
`);
}

/**
 * Reads a file as UTF-8 and returns a parsed JSON object.
 */
async function readJson(filePath: string): Promise<Record<string, unknown>> {
    const raw = await fs.promises.readFile(path.resolve(filePath), 'utf8');
    return JSON.parse(raw) as Record<string, unknown>;
}

/**
 * Executes the "vivid" transformation on the input data.
 * For each key matching "theme.bar.buttons.*":
 *   - If it has .background and .text (or .total), swap them.
 *   - Set .icon to the old background.
 */
function makeVividTheme(data: Record<string, unknown>): void {
    data['theme.bar.buttons.style'] = 'default';

    const prefix = 'theme.bar.buttons.';
    const grouped: Record<string, Record<string, unknown>> = {};

    for (const key of Object.keys(data)) {
        if (!key.startsWith(prefix)) continue;

        // Split: ["theme", "bar", "buttons", ...theRest]
        const parts = key.split('.');
        const rest = parts.slice(3);
        if (rest.length < 2) continue; // need at least <name> and <prop>

        // Last segment is the property (e.g. "text", "background")
        // The rest form the "name" (e.g. "modules.updates")
        const prop = rest.pop()!;
        const name = rest.join('.');

        if (!grouped[name]) grouped[name] = {};
        grouped[name][prop] = data[key];
    }

    for (const name of Object.keys(grouped)) {
        const props = grouped[name];
        const hasBg = Object.prototype.hasOwnProperty.call(props, 'background');
        const hasTxt = Object.prototype.hasOwnProperty.call(props, 'text');
        const hasTot = Object.prototype.hasOwnProperty.call(props, 'total');
        if (!hasBg || (!hasTxt && !hasTot)) continue;

        const oldBackground = props['background'];
        let textKey: 'text' | 'total' | undefined;
        if (hasTxt) textKey = 'text';
        else if (hasTot) textKey = 'total';
        if (!textKey) continue;

        const oldText = props[textKey];
        props[textKey] = oldBackground;
        props['icon'] = oldBackground;
        props['background'] = oldText;
    }

    // Write the changes back to the original data
    for (const name of Object.keys(grouped)) {
        for (const prop of Object.keys(grouped[name])) {
            const fullKey = prefix + name + '.' + prop;
            data[fullKey] = grouped[name][prop];
        }
    }
}

/**
 * Executes the "base" transformation on the input data.
 * For each key matching "theme.bar.buttons.*":
 *   - If it has .text or .total, set .icon to that value.
 *   - Leave .background alone.
 */
function makeBaseTheme(data: Record<string, unknown>): void {
    data['theme.bar.buttons.style'] = 'default';

    const prefix = 'theme.bar.buttons.';
    const grouped: Record<string, Record<string, unknown>> = {};

    for (const key of Object.keys(data)) {
        if (!key.startsWith(prefix)) continue;

        const parts = key.split('.');
        const rest = parts.slice(3);
        if (rest.length < 2) continue;

        const prop = rest.pop()!;
        const name = rest.join('.');
        if (!grouped[name]) grouped[name] = {};
        grouped[name][prop] = data[key];
    }

    for (const name of Object.keys(grouped)) {
        const props = grouped[name];
        const hasTxt = Object.prototype.hasOwnProperty.call(props, 'text');
        const hasTot = Object.prototype.hasOwnProperty.call(props, 'total');
        if (!hasTxt && !hasTot) continue;

        const value = hasTxt ? props['text'] : props['total'];
        props['icon'] = value;
    }

    for (const name of Object.keys(grouped)) {
        for (const prop of Object.keys(grouped[name])) {
            const fullKey = prefix + name + '.' + prop;
            data[fullKey] = grouped[name][prop];
        }
    }
}

/**
 * Main CLI entry point.
 */
async function main(): Promise<void> {
    const [, , ...args] = process.argv;
    if (args.includes('--help') || args.length < 2) {
        printUsage();
        process.exit(0);
    }

    const input = args[0];
    const output = args[1];
    const mode = args[2] || '--vivid';

    let data: Record<string, unknown>;
    try {
        data = await readJson(input);
    } catch (e) {
        console.error(`Failed to read/parse: ${input}`, e);
        process.exit(1);
    }

    if (mode === '--vivid') makeVividTheme(data);
    else if (mode === '--base') makeBaseTheme(data);
    else if (mode === '--both') {
        makeVividTheme(data);
        makeBaseTheme(data);
    } else {
        console.error(`Unknown mode: ${mode}`);
        process.exit(1);
    }

    try {
        fs.writeFileSync(path.resolve(output), JSON.stringify(data, null, 2), 'utf8');
        console.log(`Wrote updated theme to: ${output}`);
    } catch (e) {
        console.error(`Failed to write file: ${output}`, e);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch((e) => {
        console.error(e);
        process.exit(1);
    });
}
