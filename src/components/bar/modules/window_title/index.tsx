import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import { onMiddleClick, onPrimaryClick, onScroll, onSecondaryClick } from 'src/lib/shared/eventHandlers';
import { bind, Variable } from 'astal';
import { clientTitle, getTitle, getWindowMatch, truncateTitle } from './helpers/title';
import { Astal } from 'astal/gtk3';
import { BarBoxChild } from 'src/components/bar/types';
import options from 'src/configuration';
import { runAsyncCommand } from '../../utils/input/commandExecutor';
import { throttledScrollHandler } from '../../utils/input/throttle';

const hyprlandService = AstalHyprland.get_default();
const { leftClick, rightClick, middleClick, scrollDown, scrollUp } = options.bar.windowtitle;

const ClientTitle = (): BarBoxChild => {
    const { custom_title, class_name, label, icon, truncation, truncation_size } = options.bar.windowtitle;

    const ClientIcon = ({ client }: ClientIconProps): JSX.Element => {
        return (
            <label
                className={'bar-button-icon windowtitle txt-icon bar'}
                label={getWindowMatch(client).icon}
            />
        );
    };

    const ClientLabel = ({
        client,
        useCustomTitle,
        useClassName,
        showIcon,
        truncate,
        truncationSize,
    }: ClientLabelProps): JSX.Element => {
        return (
            <label
                className={`bar-button-label windowtitle ${showIcon ? '' : 'no-icon'}`}
                label={truncateTitle(
                    getTitle(client, useCustomTitle, useClassName),
                    truncate ? truncationSize : -1,
                )}
            />
        );
    };

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
            bind(clientTitle),
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
                children.push(<ClientIcon client={client} />);
            }

            if (showLabel) {
                children.push(
                    <ClientLabel
                        client={client}
                        useCustomTitle={useCustomTitle}
                        useClassName={useClassName}
                        truncate={truncate}
                        truncationSize={truncationSize}
                        showIcon={showIcon}
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

                        disconnectFunctions.push(
                            onScroll(self, throttledHandler, scrollUp.get(), scrollDown.get()),
                        );
                    },
                );
            },
        },
    };
};

interface ClientIconProps {
    client: AstalHyprland.Client;
}

interface ClientLabelProps {
    client: AstalHyprland.Client;
    useCustomTitle: boolean;
    useClassName: boolean;
    showIcon: boolean;
    truncate: boolean;
    truncationSize: number;
}

export { ClientTitle };
