import { Opt } from "lib/option"
import Gdk from "gi://Gdk"
import icons from "lib/icons"
import { RowProps } from "lib/types/options"
import { Variable } from "types/variable";
import Wallpaper from "services/Wallpaper";
import { dependencies as checkDependencies, Notify } from "lib/utils";
import options from "options";
import Gtk from "gi://Gtk?version=3.0";
import Gio from "gi://Gio"

const saveFileDialog = (filePath: string, themeOnly: boolean): void => {
    const original_file_path = filePath;

    let file = Gio.File.new_for_path(original_file_path);
    let [success, content] = file.load_contents(null);

    if (!success) {
        console.error(`Could not find 'config.json' at ${TMP}`);
        return;
    }

    let jsonString = new TextDecoder("utf-8").decode(content);
    let jsonObject = JSON.parse(jsonString);

    // Function to filter hex color pairs
    const filterHexColorPairs = (jsonObject: object) => {
        const hexColorPattern = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
        let filteredObject = {};

        for (let key in jsonObject) {
            if (typeof jsonObject[key] === 'string' && hexColorPattern.test(jsonObject[key])) {
                filteredObject[key] = jsonObject[key];
            }
        }

        return filteredObject;
    };

    // Function to filter out hex color pairs (keep only non-hex color value)
    const filterOutHexColorPairs = (jsonObject: object) => {
        const hexColorPattern = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
        let filteredObject = {};

        for (let key in jsonObject) {
            if (!(typeof jsonObject[key] === 'string' && hexColorPattern.test(jsonObject[key]))) {
                filteredObject[key] = jsonObject[key];
            }
        }

        return filteredObject;
    };

    // Filter the JSON object based on the themeOnly flag
    let filteredJsonObject = themeOnly ? filterHexColorPairs(jsonObject) : filterOutHexColorPairs(jsonObject);
    let filteredContent = JSON.stringify(filteredJsonObject, null, 2);

    let dialog = new Gtk.FileChooserDialog({
        title: "Save File As",
        action: Gtk.FileChooserAction.SAVE,
    });

    dialog.add_button(Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL);
    dialog.add_button(Gtk.STOCK_SAVE, Gtk.ResponseType.ACCEPT);
    dialog.set_current_name(themeOnly ? "hyprpanel_theme.json" : "hyprpanel_config.json");

    let response = dialog.run();

    if (response === Gtk.ResponseType.ACCEPT) {
        let file_path = dialog.get_filename();
        console.info(`Original file path: ${file_path}`);

        const getIncrementedFilePath = (filePath: string) => {
            let increment = 1;
            let baseName = filePath.replace(/(\.\w+)$/, '');
            let match = filePath.match(/(\.\w+)$/);
            let extension = match ? match[0] : '';

            let newFilePath = filePath;
            let file = Gio.File.new_for_path(newFilePath);

            while (file.query_exists(null)) {
                newFilePath = `${baseName}_${increment}${extension}`;
                file = Gio.File.new_for_path(newFilePath);
                increment++;
            }

            return newFilePath;
        };

        let finalFilePath = getIncrementedFilePath(file_path as string);
        console.info(`File will be saved at: ${finalFilePath}`);

        try {
            let save_file = Gio.File.new_for_path(finalFilePath);
            let outputStream = save_file.replace(null, false, Gio.FileCreateFlags.NONE, null);
            let dataOutputStream = new Gio.DataOutputStream({
                base_stream: outputStream
            });

            dataOutputStream.put_string(filteredContent, null);

            dataOutputStream.close(null);

            Notify({
                summary: "File Saved Successfully",
                body: `At ${finalFilePath}.`,
                iconName: icons.ui.info,
                timeout: 5000
            });

        } catch (e: any) {
            console.error("Failed to write to file:", e.message);
        }
    }

    dialog.destroy();
}

const importFiles = (themeOnly: boolean = false): void => {
    let dialog = new Gtk.FileChooserDialog({
        title: `Import ${themeOnly ? "Theme" : "Config"}`,
        action: Gtk.FileChooserAction.OPEN,
    });

    dialog.add_button(Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL);
    dialog.add_button(Gtk.STOCK_OPEN, Gtk.ResponseType.ACCEPT);

    let response = dialog.run();

    if (response === Gtk.ResponseType.ACCEPT) {
        let filePath = dialog.get_filename();
        let file = Gio.File.new_for_path(filePath as string);
        let [success, content] = file.load_contents(null);

        if (!success) {
            console.error(`Failed to import: ${filePath}`);
            dialog.destroy();
            return;
        }

        Notify({
            summary: `Importing ${themeOnly ? "Theme" : "Config"}`,
            body: `Importing: ${filePath}`,
            iconName: icons.ui.info,
            timeout: 7000
        });

        let jsonString = new TextDecoder("utf-8").decode(content);
        let importedConfig = JSON.parse(jsonString);

        const hexColorPattern = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

        const saveConfigToFile = (config: object, filePath: string) => {
            let file = Gio.File.new_for_path(filePath);
            let outputStream = file.replace(null, false, Gio.FileCreateFlags.NONE, null);
            let dataOutputStream = new Gio.DataOutputStream({ base_stream: outputStream });

            let jsonString = JSON.stringify(config, null, 2);
            dataOutputStream.put_string(jsonString, null);
            dataOutputStream.close(null);
        };

        const filterConfigForThemeOnly = (config: object) => {
            let filteredConfig = {};
            for (let key in config) {
                if (typeof config[key] === 'string' && hexColorPattern.test(config[key])) {
                    filteredConfig[key] = config[key];
                }
            }
            return filteredConfig;
        };

        const filterConfigForNonTheme = (config: object) => {
            let filteredConfig = {};
            for (let key in config) {
                if (!(typeof config[key] === 'string' && hexColorPattern.test(config[key]))) {
                    filteredConfig[key] = config[key];
                }
            }
            return filteredConfig;
        };

        let tmpConfigFile = Gio.File.new_for_path(`${TMP}/config.json`);
        let optionsConfigFile = Gio.File.new_for_path(OPTIONS);

        let [tmpSuccess, tmpContent] = tmpConfigFile.load_contents(null);
        let [optionsSuccess, optionsContent] = optionsConfigFile.load_contents(null);

        if (!tmpSuccess || !optionsSuccess) {
            console.error("Failed to read existing configuration files.");
            dialog.destroy();
            return;
        }

        let tmpConfig = JSON.parse(new TextDecoder("utf-8").decode(tmpContent));
        let optionsConfig = JSON.parse(new TextDecoder("utf-8").decode(optionsContent));

        if (themeOnly) {
            const filteredConfig = filterConfigForThemeOnly(importedConfig);
            tmpConfig = { ...tmpConfig, ...filteredConfig };
            optionsConfig = { ...optionsConfig, ...filteredConfig };
        } else {
            const filteredConfig = filterConfigForNonTheme(importedConfig);
            tmpConfig = { ...tmpConfig, ...filteredConfig };
            optionsConfig = { ...optionsConfig, ...filteredConfig };
        }

        console.log(JSON.stringify(tmpConfig, null, 2));
        console.log(JSON.stringify(optionsConfig, null, 2));

        saveConfigToFile(tmpConfig, `${TMP}/config.json`);
        saveConfigToFile(optionsConfig, OPTIONS);
    }
    dialog.destroy();
}

const EnumSetter = (opt: Opt<string>, values: string[]) => {
    const lbl = Widget.Label({ label: opt.bind().as(v => `${v}`) })
    const step = (dir: 1 | -1) => {
        const i = values.findIndex(i => i === lbl.label)
        opt.setValue(dir > 0
            ? i + dir > values.length - 1 ? values[0] : values[i + dir]
            : i + dir < 0 ? values[values.length - 1] : values[i + dir],
        )
    }
    const next = Widget.Button({
        child: Widget.Icon(icons.ui.arrow.right),
        on_clicked: () => step(+1),
    })
    const prev = Widget.Button({
        child: Widget.Icon(icons.ui.arrow.left),
        on_clicked: () => step(-1),
    })
    return Widget.Box({
        class_name: "enum-setter",
        children: [lbl, prev, next],
    })
}

export const Inputter = <T>({
    opt,
    type = typeof opt.value as RowProps<T>["type"],
    enums,
    max = 1000000,
    min = 0,
    increment = 1,
    disabledBinding,
    dependencies,
    exportData,
}: RowProps<T>,
    className: string,
    isUnsaved: Variable<boolean>
) => {
    return Widget.Box({
        class_name: /export|import/.test(type || "") ? "" : "inputter-container",
        setup: self => {

            switch (type) {
                case "number": return self.children = [
                    Widget.Box({
                        class_name: "unsaved-icon-container",
                        child: isUnsaved.bind("value").as(unsvd => {
                            if (unsvd) {
                                return Widget.Icon({
                                    class_name: "unsaved-icon",
                                    icon: icons.ui.warning,
                                    tooltipText: "Press 'Enter' to apply your changes."
                                })
                            }
                            return Widget.Box();
                        }),
                    }),
                    Widget.SpinButton({
                        setup(self) {
                            self.set_range(min, max)
                            self.set_increments(1 * increment, 5 * increment)
                            self.on("value-changed", () => {
                                opt.value = self.value as T;
                            })
                            self.hook(opt, () => {
                                self.value = opt.value as number;
                                isUnsaved.value = Number(self.text) !== opt.value as number;
                            })
                            self.connect("key-release-event", () => {
                                isUnsaved.value = Number(self.text) !== opt.value as number;
                            })
                        },
                    })
                ]

                case "float":
                case "object": return self.children = [
                    Widget.Box({
                        class_name: "unsaved-icon-container",
                        child: isUnsaved.bind("value").as(unsvd => {
                            if (unsvd) {
                                return Widget.Icon({
                                    class_name: "unsaved-icon",
                                    icon: icons.ui.warning,
                                    tooltipText: "Press 'Enter' to apply your changes."
                                })
                            }
                            return Widget.Box();
                        }),
                    }),
                    Widget.Entry({
                        class_name: className,
                        on_change: self => isUnsaved.value = self.text !== JSON.stringify(opt.value),
                        on_accept: self => opt.value = JSON.parse(self.text || ""),
                        setup: self => self.hook(opt, () => {
                            self.text = JSON.stringify(opt.value);
                            isUnsaved.value = self.text !== JSON.stringify(opt.value);
                        })
                    })
                ]


                case "string": return self.children = [
                    Widget.Box({
                        class_name: "unsaved-icon-container",
                        child: isUnsaved.bind("value").as(unsvd => {
                            if (unsvd) {
                                return Widget.Icon({
                                    class_name: "unsaved-icon",
                                    icon: icons.ui.warning,
                                    tooltipText: "Press 'Enter' to apply your changes."
                                })
                            }
                            return Widget.Box();
                        }),
                    }),
                    Widget.Entry({
                        class_name: isUnsaved.bind("value").as(unsaved => unsaved ? "unsaved" : ""),
                        on_change: self => isUnsaved.value = self.text !== opt.value,
                        on_accept: self => {
                            opt.value = self.text as T;
                        },
                        setup: self => self.hook(opt, () => {
                            isUnsaved.value = self.text !== opt.value;
                            self.text = opt.value as string;
                        }),
                    })
                ]

                case "enum": return self.child = EnumSetter(opt as unknown as Opt<string>, enums!)
                case "boolean": return self.child = Widget.Switch({
                    sensitive: disabledBinding !== undefined ? disabledBinding.bind("value").as(disabled => !disabled) : true,
                })
                    .on("notify::active", self => {
                        if (disabledBinding !== undefined && disabledBinding.value) {
                            return;
                        }
                        if (self.active && dependencies !== undefined && !dependencies.every(d => checkDependencies(d))) {
                            self.active = false;
                            return;
                        }
                        opt.value = self.active as T
                    })
                    .hook(opt, self => {
                        self.active = opt.value as boolean
                    })

                case "img": return self.child = Widget.FileChooserButton({
                    class_name: "image-chooser",
                    on_file_set: ({ uri }) => { opt.value = uri!.replace("file://", "") as T },
                })

                case "config_import": return self.child = Widget.Box({
                    children: [
                        Widget.Button({
                            class_name: "options-import",
                            label: "import",
                            on_clicked: () => {
                                importFiles(exportData?.themeOnly as boolean);
                            }
                        }),
                        Widget.Button({
                            class_name: "options-export",
                            label: "export",
                            on_clicked: () => {
                                saveFileDialog(exportData?.filePath as string, exportData?.themeOnly as boolean);
                            }
                        }),
                    ]
                })

                case "wallpaper": return self.child = Widget.FileChooserButton({
                    on_file_set: ({ uri }) => {
                        opt.value = uri!.replace("file://", "") as T;
                        if (options.wallpaper.enable.value) {
                            Wallpaper.set(uri!.replace("file://", ""));
                        }
                    },
                })

                case "font": return self.child = Widget.FontButton({
                    show_size: false,
                    use_size: false,
                    setup: self => self
                        .hook(opt, () => self.font = opt.value as string)
                        .on("font-set", ({ font }) => opt.value = font!
                            .split(" ").slice(0, -1).join(" ") as T),
                })

                case "color": return self.child = Widget.ColorButton()
                    .hook(opt, self => {
                        const rgba = new Gdk.RGBA()
                        rgba.parse(opt.value as string)
                        self.rgba = rgba
                    })
                    .on("color-set", ({ rgba: { red, green, blue } }) => {
                        const hex = (n: number) => {
                            const c = Math.floor(255 * n).toString(16)
                            return c.length === 1 ? `0${c}` : c
                        }
                        opt.value = `#${hex(red)}${hex(green)}${hex(blue)}` as T
                    })

                default: return self.child = Widget.Label({
                    label: `no setter with type ${type}`,
                })
            }
        }
    })
}
