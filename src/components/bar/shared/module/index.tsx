import { bind, Variable } from 'astal';
import { BarBoxChild, BarModuleProps } from 'src/components/bar/types';
import { BarButtonStyles } from 'src/lib/options/types';
import options from 'src/configuration';

const { style } = options.theme.bar.buttons;

export const Module = ({
    icon,
    textIcon,
    useTextIcon = bind(Variable(false)),
    label,
    truncationSize = bind(Variable(-1)),
    tooltipText = '',
    boxClass,
    isVis,
    props = {},
    showLabelBinding = bind(Variable(true)),
    showIconBinding = bind(Variable(true)),
    showLabel = true,
    labelHook,
    hook,
}: BarModuleProps): BarBoxChild => {
    const getIconWidget = (useTxtIcn: boolean): JSX.Element | undefined => {
        const className = `txt-icon bar-button-icon module-icon ${boxClass}`;

        const icn = typeof icon === 'string' ? icon : icon?.get();
        if (!useTxtIcn && icn !== undefined && icn.length > 0) {
            return <icon className={className} icon={icon} />;
        }

        const textIcn = typeof textIcon === 'string' ? textIcon : textIcon?.get();
        if (textIcn !== undefined && textIcn.length > 0) {
            return <label className={className} label={textIcon} />;
        }
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
        [showLabelBinding, showIconBinding, useTextIcon],
        (showLabel: boolean, showIcon: boolean, forceTextIcon: boolean): JSX.Element[] => {
            const childrenArray = [];
            const iconWidget = getIconWidget(forceTextIcon);

            if (showIcon && iconWidget !== undefined) {
                childrenArray.push(iconWidget);
            }

            if (showLabel) {
                childrenArray.push(
                    <label
                        className={`bar-button-label module-label ${boxClass}`}
                        truncate={truncationSize.as((truncSize) => truncSize > 0)}
                        maxWidthChars={truncationSize.as((truncSize) => truncSize)}
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
