import { BarBoxChild } from 'lib/types/bar';
import { Bind } from 'lib/types/variable';
import { Attribute, GtkWidget } from 'lib/types/widget';
import options from 'options';
import Button from 'types/widgets/button';

export const BarItemBox = (child: BarBoxChild): Button<GtkWidget, Attribute> => {
    const computeVisible = (): Bind | boolean => {
        if (child.isVis !== undefined) {
            return child.isVis.bind('value');
        }
        return child.isVisible;
    };

    return Widget.Button({
        class_name: options.theme.bar.buttons.style.bind('value').as((style) => {
            const styleMap = {
                default: 'style1',
                split: 'style2',
                wave: 'style3',
                wave2: 'style4',
            };

            const boxClassName = Object.hasOwnProperty.call(child, 'boxClass') ? child.boxClass : '';

            return `bar_item_box_visible ${styleMap[style]} ${boxClassName}`;
        }),
        child: child.component,
        visible: computeVisible(),
        ...child.props,
    });
};
