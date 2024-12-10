import options from 'src/options';
import { bind, Variable } from 'astal';
import { Gtk } from 'astal/gtk3';
import { isPrimaryClick } from 'src/lib/utils';
import { StackTransitionMap } from 'src/lib/constants/options';
import { ConfigPage, configPages } from '../../helpers';

const { transition, transitionTime } = options.menus;

const CurrentPage = Variable<ConfigPage>('General');

export const SettingsMenu = (): JSX.Element => {
    return (
        <box className="option-pages-container" halign={Gtk.Align.CENTER} hexpand vertical>
            {[0, 1, 2].map((section) => {
                return (
                    <box>
                        {configPages.map((page, index) => {
                            if (index >= section * 6 && index < section * 6 + 6) {
                                return (
                                    <button
                                        className={bind(CurrentPage).as(
                                            (pg) => `pager-button ${pg === page ? 'active' : ''}`,
                                        )}
                                        label={page}
                                        onClick={(_, event) => {
                                            if (isPrimaryClick(event)) {
                                                CurrentPage.set(page as ConfigPage);
                                            }
                                        }}
                                        xalign={0}
                                        halign={Gtk.Align.CENTER}
                                    />
                                );
                            }

                            return <box />;
                        })}
                    </box>
                );
            })}
            <stack
                className="themes-menu-stack"
                transitionType={bind(transition).as((transitionType) => StackTransitionMap[transitionType])}
                transitionDuration={bind(transitionTime)}
                shown={bind(CurrentPage)}
                vexpand
            >
                {configPages}
            </stack>
        </box>
    );
};
