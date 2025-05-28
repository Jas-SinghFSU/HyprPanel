import { BarBoxChild } from 'src/components/bar/types';
import { bind, Binding } from 'astal';
import options from 'src/configuration';

const computeVisible = (child: BarBoxChild): Binding<boolean> | boolean => {
    if (child.isVis !== undefined) {
        return child.isVis;
    }

    return child.isVisible ?? true;
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
