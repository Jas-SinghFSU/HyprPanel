import { Action } from 'lib/types/power';
import options from 'options';
const { sleep, reboot, logout, shutdown } = options.menus.dashboard.powermenu;

class PowerMenu extends Service {
    static {
        Service.register(
            this,
            {},
            {
                title: ['string'],
                cmd: ['string'],
            },
        );
    }

    #title = '';
    #cmd = '';

    get title(): string {
        return this.#title;
    }

    action(action: Action): void {
        [this.#cmd, this.#title] = {
            sleep: [sleep.value, 'Sleep'],
            reboot: [reboot.value, 'Reboot'],
            logout: [logout.value, 'Log Out'],
            shutdown: [shutdown.value, 'Shutdown'],
        }[action];

        this.notify('cmd');
        this.notify('title');
        this.emit('changed');
        App.closeWindow('powermenu');
        App.openWindow('verification');
    }

    customAction(action: Action, cmnd: string): void {
        [this.#cmd, this.#title] = [cmnd, action];

        this.notify('cmd');
        this.notify('title');
        this.emit('changed');
        App.closeWindow('powermenu');
        App.openWindow('verification');
    }

    shutdown = (): void => {
        this.action('shutdown');
    };

    exec = (): void => {
        App.closeWindow('verification');
        Utils.execAsync(this.#cmd);
    };
}

const powermenu = new PowerMenu();
Object.assign(globalThis, { powermenu });
export default powermenu;
