import { bind, Variable } from 'astal';
import { Gtk } from 'astal/gtk3';
import { StackTransitionMap } from 'src/lib/constants/options';
import options from 'src/options';
import { isPrimaryClick } from 'src/lib/utils';
import { ThemesMenu } from './pages/theme';
import { SettingsPage, settingsPages } from './helpers';

const { transition, transitionTime } = options.menus;

const CurrentPage = Variable<SettingsPage>('Theming');
const LastPage = Variable<SettingsPage>('Theming');

export const PageContainer = (): JSX.Element => {
    return (
        <box vertical>
            <box halign={Gtk.Align.FILL} hexpand>
                <box className="option-pages-container" halign={Gtk.Align.CENTER} hexpand>
                    {settingsPages.map((page) => {
                        return (
                            <button
                                className={bind(CurrentPage).as(
                                    (v) => `pager-button ${v === page ? 'active' : ''} category`,
                                )}
                                label={page}
                                onClick={(_, event) => {
                                    if (isPrimaryClick(event)) {
                                        LastPage.set(CurrentPage.get());
                                        CurrentPage.set(page as SettingsPage);
                                    }
                                }}
                                halign={Gtk.Align.CENTER}
                            />
                        );
                    })}
                </box>
            </box>
            <stack
                className="themes-menu-stack"
                transitionType={bind(transition).as((transitionType) => StackTransitionMap[transitionType])}
                transitionDuration={bind(transitionTime)}
                shown={bind(CurrentPage)}
                vexpand={false}
            >
                {/* <SettingsMenu /> */}
                <ThemesMenu />
            </stack>
        </box>
    );
};
