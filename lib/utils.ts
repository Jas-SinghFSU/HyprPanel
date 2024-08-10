/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Application } from "types/service/applications"
import { NotificationAnchor } from "./types/options"
import { OSDAnchor } from "lib/types/options";
import icons, { substitutes } from "./icons"
import Gtk from "gi://Gtk?version=3.0"
import Gdk from "gi://Gdk"
import GLib from "gi://GLib?version=2.0"
import GdkPixbuf from "gi://GdkPixbuf";
import { NotificationArgs } from "types/utils/notify"

export type Binding<T> = import("types/service").Binding<any, any, T>

/**
  * @returns substitute icon || name || fallback icon
  */
export function icon(name: string | null, fallback = icons.missing) {
    if (!name)
        return fallback || ""

    if (GLib.file_test(name, GLib.FileTest.EXISTS))
        return name

    const icon = (substitutes[name] || name)
    if (Utils.lookUpIcon(icon))
        return icon

    print(`no icon substitute "${icon}" for "${name}", fallback: "${fallback}"`)
    return fallback
}

/**
 * @returns execAsync(["bash", "-c", cmd])
 */
export async function bash(strings: TemplateStringsArray | string, ...values: unknown[]) {
    const cmd = typeof strings === "string" ? strings : strings
        .flatMap((str, i) => str + `${values[i] ?? ""}`)
        .join("")

    return Utils.execAsync(["bash", "-c", cmd]).catch(err => {
        console.error(cmd, err)
        return ""
    })
}

/**
 * @returns execAsync(cmd)
 */
export async function sh(cmd: string | string[]) {
    return Utils.execAsync(cmd).catch(err => {
        console.error(typeof cmd === "string" ? cmd : cmd.join(" "), err)
        return ""
    })
}

// function getGdkMonitors() {
//     const display = Gdk.Display.get_default();
//     const numGdkMonitors = display.get_n_monitors();
//     const gdkMonitors = new Map();
//
//     for (let i = 0; i < numGdkMonitors; i++) {
//         const monitor = display.get_monitor(i);
//         const model = monitor.get_model();
//         const geometry = monitor.get_geometry();
//         const scaleFactor = monitor.get_scale_factor();
//
//         // Create a composite key
//         const key = `${model}_${geometry.width}x${geometry.height}_${geometry.x},${geometry.y}_${scaleFactor}`;
//         gdkMonitors.set(key, i);
//     }
//
//     return gdkMonitors;
// }
// export function forMonitors(widget) {
//     const monitors = JSON.parse(Utils.exec("hyprctl -j monitors"));
//     const gdkMonitors = getGdkMonitors();
//
//     return monitors.map((monitor) => {
//         // Create the composite key for Hyprland monitor
//         const key = `${monitor.model}_${monitor.width}x${monitor.height}_${monitor.x},${monitor.y}_${monitor.scale}`;
//
//         const gdkMonitor = gdkMonitors.get(key);
//         if (gdkMonitor !== undefined) {
//             return widget(monitor.id, gdkMonitor);
//         } else {
//             console.warn(
//                 `Couldn't find Gdk monitor for Hyprland monitor ID ${monitor.id}.`
//             );
//             return widget(monitor.id, monitor.id);
//         }
//     });
// }
// function getGdkMonitors() {
//     const display = Gdk.Display.get_default();
//     const numGdkMonitors = display.get_n_monitors();
//     const gdkMonitors = new Map();
//     for (let i = 0; i < numGdkMonitors; i++) {
//         const model = display.get_monitor(i).get_model();
//         gdkMonitors.set(model, i);
//     }
//     return gdkMonitors;
// }

// export function forMonitors(widget) {
//     const monitors = JSON.parse(Utils.exec("hyprctl -j monitors"));
//     const gdkMonitors = getGdkMonitors();
//     return monitors.map((monitor) => {
//         const gdkMonitor = gdkMonitors.get(monitor.model);
//         if (gdkMonitor !== undefined) {
//             return widget(monitor.id, gdkMonitor);
//         } else {
//             console.warn(
//                 `Couldn't find Gdk monitor for Hyprland monitor ID ${monitor.id}.`
//             );
//             return widget(monitor.id, monitor.id);
//         }
//     });
// }
export function forMonitors(widget: (monitor: number) => Gtk.Window) {
    const n = Gdk.Display.get_default()?.get_n_monitors() || 1
    const mappedWidgets = range(n, 0).flatMap(widget);

    return mappedWidgets;
}

/**
 * @returns [start...length]
 */
export function range(length: number, start = 1) {
    return Array.from({ length }, (_, i) => i + start)
}

/**
 * @returns true if all of the `bins` are found
 */
export function dependencies(...bins: string[]) {
    const missing = bins.filter(bin => Utils.exec({
        cmd: `which ${bin}`,
        out: () => false,
        err: () => true,
    }))

    if (missing.length > 0) {
        console.warn(Error(`missing dependencies: ${missing.join(", ")}`))
        Notify({
            summary: "Dependencies not found!",
            body: `The following dependencies are missing: ${missing.join(", ")}`,
            iconName: icons.ui.warning,
            timeout: 7000
        });
    }

    return missing.length === 0
}

/**
 * run app detached
 */
export function launchApp(app: Application) {
    const exe = app.executable
        .split(/\s+/)
        .filter(str => !str.startsWith("%") && !str.startsWith("@"))
        .join(" ")

    bash(`${exe} &`)
    app.frequency += 1
}

/**
 * to use with drag and drop
 */
export function createSurfaceFromWidget(widget: Gtk.Widget) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cairo = imports.gi.cairo as any
    const alloc = widget.get_allocation()
    const surface = new cairo.ImageSurface(
        cairo.Format.ARGB32,
        alloc.width,
        alloc.height,
    )
    const cr = new cairo.Context(surface)
    cr.setSourceRGBA(255, 255, 255, 0)
    cr.rectangle(0, 0, alloc.width, alloc.height)
    cr.fill()
    widget.draw(cr)
    return surface
}

/**
 * Ensure that the provided filepath is a valid image
 */
export const isAnImage = (imgFilePath: string): boolean => {
    try {
        GdkPixbuf.Pixbuf.new_from_file(imgFilePath);
        return true;
    } catch (error) {
        return false;
    }
}

export const Notify = (notifPayload: NotificationArgs): void => {
    let command = 'notify-send';
    command += ` "${notifPayload.summary} "`;
    if (notifPayload.body) command += ` "${notifPayload.body}" `;
    if (notifPayload.appName) command += ` -a "${notifPayload.appName}"`;
    if (notifPayload.iconName) command += ` -i "${notifPayload.iconName}"`;
    if (notifPayload.urgency) command += ` -u "${notifPayload.urgency}"`;
    if (notifPayload.timeout !== undefined) command += ` -t ${notifPayload.timeout}`;
    if (notifPayload.category) command += ` -c "${notifPayload.category}"`;
    if (notifPayload.transient) command += ` -e`;
    if (notifPayload.id !== undefined) command += ` -r ${notifPayload.id}`;

    Utils.execAsync(command)
}

export function getPosition(pos: NotificationAnchor | OSDAnchor): ("top" | "bottom" | "left" | "right")[] {
    const positionMap: { [key: string]: ("top" | "bottom" | "left" | "right")[] } = {
        "top": ["top"],
        "top right": ["top", "right"],
        "top left": ["top", "left"],
        "bottom": ["bottom"],
        "bottom right": ["bottom", "right"],
        "bottom left": ["bottom", "left"],
        "right": ["right"],
        "left": ["left"],
    };

    return positionMap[pos] || ["top"];
}
