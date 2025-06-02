import { defaultWindowTitleMap } from 'src/components/bar/modules/window_title/helpers/appIcons';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import { bind, Variable } from 'astal';
import options from 'src/configuration';
import { capitalizeFirstLetter } from 'src/lib/string/formatters';

const { title_map: userDefinedTitles } = options.bar.windowtitle;

const hyprlandService = AstalHyprland.get_default();
let clientBinding: Variable<void> | undefined;

export const clientTitle = Variable('');

function trackClientUpdates(client: AstalHyprland.Client): void {
    clientBinding?.drop();
    clientBinding = undefined;

    if (client === null) {
        return;
    }

    clientBinding = Variable.derive([bind(client, 'title')], (currentTitle) => {
        clientTitle.set(currentTitle);
    });
}

Variable.derive([bind(hyprlandService, 'focusedClient')], (client) => {
    trackClientUpdates(client);
});

/**
 * Retrieves the matching window title details for a given window.
 *
 * This function searches for a matching window title in the predefined `windowTitleMap` based on the class of the provided window.
 * If a match is found, it returns an object containing the icon and label for the window. If no match is found, it returns a default icon and label.
 *
 * @param hyprlandClient The window object containing the class information.
 *
 * @returns An object containing the icon and label for the window.
 */
export const getWindowMatch = (hyprlandClient: AstalHyprland.Client): Record<string, string> => {
    if (!hyprlandClient?.class) {
        return {
            icon: '󰇄',
            label: 'Desktop',
        };
    }

    const clientClass = hyprlandClient.class.toLowerCase();
    const potentialWindowTitles = [...userDefinedTitles.get(), ...defaultWindowTitleMap];
    const windowMatch = potentialWindowTitles.find((title) => RegExp(title[0]).test(clientClass));

    return {
        icon: windowMatch ? windowMatch[1] : '󰣆',
        label: windowMatch ? windowMatch[2] : `${capitalizeFirstLetter(hyprlandClient.class ?? 'Unknown')}`,
    };
};

/**
 * Retrieves the title for a given window client.
 *
 * This function returns the title of the window based on the provided client object and options.
 * It can use a custom title, the class name, or the actual window title. If the title is empty, it falls back to the class name.
 *
 * @param client The window client object containing the title and class information.
 * @param useCustomTitle A boolean indicating whether to use a custom title.
 * @param useClassName A boolean indicating whether to use the class name as the title.
 *
 * @returns The title of the window as a string.
 */
export const getTitle = (
    client: AstalHyprland.Client,
    useCustomTitle: boolean,
    useClassName: boolean,
): string => {
    if (client === null || useCustomTitle) return getWindowMatch(client).label;

    const title = client.title;

    if (!title || useClassName) return client.class;

    if (title.length === 0 || title.match(/^ *$/)) {
        return client.class;
    }
    return title;
};

/**
 * Truncates the given title to a specified maximum size.
 *
 * This function shortens the provided title string to the specified maximum size.
 * If the title exceeds the maximum size, it appends an ellipsis ('...') to the truncated title.
 *
 * @param title The title string to truncate.
 * @param maxSize The maximum size of the truncated title.
 *
 * @returns The truncated title as a string. If the title is within the maximum size, returns the original title.
 */
export const truncateTitle = (title: string | null, maxSize: number): string => {
    if (title === null) {
        return '--';
    }

    const MAX_LABEL_SIZE = 300;
    const effectiveSize = maxSize <= 0 ? MAX_LABEL_SIZE : Math.min(maxSize, MAX_LABEL_SIZE);

    if (title.length <= effectiveSize) {
        return title;
    }

    return title.substring(0, effectiveSize).trim() + '...';
};
