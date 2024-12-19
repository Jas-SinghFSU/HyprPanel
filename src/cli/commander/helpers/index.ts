/* eslint-disable @typescript-eslint/no-unused-vars */

import { CommandRegistry } from '../Registry';
import { CategoryMap, Command, PositionalArg } from '../types';

const ANSI_RESET = '\x1b[0m';
const ANSI_BOLD = '\x1b[1m';
const ANSI_UNDERLINE = '\x1b[4m';

// Foreground Colors
const ANSI_FG_RED = '\x1b[31m';
const ANSI_FG_GREEN = '\x1b[32m';
const ANSI_FG_YELLOW = '\x1b[33m';
const ANSI_FG_BLUE = '\x1b[34m';
const ANSI_FG_MAGENTA = '\x1b[35m';
const ANSI_FG_CYAN = '\x1b[36m';
const ANSI_FG_WHITE = '\x1b[37m';

// Background Colors
const ANSI_BG_RED = '\x1b[41m';
const ANSI_BG_GREEN = '\x1b[42m';
const ANSI_BG_YELLOW = '\x1b[43m';
const ANSI_BG_BLUE = '\x1b[44m';
const ANSI_BG_MAGENTA = '\x1b[45m';
const ANSI_BG_CYAN = '\x1b[46m';
const ANSI_BG_WHITE = '\x1b[47m';

/**
 * Creates the explain command.
 *
 * This command displays all available commands categorized by their respective
 * categories. If a specific command name is provided as an argument, it displays
 * detailed information about that command, including its positional parameters and aliases.
 *
 * @param registry - The command registry to use.
 * @returns The explain command.
 */
export function createExplainCommand(registry: CommandRegistry): Command {
    return {
        name: 'explain',
        aliases: ['e'],
        description: 'Displays explain information for all commands or a specific command.',
        category: 'General',
        args: [
            {
                name: 'commandName',
                description: 'Optional name of a command to get detailed info.',
                type: 'string',
                required: false,
            },
        ],
        /**
         * Handler for the explain command.
         *
         * @param args - The arguments passed to the command.
         * @returns The formatted explain message.
         */
        handler: (args: Record<string, unknown>): string => {
            const commandName = args['commandName'] as string | undefined;

            if (commandName) {
                return formatCommandExplain(registry, commandName);
            }

            return formatGlobalExplain(registry);
        },
    };
}

/**
 * Formats the detailed explain message for a specific command.
 *
 * @param registry - The command registry to retrieve the command.
 * @param commandName - The name of the command to get detailed explain for.
 * @returns The formatted detailed explain message.
 */
function formatCommandExplain(registry: CommandRegistry, commandName: string): string {
    const cmd = registry.get(commandName);
    if (!cmd) {
        return `${ANSI_FG_RED}✖ No such command: "${commandName}". Use "explain" to see all commands.${ANSI_RESET}\n`;
    }

    let message = `${ANSI_BOLD}${ANSI_FG_YELLOW}Command: ${cmd.name}${ANSI_RESET}\n`;

    if (cmd.aliases && cmd.aliases.length > 0) {
        const aliases = formatAliases(cmd.aliases);
        message += `${ANSI_FG_GREEN}Aliases:${ANSI_RESET} ${aliases}\n`;
    }

    message += `${ANSI_FG_GREEN}Description:${ANSI_RESET} ${cmd.description}\n`;
    message += `${ANSI_FG_GREEN}Category:${ANSI_RESET} ${cmd.category}\n`;

    if (cmd.args.length > 0) {
        message += `${ANSI_FG_GREEN}Arguments:${ANSI_RESET}\n`;
        const formattedArgs = formatArguments(cmd.args);
        message += formattedArgs;
    } else {
        message += `${ANSI_FG_GREEN}No positional arguments.${ANSI_RESET}`;
    }

    return message;
}

/**
 * Formats the global explain message listing all available commands categorized by their categories.
 *
 * @param registry - The command registry to retrieve all commands.
 * @returns The formatted global explain message.
 */
function formatGlobalExplain(registry: CommandRegistry): string {
    const allCommands = registry.getAll();
    const categoryMap: CategoryMap = organizeCommandsByCategory(allCommands);

    let explainMessage = `${ANSI_BOLD}${ANSI_FG_CYAN}Available HyprPanel Commands:${ANSI_RESET}\n`;

    for (const [category, cmds] of Object.entries(categoryMap)) {
        explainMessage += `\n${ANSI_BOLD}${ANSI_FG_BLUE}${category}${ANSI_RESET}\n`;
        const formattedCommands = formatCommandList(cmds);
        explainMessage += formattedCommands;
    }

    explainMessage += `\n${ANSI_FG_MAGENTA}Use "hyprpanel explain <commandName>" to get detailed information about a specific hyprpanel command.${ANSI_RESET}\n`;

    return explainMessage.trim();
}

/**
 * Organizes commands into their respective categories.
 *
 * @param commands - The list of all commands.
 * @returns A mapping of category names to arrays of commands.
 */
function organizeCommandsByCategory(commands: Command[]): CategoryMap {
    const categoryMap: CategoryMap = {};

    commands.forEach((cmd) => {
        if (!categoryMap[cmd.category]) {
            categoryMap[cmd.category] = [];
        }
        categoryMap[cmd.category].push(cmd);
    });

    return categoryMap;
}

/**
 * Formats the list of commands under a specific category.
 *
 * @param commands - The list of commands in a category.
 * @returns A formatted string of commands.
 */
function formatCommandList(commands: Command[]): string {
    return (
        commands
            .map((cmd) => {
                const aliasesText =
                    cmd.aliases && cmd.aliases.length > 0
                        ? ` (${cmd.aliases.map((alias) => `${ANSI_FG_CYAN}${alias}${ANSI_RESET}`).join(', ')})`
                        : '';
                return `  - ${ANSI_FG_YELLOW}${cmd.name}${ANSI_RESET}${aliasesText}: ${cmd.description}`;
            })
            .join('\n') + '\n'
    );
}

/**
 * Formats the aliases array into a readable string with appropriate coloring.
 *
 * @param aliases - The array of alias strings.
 * @returns The formatted aliases string.
 */
function formatAliases(aliases: string[]): string {
    return aliases.map((alias) => `${ANSI_FG_CYAN}${alias}${ANSI_RESET}`).join(', ');
}

/**
 * Formats the arguments array into a readable string with appropriate coloring.
 *
 * @param args - The array of positional arguments.
 * @returns The formatted arguments string.
 */
function formatArguments(args: PositionalArg[]): string {
    return (
        args
            .map((arg) => {
                const requirement = arg.required ? `${ANSI_FG_RED}(required)` : `${ANSI_FG_CYAN}(optional)`;
                const defaultValue =
                    arg.default !== undefined
                        ? ` ${ANSI_FG_MAGENTA}[default: ${JSON.stringify(arg.default)}]${ANSI_RESET}`
                        : '';
                return `  ${ANSI_FG_YELLOW}${arg.name}${ANSI_RESET}: ${arg.description} ${requirement}${defaultValue}`;
            })
            .join('\n') + '\n'
    );
}
