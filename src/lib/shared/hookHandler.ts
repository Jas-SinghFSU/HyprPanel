import { Connectable, Subscribable } from 'astal/binding';
import { Widget } from 'astal/gtk3';

/**
 * A generic hook utility to manage setup and teardown based on dependencies.
 *
 * @param widget - The GtkWidget instance.
 * @param hookTarget - The object to hook into (Connectable or Subscribable).
 * @param setup - The setup function to execute, which returns a disconnect function.
 * @param signal - (Optional) The signal name if hooking into a Connectable.
 */
export function useHook(
    // eslint-disable-next-line  @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    widget: any,
    hookTarget: Connectable | Subscribable,
    setup: (() => void) | (() => () => void),
    signal?: string,
): void {
    const passedWidget: Widget.Box = widget;
    let currentDisconnect: () => void = () => {};

    const executeSetup = (): void => {
        currentDisconnect();
        if (typeof setup === 'function') {
            currentDisconnect = setup() || ((): void => {});
        }
    };

    const isConnectable = (target: Connectable | Subscribable): target is Connectable => {
        return 'connect' in target;
    };

    const isSubscribable = (target: Connectable | Subscribable): target is Subscribable => {
        return 'subscribe' in target;
    };

    const hookIntoTarget = (): void => {
        if (signal && isConnectable(hookTarget)) {
            passedWidget.hook(hookTarget, signal, executeSetup);
        } else if (isSubscribable(hookTarget)) {
            passedWidget.hook(hookTarget, executeSetup);
        }
    };

    executeSetup();
    hookIntoTarget();
}
