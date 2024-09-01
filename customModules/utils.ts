import options from "options";
import Gtk from "types/@girs/gtk-3.0/gtk-3.0";
import Button from "types/widgets/button";

const { scrollSpeed } = options.bar.customModules;

export const runAsyncCommand = (cmd: string, fn: Function | undefined): void => {
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

export const throttledScrollHandler = throttle((cmd: string, fn: Function | undefined) => {
    Utils.execAsync(`bash -c "${cmd}"`)
        .then((output) => {
            if (fn !== undefined) {
                fn(output);
            }
        })
        .catch(err => console.error(`Error running command "${cmd}": ${err}`));
}, 200 / scrollSpeed.value);

export const inputHandler = (self: Button<Gtk.Widget, Gtk.Widget>, { onPrimaryClick, onSecondaryClick, onMiddleClick, onScrollUp, onScrollDown }) => {
    const sanitizeInput = (input: string) => {
        if (input === undefined) {
            return '';
        }
        return input;
    }

    self.hook(scrollSpeed, () => {
        self.on_primary_click = () => runAsyncCommand(sanitizeInput(onPrimaryClick.cmd), onPrimaryClick.fn);
        self.on_secondary_click = () => runAsyncCommand(sanitizeInput(onSecondaryClick.cmd), onSecondaryClick.fn);
        self.on_middle_click = () => runAsyncCommand(sanitizeInput(onMiddleClick.cmd), onMiddleClick.fn);
        self.on_scroll_up = () => throttledScrollHandler(sanitizeInput(onScrollUp.cmd), onScrollUp.fn);
        self.on_scroll_down = () => throttledScrollHandler(sanitizeInput(onScrollDown.cmd), onScrollDown.fn);
    });
}
