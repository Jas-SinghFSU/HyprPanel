import { dependencies, sh } from 'lib/utils';
import options from 'options';
const hyprland = await Service.import('hyprland');

const WP = `${Utils.HOME}/.config/background`;

class Wallpaper extends Service {
    static {
        Service.register(
            this,
            {},
            {
                wallpaper: ['string'],
            },
        );
    }

    #blockMonitor = false;
    #isRunning = false;

    #wallpaper(): void {
        if (!dependencies('swww')) return;

        hyprland.monitors.map((m) => m.name);
        sh('hyprctl cursorpos').then((pos) => {
            sh([
                'swww',
                'img',
                '--invert-y',
                '--transition-type',
                'grow',
                '--transition-duration',
                '1.5',
                '--transition-fps',
                '30',
                '--transition-pos',
                pos.replace(' ', ''),
                WP,
            ]).then(() => {
                this.changed('wallpaper');
            });
        });
    }

    async #setWallpaper(path: string): Promise<void> {
        this.#blockMonitor = true;

        await sh(`cp ${path} ${WP}`);
        this.#wallpaper();

        this.#blockMonitor = false;
    }

    readonly set = (path: string): void => {
        this.#setWallpaper(path);
    };
    readonly isRunning = (): boolean => {
        return this.#isRunning;
    };

    get wallpaper(): string {
        return WP;
    }

    constructor() {
        super();

        options.wallpaper.enable.connect('changed', () => {
            if (options.wallpaper.enable.value) {
                this.#isRunning = true;
                Utils.execAsync('swww-daemon')
                    .then(() => {
                        this.#wallpaper();
                    })
                    .catch(() => null);
            } else {
                this.#isRunning = false;
                Utils.execAsync('pkill swww-daemon').catch(() => null);
            }
        });

        if (!dependencies('swww') || !options.wallpaper.enable.value) return this;

        this.#isRunning = true;
        Utils.monitorFile(WP, () => {
            if (!this.#blockMonitor) this.#wallpaper();
        });

        Utils.execAsync('swww-daemon')
            .then(() => {
                this.#wallpaper();
            })
            .catch(() => null);
    }
}

export default new Wallpaper();
