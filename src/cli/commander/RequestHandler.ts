import { CommandParser } from './Parser';
import { ResponseCallback } from './types';

/**
 * The RequestHandler orchestrates the parsing and execution of commands:
 * 1. Uses the CommandParser to parse the input into a command and args.
 * 2. Invokes the command handler with the parsed arguments.
 * 3. Handles any errors and passes the result back via the response callback.
 */
export class RequestHandler {
    private parser: CommandParser;

    /**
     * Creates an instance of RequestHandler.
     *
     * @param parser - The CommandParser instance to use.
     */
    constructor(parser: CommandParser) {
        this.parser = parser;
    }

    /**
     * Initializes the request handler with the given input and response callback.
     *
     * @param input - The input string to process.
     * @param response - The callback to handle the response.
     * @returns A promise that resolves when the request is handled.
     */
    async initializeRequestHandler(input: string, response: ResponseCallback): Promise<void> {
        try {
            const parsed = this.parser.parse(input);
            const { command, args } = parsed;

            const result = command.handler(args);
            if (result instanceof Promise) {
                const resolved = await result;
                response(this.formatOutput(resolved));
            } else {
                response(this.formatOutput(result));
            }
        } catch (error) {
            response(this.formatError(error));
        }
    }

    /**
     * Formats the output based on its type.
     *
     * @param output - The output to format.
     * @returns A string representation of the output.
     */
    private formatOutput(output: unknown): string {
        if (typeof output === 'string') {
            return output;
        } else if (typeof output === 'number' || typeof output === 'boolean') {
            return output.toString();
        } else if (typeof output === 'object' && output !== null) {
            try {
                return JSON.stringify(output, null, 2);
            } catch {
                return 'Unable to display object.';
            }
        } else {
            return String(output);
        }
    }

    /**
     * Formats the error based on its type.
     *
     * @param error - The error to format.
     * @returns A string representation of the error.
     */
    private formatError(error: unknown): string {
        if (error instanceof Error) {
            return `Error: ${error.message}`;
        } else if (typeof error === 'string') {
            return `Error: ${error}`;
        } else if (typeof error === 'object' && error !== null) {
            try {
                return `Error: ${JSON.stringify(error, null, 2)}`;
            } catch {
                return 'An unknown error occurred.';
            }
        } else {
            return `Error: ${String(error)}`;
        }
    }
}
