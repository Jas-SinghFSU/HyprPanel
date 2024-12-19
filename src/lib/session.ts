import { App } from 'astal/gtk3';
import { Gio } from 'astal/file';
import { GLib } from 'astal/gobject';

declare global {
    const CONFIG: string;
    const TMP: string;
    const USER: string;
}

export function ensureDirectory(path: string): void {
    if (!GLib.file_test(path, GLib.FileTest.EXISTS)) Gio.File.new_for_path(path).make_directory_with_parents(null);
}

Object.assign(globalThis, {
    CONFIG: `${GLib.get_user_config_dir()}/hyprpanel/config.json`,
    TMP: `${GLib.get_tmp_dir()}/hyprpanel`,
    USER: GLib.get_user_name(),
});

ensureDirectory(TMP);
App.add_icons(`${SRC}/assets`);
