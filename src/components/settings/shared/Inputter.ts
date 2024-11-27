import { RowProps } from 'src/lib/types/options';
import { Variable } from 'types/variable';
import { BoxWidget } from 'src/lib/types/widget';
import { numberInputter } from './inputs/number';
import { objectInputter } from './inputs/object';
import { stringInputter } from './inputs/string';
import { booleanInputter } from './inputs/boolean';
import { imageInputter } from './inputs/image';
import { importInputter } from './inputs/import';
import { wallpaperInputter } from './inputs/wallpaper';
import { colorInputter } from './inputs/color';
import { enumInputter } from './inputs/enum';
import { fontInputter } from './inputs/font';

export const Inputter = <T extends string | number | boolean | object>(
    {
        opt,
        type = typeof opt.value as RowProps<T>['type'],
        enums,
        disabledBinding,
        dependencies,
        exportData,
        min = 0,
        max = 1000000,
        increment = 1,
    }: RowProps<T>,
    className: string,
    isUnsaved: Variable<boolean>,
): BoxWidget => {
    return Widget.Box({
        vpack: 'center',
        class_name: /export|import/.test(type || '') ? '' : 'inputter-container',
        setup: (self) => {
            switch (type) {
                case 'number':
                    return numberInputter(self, opt, min, max, increment, isUnsaved);
                case 'float':
                case 'object':
                    return objectInputter(self, opt, isUnsaved, className);
                case 'string':
                    return stringInputter(self, opt, isUnsaved);
                case 'enum':
                    return enumInputter(self, opt, enums!);
                case 'boolean':
                    return booleanInputter(self, opt, disabledBinding, dependencies);
                case 'img':
                    return imageInputter(self, opt);
                case 'config_import':
                    return importInputter(self, exportData);
                case 'wallpaper':
                    return wallpaperInputter(self, opt);
                case 'font':
                    return fontInputter(self, opt);
                case 'color':
                    return colorInputter(self, opt);
                default:
                    return (self.child = Widget.Label({
                        label: `No setter with type ${type}`,
                    }));
            }
        },
    });
};