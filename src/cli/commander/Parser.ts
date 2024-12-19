import { CommandRegistry } from './Registry';
import { Command, ParsedCommand } from './types';

/**
 * The CommandParser is responsible for parsing the input string into a command and its positional arguments.
 * It does not handle flags, only positional arguments.
 *
 * Expected command format:
 *   astal <commandName> arg1 arg2 arg3...
 *
 * The parser:
 * 1. Tokenizes the input.
 * 2. Identifies the command by the first token.
 * 3. Parses positional arguments based on the command definition.
 * 4. Converts arguments to their specified types.
 * 5. Validates required arguments.
 */
export class CommandParser {
    private registry: CommandRegistry;

    /**
     * Creates an instance of CommandParser.
     *
     * @param registry - The command registry to use.
     */
    constructor(registry: CommandRegistry) {
        this.registry = registry;
    }

    /**
     * Parses the input string into a ParsedCommand object.
     *
     * @param input - The input string to parse.
     * @returns The parsed command and its arguments.
     * @throws If no command is provided or the command is unknown.
     */
    parse(input: string): ParsedCommand {
        const tokens = this.tokenize(input);
        if (tokens.length === 0) {
            throw new Error('No command provided.');
        }

        const commandName = tokens.shift()!;
        const command = this.registry.get(commandName);
        if (!command) {
            throw new Error(`Unknown command: "${commandName}". Use "hyprpanel explain" for available commands.`);
        }

        const args = this.parseArgs(command, tokens);
        return { command, args };
    }

    /**
     * Tokenizes the input string into an array of tokens.
     *
     * @param input - The input string to tokenize.
     * @returns The array of tokens.
     */
    private tokenize(input: string): string[] {
        const regex = /(?:[^\s"']+|"[^"]*"|'[^']*')+/g;
        const matches = input.match(regex);
        return matches ? matches.map((token) => this.stripQuotes(token)) : [];
    }

    /**
     * Strips quotes from the beginning and end of a string.
     *
     * @param str - The string to strip quotes from.
     * @returns The string without quotes.
     */
    private stripQuotes(str: string): string {
        return str.replace(/^["'](.+(?=["']$))["']$/, '$1');
    }

    /**
     * Parses the positional arguments for a command.
     *
     * @param command - The command definition.
     * @param tokens - The array of argument tokens.
     * @returns The parsed arguments.
     * @throws If there are too many arguments or a required argument is missing.
     */
    private parseArgs(command: Command, tokens: string[]): Record<string, unknown> {
        const args: Record<string, unknown> = {};
        const argDefs = command.args;

        if (tokens.length > argDefs.length) {
            throw new Error(`Too many arguments for command "${command.name}". Expected at most ${argDefs.length}.`);
        }

        argDefs.forEach((argDef, index) => {
            const value = tokens[index];
            if (value === undefined) {
                if (argDef.required) {
                    throw new Error(`Missing required argument: "${argDef.name}".`);
                }
                if (argDef.default !== undefined) {
                    args[argDef.name] = argDef.default;
                }
                return;
            }

            args[argDef.name] = this.convertType(value, argDef.type);
        });

        return args;
    }

    /**
     * Converts a string value to the specified type.
     *
     * @param value - The value to convert.
     * @param type - The type to convert to.
     * @returns  The converted value.
     * @throws If the value cannot be converted to the specified type.
     */
    private convertType(
        value: string,
        type: 'string' | 'number' | 'boolean' | 'object',
    ): string | number | boolean | Record<string, unknown> {
        switch (type) {
            case 'number':
                const num = Number(value);
                if (isNaN(num)) {
                    throw new Error(`Expected a number but got "${value}".`);
                }
                return num;
            case 'boolean':
                if (value.toLowerCase() === 'true') return true;
                if (value.toLowerCase() === 'false') return false;
                throw new Error(`Expected a boolean (true/false) but got "${value}".`);
            case 'object':
                try {
                    return JSON.parse(value);
                } catch {
                    throw new Error(`Invalid JSON object: "${value}".`);
                }
            case 'string':
            default:
                return value;
        }
    }
}
