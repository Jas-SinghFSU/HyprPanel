import { Action } from 'src/lib/types/power';
import options from 'src/options';
import { execAsync, GObject, property, register } from 'astal';
import { App } from 'astal/gtk3';
const { sleep, reboot, logout, shutdown } = options.menus.dashboard.powermenu;

@register({ GTypeName: 'PowerMenu' })
class PowerMenu extends GObject.Object {
    #title = '';
    #cmd = '';

    @property(String)
    get title(): string {
        return this.#title;
    }

    @property(String)
    get cmd(): string {
        return this.#cmd;
    }

    action(action: Action): void {
        [this.#cmd, this.#title] = {
            sleep: [sleep.get(), 'Sleep'],
            reboot: [reboot.get(), 'Reboot'],
            logout: [logout.get(), 'Log Out'],
            shutdown: [shutdown.get(), 'Shutdown'],
        }[action];

        this.notify('cmd');
        this.notify('title');

        App.get_window('powermenu')?.set_visible(false);
        App.get_window('verification')?.set_visible(true);
    }

    customAction(action: Action, cmnd: string): void {
        [this.#cmd, this.#title] = [cmnd, action];

        this.notify('cmd');
        this.notify('title');

        App.get_window('powermenu')?.set_visible(false);
        App.get_window('verification')?.set_visible(true);
    }

    shutdown = (): void => {
        this.action('shutdown');
    };

    exec = (): void => {
        App.get_window('verification')?.set_visible(false);
        execAsync(this.#cmd);
    };
}

const powermenu = new PowerMenu();
Object.assign(globalThis, { powermenu });
export default powermenu;
