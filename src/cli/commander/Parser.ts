import { CommandRegistry } from './Registry';
import { Command, ParsedCommand } from './types';

/**
 * Parses an input string into a command and its positional arguments.
 *
 * Expected format:
 *   astal <commandName> arg1 arg2 arg3...
 *
 * 1. Tokenizes the input.
 * 2. Identifies the command by the first token.
 * 3. Parses positional arguments based on the command definition.
 * 4. Converts arguments to their specified types.
 * 5. Validates required arguments.
 */
export class CommandParser {
    private registry: CommandRegistry;

    /**
     * Constructs a CommandParser with the provided command registry.
     *
     * @param registry - The command registry containing available commands.
     */
    constructor(registry: CommandRegistry) {
        this.registry = registry;
    }

    /**
     * Parses the entire input string, returning the matching command and its arguments.
     *
     * @param input - The raw input string to parse.
     * @returns A parsed command object, including the command and its arguments.
     * @throws If no command token is found.
     * @throws If the command token is not registered.
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
     * Splits the input string into tokens, respecting quotes.
     *
     * @param input - The raw input string to break into tokens.
     * @returns An array of tokens.
     */
    private tokenize(input: string): string[] {
        const regex = /(?:[^\s"']+|"[^"]*"|'[^']*')+/g;
        const matches = input.match(regex);
        return matches ? matches.map((token) => this.stripQuotes(token)) : [];
    }

    /**
     * Removes surrounding quotes from a single token, if they exist.
     *
     * @param str - The token from which to strip leading or trailing quotes.
     * @returns The token without its outer quotes.
     */
    private stripQuotes(str: string): string {
        return str.replace(/^["'](.+(?=["']$))["']$/, '$1');
    }

    /**
     * Parses the array of tokens into arguments based on the command's argument definitions.
     *
     * @param command - The command whose arguments are being parsed.
     * @param tokens - The list of tokens extracted from the input.
     * @returns An object mapping argument names to their parsed values.
     * @throws If required arguments are missing.
     * @throws If there are too many tokens for the command definition.
     */
    private parseArgs(command: Command, tokens: string[]): Record<string, unknown> {
        const args: Record<string, unknown> = {};
        let currentIndex = 0;

        for (const argDef of command.args) {
            if (currentIndex >= tokens.length) {
                if (argDef.required) {
                    throw new Error(`Missing required argument: "${argDef.name}".`);
                }
                if (argDef.default !== undefined) {
                    args[argDef.name] = argDef.default;
                }
                continue;
            }

            if (argDef.type === 'object') {
                const { objectValue, nextIndex } = this.parseObjectTokens(tokens, currentIndex);
                args[argDef.name] = objectValue;
                currentIndex = nextIndex;
            } else {
                const value = tokens[currentIndex];
                currentIndex++;
                args[argDef.name] = this.convertType(value, argDef.type);
            }
        }

        if (currentIndex < tokens.length) {
            throw new Error(
                `Too many arguments for command "${command.name}". Expected at most ${command.args.length}.`,
            );
        }

        return args;
    }

    /**
     * Accumulates tokens until braces are balanced to form a valid JSON string,
     * then parses the result.
     *
     * @param tokens - The list of tokens extracted from the input.
     * @param startIndex - The token index from which to begin JSON parsing.
     * @returns An object containing the parsed JSON object and the next token index.
     * @throws If the reconstructed JSON is invalid.
     */
    private parseObjectTokens(tokens: string[], startIndex: number): { objectValue: unknown; nextIndex: number } {
        let braceCount = 0;
        let started = false;
        const objectTokens: string[] = [];
        let currentIndex = startIndex;

        while (currentIndex < tokens.length) {
            const token = tokens[currentIndex];
            currentIndex++;

            for (const char of token) {
                if (char === '{') braceCount++;
                if (char === '}') braceCount--;
            }

            objectTokens.push(token);

            // Once we've started and braceCount returns to 0, we assume the object is complete
            if (started && braceCount === 0) break;
            if (token.includes('{')) started = true;
        }

        const objectString = objectTokens.join(' ');
        let parsed: unknown;
        try {
            parsed = JSON.parse(objectString);
        } catch {
            throw new Error(`Invalid JSON object: "${objectString}".`);
        }

        return { objectValue: parsed, nextIndex: currentIndex };
    }

    /**
     * Converts a single token to the specified argument type.
     *
     * @param value - The raw token to be converted.
     * @param type - The expected argument type.
     * @returns The converted value.
     * @throws If the token cannot be converted to the expected type.
     */
    private convertType(value: string, type: 'string' | 'number' | 'boolean' | 'object'): unknown {
        switch (type) {
            case 'number': {
                const num = Number(value);
                if (isNaN(num)) {
                    throw new Error(`Expected a number but got "${value}".`);
                }
                return num;
            }
            case 'boolean': {
                const lower = value.toLowerCase();
                if (lower === 'true') return true;
                if (lower === 'false') return false;
                throw new Error(`Expected a boolean (true/false) but got "${value}".`);
            }
            case 'object': {
                try {
                    return JSON.parse(value);
                } catch {
                    throw new Error(`Invalid JSON object: "${value}".`);
                }
            }
            case 'string':
            default:
                return value;
        }
    }
}
