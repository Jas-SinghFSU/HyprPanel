import { Opt } from "lib/option"
import Gdk from "gi://Gdk"
import icons from "lib/icons"
import { RowProps } from "lib/types/options"
import { Variable } from "types/variable";
import Wallpaper from "services/Wallpaper";
import { dependencies as checkDependencies } from "lib/utils";
import options from "options";
import { importFiles, saveFileDialog } from "./FileChooser";

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
