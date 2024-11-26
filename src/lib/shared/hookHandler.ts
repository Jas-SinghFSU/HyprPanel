// hookHandler.ts
import { GtkWidget } from 'src/lib/types/widget.js';
import { Connectable, Subscribable } from 'astal/binding';

/**
 * A generic hook utility to manage setup and teardown based on dependencies.
 *
 * @param widget - The GtkWidget instance.
 * @param hookTarget - The object to hook into (Connectable or Subscribable).
 * @param setup - The setup function to execute, which returns a disconnect function.
 * @param signal - (Optional) The signal name if hooking into a Connectable.
 */
export function useHook(
    widget: GtkWidget,
    hookTarget: Connectable | Subscribable,
    setup: () => () => void,
    signal?: string,
): void {
    let currentDisconnect: () => void = () => {};

    const wrappedSetup = (): void => {
        // Disconnect previous handlers
        currentDisconnect();

        // Run the setup and store the disconnect function
        currentDisconnect = setup();
    };

    // Initial setup
    wrappedSetup();

    // Hook into the target to re-run setup on dependency change
    if (signal && typeof (hookTarget as Connectable).connect === 'function') {
        widget.hook(hookTarget as Connectable, signal, wrappedSetup);
    } else if (typeof (hookTarget as Subscribable).subscribe === 'function') {
        widget.hook(hookTarget as Subscribable, wrappedSetup);
    }
}
