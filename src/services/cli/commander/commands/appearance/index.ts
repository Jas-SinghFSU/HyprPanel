import { Command } from '../../types';
import { setWallpaper } from 'src/services/cli/helpers/wallpaper';
import { useTheme } from 'src/lib/theme/useTheme';
import { BarLayouts } from 'src/lib/options/types';
import { errorHandler } from 'src/core/errors/handler';
import { setLayout } from 'src/lib/bar/helpers';

export const appearanceCommands: Command[] = [
    {
        name: 'setWallpaper',
        aliases: ['sw'],
        description: 'Sets the wallpaper based on the provided input.',
        category: 'Appearance',
        args: [
            {
                name: 'path',
                description: 'Path to the wallpaper image.',
                type: 'string',
                required: true,
            },
        ],
        handler: (args: Record<string, unknown>): string => {
            try {
                setWallpaper(args['path'] as string);
                return 'Wallpaper set successfully.';
            } catch (error) {
                if (error instanceof Error) {
                    return `Error setting wallpaper: ${error.message}`;
                }
                return `Error setting wallpaper: ${error}`;
            }
        },
    },
    {
        name: 'useTheme',
        aliases: ['ut'],
        description: 'Sets the theme based on the provided input.',
        category: 'Appearance',
        args: [
            {
                name: 'path',
                description: 'Path to the JSON file of the HyprPanel theme.',
                type: 'string',
                required: true,
            },
        ],
        handler: (args: Record<string, unknown>): string => {
            try {
                useTheme(args['path'] as string);
                return 'Theme set successfully.';
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'setLayout',
        aliases: ['slo'],
        description: 'Sets the layout of the modules on the bar.',
        category: 'Appearance',
        args: [
            {
                name: 'layout',
                description:
                    'Bar layout to apply. Wiki: https://hyprpanel.com/configuration/panel.html#layouts',
                type: 'object',
                required: true,
            },
        ],
        handler: (args: Record<string, unknown>): string => {
            try {
                setLayout(args['layout'] as BarLayouts);
                return 'Layout applied successfully.';
            } catch (error) {
                errorHandler(error);
            }
        },
    },
];
