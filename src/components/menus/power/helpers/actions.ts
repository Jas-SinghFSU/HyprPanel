import { execAsync, GObject, property, register } from 'astal';
import { App } from 'astal/gtk3';
import options from 'src/configuration';
import { Action } from '../types';
const { sleep, reboot, logout, shutdown } = options.menus.dashboard.powermenu;

@register({ GTypeName: 'PowerMenu' })
class PowerMenu extends GObject.Object {
    #title = '';
    #cmd = '';

    @property(String)
    public get title(): string {
        return this.#title;
    }

    @property(String)
    public get cmd(): string {
        return this.#cmd;
    }

    public action(action: Action): void {
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

    public customAction(action: Action, cmnd: string): void {
        [this.#cmd, this.#title] = [cmnd, action];

        this.notify('cmd');
        this.notify('title');

        App.get_window('powermenu')?.set_visible(false);
        App.get_window('verification')?.set_visible(true);
    }

    public shutdown = (): void => {
        this.action('shutdown');
    };

    public exec = (): void => {
        App.get_window('verification')?.set_visible(false);
        execAsync(this.#cmd);
    };
}

const powermenu = new PowerMenu();
export default powermenu;
