import { dependencies, sh } from "lib/utils"
const hyprland = await Service.import("hyprland");

export type Resolution = 1920 | 1366 | 3840
export type Market =
    | "random"
    | "en-US"
    | "ja-JP"
    | "en-AU"
    | "en-GB"
    | "de-DE"
    | "en-NZ"
    | "en-CA"

const WP = `${Utils.HOME}/.config/background`

class Wallpaper extends Service {
    static {
        Service.register(this, {}, {
            "wallpaper": ["string"],
        })
    }

    #blockMonitor = false

    #wallpaper() {
        if (!dependencies("swww"))
            return

        hyprland.monitors.map(m => m.name);
        sh("hyprctl cursorpos").then(pos => {
            sh([
                "swww", "img",
                "--invert-y",
                "--transition-type", "grow",
                "--transition-duration", "1.5",
                "--transition-fps", "30",
                "--transition-pos", pos.replace(" ", ""),
                WP,
            ]).then(() => {
                this.changed("wallpaper")
            })
        })
    }

    async #setWallpaper(path: string) {
        this.#blockMonitor = true

        await sh(`cp ${path} ${WP}`)
        this.#wallpaper()

        this.#blockMonitor = false
    }

    readonly set = (path: string) => { this.#setWallpaper(path) }
    get wallpaper() { return WP }

    constructor() {
        super()

        if (!dependencies("swww"))
            return this

        // gtk portal
        Utils.monitorFile(WP, () => {
            if (!this.#blockMonitor)
                this.#wallpaper()
        })

        Utils.execAsync("swww-daemon")
            .then(this.#wallpaper)
            .catch(() => null)
    }
}

export default new Wallpaper
