import { CommandRegistry } from './Registry';
import { CommandParser } from './Parser';
import { RequestHandler } from './RequestHandler';
import { initializeCommands } from './InitializeCommand';
import { ResponseCallback } from './types';

/**
 * This is the entry point for the CLI. It:
 * 1. Creates a CommandRegistry
 * 2. Initializes all commands
 * 3. Creates a CommandParser
 * 4. Creates a RequestHandler
 * 5. Provides a function `runCLI` to process an input string and respond with a callback.
 */

const registry = new CommandRegistry();

initializeCommands(registry);

const parser = new CommandParser(registry);
const handler = new RequestHandler(parser);

/**
 * Run the CLI with a given input and a response callback.
 *
 * @param input - The input string to process.
 * @param response - The callback to handle the response.
 */
export function runCLI(input: string, response: ResponseCallback): void {
    handler.initializeRequestHandler(input, response).catch((err) => {
        response({ error: err instanceof Error ? err.message : String(err) });
    });
}

export { registry };
