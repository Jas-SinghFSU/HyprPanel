import options from "options";
import { module } from "../module"

import { formatTooltip, inputHandler, renderResourceLabel } from "customModules/utils";
import { computeStorage } from "./computeStorage";
import { ResourceLabelType } from "lib/types/bar";
import { GenericResourceData } from "lib/types/customModules/generic";
import Gtk from "types/@girs/gtk-3.0/gtk-3.0";
import Button from "types/widgets/button";
import { LABEL_TYPES } from "lib/types/defaults/bar";
import { pollVariable } from "customModules/PollVar";

const {
    label,
    labelType,
    icon,
    round,
    leftClick,
    rightClick,
    middleClick,
    pollingInterval
} = options.bar.customModules.storage;

const defaultStorageData = { total: 0, used: 0, percentage: 0, free: 0 };

const storageUsage = Variable(defaultStorageData);

pollVariable(
    storageUsage,
    [round.bind('value')],
    pollingInterval.bind('value'),
    computeStorage,
    round,
);

export const Storage = () => {
    const storageModule = module({
        textIcon: icon.bind("value"),
        label: Utils.merge(
            [storageUsage.bind("value"), labelType.bind("value"), round.bind("value")],
            (storage: GenericResourceData, lblTyp: ResourceLabelType, round: boolean) => {
                return renderResourceLabel(lblTyp, storage, round);
            }),
        tooltipText: labelType.bind("value").as(lblTyp => {
            return formatTooltip('Storage', lblTyp);

        }),
        boxClass: "storage",
        showLabelBinding: label.bind("value"),
        props: {
            setup: (self: Button<Gtk.Widget, Gtk.Widget>) => {
                inputHandler(self, {
                    onPrimaryClick: {
                        cmd: leftClick,
                    },
                    onSecondaryClick: {
                        cmd: rightClick,
                    },
                    onMiddleClick: {
                        cmd: middleClick,
                    },
                    onScrollUp: {
                        fn: () => {
                            labelType.value = LABEL_TYPES[(LABEL_TYPES.indexOf(labelType.value) + 1) % LABEL_TYPES.length] as ResourceLabelType;
                        }
                    },
                    onScrollDown: {
                        fn: () => {
                            labelType.value = LABEL_TYPES[(LABEL_TYPES.indexOf(labelType.value) - 1 + LABEL_TYPES.length) % LABEL_TYPES.length] as ResourceLabelType;
                        }
                    },
                });
            },
        }
    });

    return storageModule;
}
