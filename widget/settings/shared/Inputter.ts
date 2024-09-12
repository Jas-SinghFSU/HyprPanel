import { Opt } from 'lib/option';
import { RowProps } from 'lib/types/options';
import { Variable } from 'types/variable';
import { BoxWidget } from 'lib/types/widget';
import { numberInputter } from './components/number';
import { objectInputter } from './components/object';
import { stringInputter } from './components/string';
import { booleanInputter } from './components/boolean';
import { imageInputter } from './components/image';
import { importInputter } from './components/import';
import { wallpaperInputter } from './components/wallpaper';
import { Notify } from 'lib/utils';
import { colorInputter } from './components/color';
import { enumInputter } from './components/enum';

export const Inputter = <T>(
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
                    return enumInputter(self, opt as unknown as Opt<string>, enums!);
                case 'boolean':
                    return booleanInputter(self, opt, disabledBinding, dependencies);
                case 'img':
                    return imageInputter(self, opt);
                case 'config_import':
                    return importInputter(self, exportData);
                case 'wallpaper':
                    return wallpaperInputter(self, opt as unknown as Opt<string>);
                case 'font':
                    return (self.child = Widget.FontButton({
                        show_size: false,
                        use_size: false,
                        setup: (self) =>
                            self
                                .hook(opt, () => (self.font = opt.value as string))
                                .on(
                                    'font-set',
                                    ({ font }) => (opt.value = font!.split(' ').slice(0, -1).join(' ') as T),
                                ),
                    }));

                case 'color':
                    if (typeof opt.value !== 'string') {
                        Notify({
                            summary: 'Color Picker Error',
                            body: 'Color is not a hex string.',
                        });
                        return;
                    }
                    return colorInputter(self, opt as unknown as Opt<string>);
                default:
                    return (self.child = Widget.Label({
                        label: `no setter with type ${type}`,
                    }));
            }
        },
    });
};
