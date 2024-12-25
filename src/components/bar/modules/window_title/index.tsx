import { runAsyncCommand, throttledScrollHandler } from 'src/components/bar/utils/helpers';
import { BarBoxChild } from 'src/lib/types/bar';
import options from 'src/options';
import { hyprlandService } from 'src/lib/constants/services';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import { onMiddleClick, onPrimaryClick, onScroll, onSecondaryClick } from 'src/lib/shared/eventHandlers';
import { bind, Variable } from 'astal';
import { getTitle, getWindowMatch, truncateTitle } from './helpers/title';
import { Astal } from 'astal/gtk3';

const { leftClick, rightClick, middleClick, scrollDown, scrollUp } = options.bar.windowtitle;

const ClientTitle = (): BarBoxChild => {
    const { custom_title, class_name, label, icon, truncation, truncation_size } = options.bar.windowtitle;

    const componentClassName = Variable.derive(
        [bind(options.theme.bar.buttons.style), bind(label)],
        (style: string, showLabel: boolean) => {
            const styleMap: Record<string, string> = {
                default: 'style1',
                split: 'style2',
                wave: 'style3',
                wave2: 'style3',
            };
            return `windowtitle-container ${styleMap[style]} ${!showLabel ? 'no-label' : ''}`;
        },
    );

    const componentChildren = Variable.derive(
        [
            bind(hyprlandService, 'focusedClient'),
            bind(custom_title),
            bind(class_name),
            bind(label),
            bind(icon),
            bind(truncation),
            bind(truncation_size),
        ],
        (
            client: AstalHyprland.Client,
            useCustomTitle: boolean,
            useClassName: boolean,
            showLabel: boolean,
            showIcon: boolean,
            truncate: boolean,
            truncationSize: number,
        ) => {
            const children: JSX.Element[] = [];

            if (showIcon) {
                children.push(
                    <label
                        className={'bar-button-icon windowtitle txt-icon bar'}
                        label={getWindowMatch(client).icon}
                    />,
                );
            }

            if (showLabel) {
                children.push(
                    <label
                        className={`bar-button-label windowtitle ${showIcon ? '' : 'no-icon'}`}
                        label={truncateTitle(
                            getTitle(client, useCustomTitle, useClassName),
                            truncate ? truncationSize : -1,
                        )}
                    />,
                );
            }

            return children;
        },
    );

    const component = <box className={componentClassName()}>{componentChildren()}</box>;

    return {
        component,
        isVisible: true,
        boxClass: 'windowtitle',
        props: {
            setup: (self: Astal.Button): void => {
                let disconnectFunctions: (() => void)[] = [];

                Variable.derive(
                    [
                        bind(rightClick),
                        bind(middleClick),
                        bind(scrollUp),
                        bind(scrollDown),
                        bind(options.bar.scrollSpeed),
                    ],
                    () => {
                        disconnectFunctions.forEach((disconnect) => disconnect());
                        disconnectFunctions = [];

                        const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.get());

                        disconnectFunctions.push(
                            onPrimaryClick(self, (clicked, event) => {
                                runAsyncCommand(leftClick.get(), { clicked, event });
                            }),
                        );

                        disconnectFunctions.push(
                            onSecondaryClick(self, (clicked, event) => {
                                runAsyncCommand(rightClick.get(), { clicked, event });
                            }),
                        );

                        disconnectFunctions.push(
                            onMiddleClick(self, (clicked, event) => {
                                runAsyncCommand(middleClick.get(), { clicked, event });
                            }),
                        );

                        disconnectFunctions.push(onScroll(self, throttledHandler, scrollUp.get(), scrollDown.get()));
                    },
                );
            },
        },
    };
};

export { ClientTitle };
