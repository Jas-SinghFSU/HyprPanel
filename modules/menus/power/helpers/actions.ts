import { Action } from "lib/types/power";
import options from "options";
const { sleep, reboot, logout, shutdown } = options.menus.dashboard.powermenu;

class PowerMenu extends Service {
    static {
        Service.register(
            this,
            {},
            {
                title: ["string"],
                cmd: ["string"],
            },
        );
    }

    #title = "";
    #cmd = "";

    get title() {
        return this.#title;
    }

    action(action: Action) {
        [this.#cmd, this.#title] = {
            sleep: [sleep.value, "Sleep"],
            reboot: [reboot.value, "Reboot"],
            logout: [logout.value, "Log Out"],
            shutdown: [shutdown.value, "Shutdown"],
        }[action];

        this.notify("cmd");
        this.notify("title");
        this.emit("changed");
        App.closeWindow("powermenu");
        App.openWindow("verification");
    }

    customAction(action: Action, cmnd: string) {
        [this.#cmd, this.#title] = [cmnd, action];

        this.notify("cmd");
        this.notify("title");
        this.emit("changed");
        App.closeWindow("powermenu");
        App.openWindow("verification");
    }

    shutdown = () => {
        this.action("shutdown");
    };

    exec = () => {
        App.closeWindow("verification");
        Utils.execAsync(this.#cmd);
    };
}

const powermenu = new PowerMenu();
Object.assign(globalThis, { powermenu });
export default powermenu;
