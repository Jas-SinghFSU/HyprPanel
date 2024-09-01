import { Binding } from "lib/utils";
import { openMenu } from "modules/bar/utils";
import options from "options";
import Gdk from "types/@girs/gdk-3.0/gdk-3.0";
import Gtk from "types/@girs/gtk-3.0/gtk-3.0";
import { Variable as VariableType } from "types/variable";
import Button from "types/widgets/button";

const { scrollSpeed } = options.bar.customModules;

export const runAsyncCommand = (cmd: string, fn: Function, events: { clicked: any, event: Gdk.Event }): void => {
    if (cmd.startsWith('menu:')) {
        // if the command starts with 'menu:', then it is a menu command
        // and we shoud App.toggleMenu("menuName") based on the input menu:menuName. Ignoring spaces and case
        const menuName = cmd.split(':')[1].trim().toLowerCase();

        openMenu(events.clicked, events.event, `${menuName}menu`);

        return;
    }
    Utils.execAsync(`bash -c "${cmd}"`)
        .then((output) => {
            if (fn !== undefined) {
                fn(output);
            }
        })
        .catch(err => console.error(`Error running command "${cmd}": ${err})`));
}

export function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
    let inThrottle: boolean;
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    } as T;
}

export const throttledScrollHandler = (interval: number) => throttle((cmd: string, fn: Function | undefined) => {
    Utils.execAsync(`bash -c "${cmd}"`)
        .then((output) => {
            if (fn !== undefined) {
                fn(output);
            }
        })
        .catch(err => console.error(`Error running command "${cmd}": ${err}`));
}, 200 / interval);

const dummyVar = Variable("");

export const inputHandler = (
    self: Button<Gtk.Widget, Gtk.Widget>,
    {
        onPrimaryClick,
        onSecondaryClick,
        onMiddleClick,
        onScrollUp,
        onScrollDown
    }
) => {
    const sanitizeInput = (input: VariableType<string>): string => {
        if (input === undefined) {
            return '';
        }
        return input.value;
    }

    // Function to update event handlers dynamically
    const updateHandlers = (): void => {
        const interval = scrollSpeed.value; // Get the current interval value
        const throttledHandler = throttledScrollHandler(interval); // Create a new throttled handler with the updated interval

        self.on_primary_click = (clicked: any, event: Gdk.Event) => runAsyncCommand(sanitizeInput(onPrimaryClick?.cmd || dummyVar), onPrimaryClick.fn, { clicked, event });
        self.on_secondary_click = (clicked: any, event: Gdk.Event) => runAsyncCommand(sanitizeInput(onSecondaryClick?.cmd || dummyVar), onSecondaryClick.fn, { clicked, event });
        self.on_middle_click = (clicked: any, event: Gdk.Event) => runAsyncCommand(sanitizeInput(onMiddleClick?.cmd || dummyVar), onMiddleClick.fn, { clicked, event });
        self.on_scroll_up = () => throttledHandler(sanitizeInput(onScrollUp?.cmd || dummyVar), onScrollUp.fn);
        self.on_scroll_down = () => throttledHandler(sanitizeInput(onScrollDown?.cmd || dummyVar), onScrollDown.fn);
    };

    // Initial setup of event handlers
    updateHandlers();

    const sanitizeVariable = (someVar: VariableType<string> | undefined): Binding<string> => {
        if (someVar === undefined || typeof someVar.bind !== 'function') {
            return dummyVar.bind("value");
        }
        return someVar.bind("value");
    }

    // Re-run the update whenever scrollSpeed changes
    Utils.merge([
        scrollSpeed.bind("value"),
        sanitizeVariable(onPrimaryClick),
        sanitizeVariable(onSecondaryClick),
        sanitizeVariable(onMiddleClick),
        sanitizeVariable(onScrollUp),
        sanitizeVariable(onScrollDown)
    ], updateHandlers);
}
