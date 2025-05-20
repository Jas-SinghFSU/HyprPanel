import options from 'src/configuration';
import { BarModule, BarLayouts } from 'src/lib/options/types';

/**
 * Retrieves all unique layout items from the bar options
 * @returns An array of unique layout items
 */
export function getLayoutItems(): BarModule[] {
    const { layouts } = options.bar;

    const itemsInLayout: BarModule[] = [];

    Object.keys(layouts.get()).forEach((monitor) => {
        const leftItems = layouts.get()[monitor].left;
        const rightItems = layouts.get()[monitor].right;
        const middleItems = layouts.get()[monitor].middle;

        itemsInLayout.push(...leftItems);
        itemsInLayout.push(...middleItems);
        itemsInLayout.push(...rightItems);
    });

    return [...new Set(itemsInLayout)];
}

/**
 * Sets the bar layout
 * @param layout - The layout to set
 * @returns Success or error message
 */
export function setLayout(layout: BarLayouts): string {
    try {
        const { layouts } = options.bar;
        layouts.set(layout);
        return 'Successfully updated layout.';
    } catch (error) {
        return `Failed to set layout: ${error}`;
    }
}
