import { BarBoxChild } from 'src/lib/types/bar.types';
import options from '../../../options';
import { bind, Binding } from 'astal';

const computeVisible = (child: BarBoxChild): Binding<boolean> | boolean => {
    if (child.isVis !== undefined) {
        return child.isVis;
    }

    return child.isVisible ?? false;
};
export const WidgetContainer = (child: BarBoxChild): JSX.Element => {
    const buttonClassName = bind(options.theme.bar.buttons.style).as((style) => {
        const styleMap = {
            default: 'style1',
            split: 'style2',
            wave: 'style3',
            wave2: 'style4',
        };

        const boxClassName = Object.hasOwnProperty.call(child, 'boxClass') ? child.boxClass : '';

        return `bar_item_box_visible ${styleMap[style]} ${boxClassName}`;
    });

    if (child.isBox === true) {
        return (
            <eventbox visible={computeVisible(child)} {...child.props}>
                <box className={buttonClassName}>{child.component}</box>
            </eventbox>
        );
    }

    return (
        <button className={buttonClassName} visible={computeVisible(child)} {...child.props}>
            {child.component}
        </button>
    );
};
