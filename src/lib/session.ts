import { App } from 'astal/gtk3';
import { Gio } from 'astal/file';
import { GLib } from 'astal/gobject';

declare global {
    const CONFIG: string;
    const TMP: string;
    const USER: string;
    const SRC_DIR: string;
}

export function ensureDirectory(path: string): void {
    if (!GLib.file_test(path, GLib.FileTest.EXISTS)) {
        Gio.File.new_for_path(path).make_directory_with_parents(null);
    }
}

export function ensureFile(path: string): void {
    const file = Gio.File.new_for_path(path);
    const parent = file.get_parent();

    if (parent && !parent.query_exists(null)) {
        parent.make_directory_with_parents(null);
    }

    if (!file.query_exists(null)) {
        file.create(Gio.FileCreateFlags.NONE, null);
    }
}

Object.assign(globalThis, {
    CONFIG: `${GLib.get_user_config_dir()}/hyprpanel/config.json`,
    TMP: `${GLib.get_tmp_dir()}/hyprpanel`,
    USER: GLib.get_user_name(),
    SRC_DIR: GLib.getenv('HYPRPANEL_DATADIR') ?? SRC,
});

ensureDirectory(TMP);
ensureFile(CONFIG);
App.add_icons(`${SRC_DIR}/assets`);
