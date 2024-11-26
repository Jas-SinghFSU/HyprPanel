import { App } from 'astal/gtk3';
import { Gio } from 'astal/file';
import { GLib } from 'astal/gobject';

declare global {
    const OPTIONS: string;
    const TMP: string;
    const USER: string;
}

export function ensureDirectory(path: string): void {
    if (!GLib.file_test(path, GLib.FileTest.EXISTS)) Gio.File.new_for_path(path).make_directory_with_parents(null);
}

Object.assign(globalThis, {
    OPTIONS: `${GLib.get_user_cache_dir()}/ags/hyprpanel/options.json`,
    TMP: `${GLib.get_tmp_dir()}/ags/hyprpanel`,
    USER: GLib.get_user_name(),
});

ensureDirectory(TMP);
App.add_icons(`${SRC}/assets`);
