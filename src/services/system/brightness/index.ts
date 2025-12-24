import { exec, GObject, monitorFile, property, readFileAsync, register } from 'astal';
import { SystemUtilities } from 'src/core/system/SystemUtilities';

const isBrightnessAvailable = SystemUtilities.checkExecutable(['brightnessctl']);

const get = (args: string): number => (isBrightnessAvailable ? Number(exec(`brightnessctl ${args}`)) : 0);
const screen = isBrightnessAvailable ? exec('bash -c "ls -w1 /sys/class/backlight | head -1"') : '';
const kbd = isBrightnessAvailable
    ? exec('bash -c "ls -w1 /sys/class/leds | grep \'::kbd_backlight$\' | head -1"')
    : '';

/**
 * Service for managing screen and keyboard backlight brightness
 */
@register({ GTypeName: 'Brightness' })
export default class BrightnessService extends GObject.Object {
    public static instance: BrightnessService;

    constructor() {
        super();

        const screenPath = `/sys/class/backlight/${screen}/brightness`;
        const kbdPath = `/sys/class/leds/${kbd}/brightness`;

        monitorFile(screenPath, async (f) => {
            const v = await readFileAsync(f);
            this.#screen = Number(v) / this.#screenMax;
            this.notify('screen');
        });

        monitorFile(kbdPath, async (f) => {
            const v = await readFileAsync(f);
            this.#kbd = Number(v) / this.#kbdMax;
            this.notify('kbd');
        });
    }

    /**
     * Gets the singleton instance of BrightnessService
     *
     * @returns The BrightnessService instance
     */
    public static getInstance(): BrightnessService {
        if (BrightnessService.instance === undefined) {
            BrightnessService.instance = new BrightnessService();
        }
        return BrightnessService.instance;
    }

    #kbdMax = kbd?.length ? get(`--device ${kbd} max`) : 0;
    #kbd = kbd?.length ? get(`--device ${kbd} get`) : 0;
    #screenMax = screen?.length ? get(`--device ${screen} max`) : 0;
    #screen = screen?.length ? get(`--device ${screen} get`) / (get(`--device ${screen} max`) || 1) : 0;

    /**
     * Gets the keyboard backlight brightness level
     *
     * @returns The keyboard brightness as a number between 0 and the maximum value
     */
    @property(Number)
    public get kbd(): number {
        return this.#kbd;
    }

    /**
     * Gets the screen brightness level
     *
     * @returns The screen brightness as a percentage (0-1)
     */
    @property(Number)
    public get screen(): number {
        return this.#screen;
    }

    /**
     * Sets the keyboard backlight brightness level
     *
     * @param value - The brightness value to set (0 to maximum)
     */
    public set kbd(value: number) {
        if (value < 0 || value > this.#kbdMax || !kbd?.length) return;

        SystemUtilities.sh(`brightnessctl -d ${kbd} s ${value} -q`).then(() => {
            this.#kbd = value;
            this.notify('kbd');
        });
    }

    /**
     * Sets the screen brightness level
     *
     * @param percent - The brightness percentage to set (0-1)
     */
    public set screen(percent: number) {
        if (!screen?.length) return;

        let brightnessPct = percent;

        if (percent < 0) brightnessPct = 0;

        if (percent > 1) brightnessPct = 1;

        SystemUtilities.sh(`brightnessctl set ${Math.round(brightnessPct * 100)}% -d ${screen} -q`).then(
            () => {
                this.#screen = brightnessPct;
                this.notify('screen');
            },
        );
    }
}
