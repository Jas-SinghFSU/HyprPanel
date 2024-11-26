import { Bind } from '../../../lib/types/variable';
import { GtkWidget } from '../../../lib/types/widget';
import options from '../../../options';
import { bind } from 'astal';

const computeVisible = (child: GtkWidget): Bind | boolean => {
    if (child.isVis !== undefined) {
        return child.isVis.bind('value');
    }
    return child.isVisible;
};

export const BarItemBox = (child: GtkWidget): GtkWidget => {
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

    return (
        <button className={buttonClassName} visible={computeVisible(child)} {...child.props}>
            {child.component}
        </button>
    );
};
