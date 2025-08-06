import options from 'src/configuration';
import { BarLayouts, BarModule } from '../options/types';
import { unique } from '../array/helpers';

/**
 * Retrieves all unique layout items from the bar options.
 *
 * This function extracts all unique layout items from the bar options defined in the `options` object.
 * It iterates through the layouts for each monitor and collects items from the left, middle, and right sections.
 *
 * @returns An array of unique layout items.
 */
export function getLayoutItems(): BarModule[] {
    const { layouts } = options.bar;

    const itemsInLayout: BarModule[] = [];

    Object.keys(layouts.get()).forEach((monitor) => {
        const leftItems = layouts.get()[monitor].left ?? [];
        const rightItems = layouts.get()[monitor].right ?? [];
        const middleItems = layouts.get()[monitor].middle ?? [];

        itemsInLayout.push(...leftItems);
        itemsInLayout.push(...middleItems);
        itemsInLayout.push(...rightItems);
    });

    return unique(itemsInLayout);
}

export function setLayout(layout: BarLayouts): string {
    try {
        const { layouts } = options.bar;

        layouts.set(layout);
        return 'Successfully updated layout.';
    } catch (error) {
        return `Failed to set layout: ${error}`;
    }
}
