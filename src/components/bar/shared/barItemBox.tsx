import { BarBoxChild } from 'src/lib/types/bar';
import { Bind } from '../../../lib/types/variable';
import options from '../../../options';
import { bind } from 'astal';
import { Astal } from 'astal/gtk3';

const computeVisible = (child: BarBoxChild): Bind | boolean => {
    if (child.isVis !== undefined) {
        return bind(child.isVis);
    }
    return child.isVisible;
};

export const BarItemBox = (child: BarBoxChild): Partial<Astal.Button> => {
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
        <button onClick={() => {}} className={buttonClassName} visible={computeVisible(child)} {...child.props}>
            {child.component}
        </button>
    );
};
