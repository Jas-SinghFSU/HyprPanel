import { bind, Variable } from 'astal';
import { BarBoxChild, BarModule } from 'src/lib/types/bar';
import { BarButtonStyles } from 'src/lib/types/options';
import options from 'src/options';

const { style } = options.theme.bar.buttons;

const undefinedVar = Variable(undefined);

export const Module = ({
    icon,
    textIcon,
    useTextIcon = bind(Variable(false)),
    label,
    tooltipText,
    boxClass,
    isVis,
    props = {},
    showLabelBinding = bind(undefinedVar),
    showLabel,
    labelHook,
    hook,
}: BarModule): BarBoxChild => {
    const getIconWidget = (useTxtIcn: boolean): JSX.Element | undefined => {
        let iconWidget: JSX.Element | undefined;

        if (icon !== undefined && !useTxtIcn) {
            iconWidget = <icon className={`txt-icon bar-button-icon module-icon ${boxClass}`} icon={icon} />;
        } else if (textIcon !== undefined) {
            iconWidget = <label className={`txt-icon bar-button-icon module-icon ${boxClass}`} label={textIcon} />;
        }

        return iconWidget;
    };

    const componentClass = Variable.derive(
        [bind(style), showLabelBinding],
        (style: BarButtonStyles, shwLabel: boolean) => {
            const shouldShowLabel = shwLabel || showLabel;
            const styleMap = {
                default: 'style1',
                split: 'style2',
                wave: 'style3',
                wave2: 'style3',
            };
            return `${boxClass} ${styleMap[style]} ${!shouldShowLabel ? 'no-label' : ''}`;
        },
    );

    const componentChildren = Variable.derive(
        [showLabelBinding, useTextIcon],
        (showLabel: boolean, forceTextIcon: boolean): JSX.Element[] => {
            const childrenArray = [];
            const iconWidget = getIconWidget(forceTextIcon);

            if (iconWidget !== undefined) {
                childrenArray.push(iconWidget);
            }

            if (showLabel) {
                childrenArray.push(
                    <label
                        className={`bar-button-label module-label ${boxClass}`}
                        label={label ?? ''}
                        setup={labelHook}
                    />,
                );
            }
            return childrenArray;
        },
    );

    const component: JSX.Element = (
        <box
            tooltipText={tooltipText}
            className={componentClass()}
            setup={hook}
            onDestroy={() => {
                componentChildren.drop();
                componentClass.drop();
            }}
        >
            {componentChildren()}
        </box>
    );

    return {
        component,
        tooltip_text: tooltipText,
        isVis: isVis,
        boxClass,
        props,
    };
};
