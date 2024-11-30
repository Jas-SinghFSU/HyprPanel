import { bind, Variable } from 'astal';
import { Gtk } from 'astal/gtk3';
import { BarBoxChild, Module } from 'src/lib/types/bar';
import { BarButtonStyles } from 'src/lib/types/options';
import { GtkWidget } from 'src/lib/types/widget';
import options from 'src/options';

const { style } = options.theme.bar.buttons;

const undefinedVar = Variable(undefined);

export const module = ({
    icon,
    textIcon,
    useTextIcon = bind(Variable(false)),
    label,
    tooltipText,
    boxClass,
    props = {},
    showLabelBinding = bind(undefinedVar),
    showLabel,
    labelHook,
    hook,
}: Module): BarBoxChild => {
    const getIconWidget = (useTxtIcn: boolean): GtkWidget | undefined => {
        let iconWidget: Gtk.Widget | undefined;

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
        (showLabel: boolean, forceTextIcon: boolean): GtkWidget => {
            const childrenArray: GtkWidget[] = [];
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

    const component = (
        <box tooltipText={tooltipText} className={componentClass()} setup={hook}>
            {componentChildren()}
        </box>
    );

    return {
        component,
        tooltip_text: tooltipText,
        isVisible: true,
        boxClass,
        props,
    };
};
