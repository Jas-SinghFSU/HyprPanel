import { App } from 'astal/gtk3';
import { Gio } from 'astal/file';
import { GLib } from 'astal/gobject';

declare global {
    const CONFIG_DIR: string;
    const CONFIG_FILE: string;
    const TMP: string;
    const USER: string;
    const SRC_DIR: string;
}

export function ensureDirectory(path: string): void {
    if (!GLib.file_test(path, GLib.FileTest.EXISTS)) {
        Gio.File.new_for_path(path).make_directory_with_parents(null);
    }
}

export function ensureJsonFile(path: string): void {
    const file = Gio.File.new_for_path(path);
    const parent = file.get_parent();

    if (parent && !parent.query_exists(null)) {
        parent.make_directory_with_parents(null);
    }

    if (!file.query_exists(null)) {
        const stream = file.create(Gio.FileCreateFlags.NONE, null);
        stream.write_all('{}', null);
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

const dataDir = typeof DATADIR !== 'undefined' ? DATADIR : SRC;

Object.assign(globalThis, {
    CONFIG_DIR: `${GLib.get_user_config_dir()}/hyprpanel`,
    CONFIG_FILE: `${GLib.get_user_config_dir()}/hyprpanel/config.json`,
    TMP: `${GLib.get_tmp_dir()}/hyprpanel`,
    USER: GLib.get_user_name(),
    SRC_DIR: dataDir,
});

ensureDirectory(TMP);
ensureFile(CONFIG_FILE);
ensureJsonFile(`${CONFIG_DIR}/modules.json`);
ensureFile(`${CONFIG_DIR}/modules.scss`);
App.add_icons(`${SRC_DIR}/assets`);
