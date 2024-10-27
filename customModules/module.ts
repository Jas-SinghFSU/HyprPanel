import { BarBoxChild, Module } from 'lib/types/bar';
import { BarButtonStyles } from 'lib/types/options';
import { GtkWidget } from 'lib/types/widget';
import options from 'options';
import Gtk from 'types/@girs/gtk-3.0/gtk-3.0';

const { style } = options.theme.bar.buttons;

const undefinedVar = Variable(undefined);

export const module = ({
    icon,
    textIcon,
    useTextIcon = Variable(false).bind('value'),
    label,
    tooltipText,
    boxClass,
    props = {},
    showLabelBinding = undefinedVar.bind('value'),
    showLabel,
    labelHook,
    hook,
}: Module): BarBoxChild => {
    const getIconWidget = (useTxtIcn: boolean): GtkWidget | undefined => {
        let iconWidget: Gtk.Widget | undefined;

        if (icon !== undefined && !useTxtIcn) {
            iconWidget = Widget.Icon({
                class_name: `txt-icon bar-button-icon module-icon ${boxClass}`,
                icon: icon,
            });
        } else if (textIcon !== undefined) {
            iconWidget = Widget.Label({
                class_name: `txt-icon bar-button-icon module-icon ${boxClass}`,
                label: textIcon,
            });
        }

        return iconWidget;
    };

    return {
        component: Widget.Box({
            className: Utils.merge(
                [style.bind('value'), showLabelBinding],
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
            ),
            tooltip_text: tooltipText,
            children: Utils.merge(
                [showLabelBinding, useTextIcon],
                (showLabel: boolean, forceTextIcon: boolean): Gtk.Widget[] => {
                    const childrenArray: Gtk.Widget[] = [];
                    const iconWidget = getIconWidget(forceTextIcon);

                    if (iconWidget !== undefined) {
                        childrenArray.push(iconWidget);
                    }

                    if (showLabel) {
                        childrenArray.push(
                            Widget.Label({
                                class_name: `bar-button-label module-label ${boxClass}`,
                                label: label,
                                setup: labelHook,
                            }),
                        );
                    }
                    return childrenArray;
                },
            ),
            setup: hook,
        }),
        tooltip_text: tooltipText,
        isVisible: true,
        boxClass,
        props,
    };
};
