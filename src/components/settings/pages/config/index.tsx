import options from 'src/options';
import { bind, Variable } from 'astal';
import { Gtk } from 'astal/gtk3';
import { isPrimaryClick } from 'src/lib/utils';
import { StackTransitionMap } from 'src/lib/constants/options';
import { ConfigPage, configPages } from '../../helpers';
import { BarGeneral } from './general';
import { BarSettings } from './bar';
import { MediaMenuSettings } from './menus/media';
import { NotificationSettings } from './notifications';
import { OSDSettings } from './osd';
import { VolumeMenuSettings } from './menus/volume';
import { ClockMenuSettings } from './menus/clock';
import { DashboardMenuSettings } from './menus/dashboard';
import { CustomModuleSettings } from 'src/components/bar/settings/config';
import { PowerMenuSettings } from './menus/power';

const { transition, transitionTime } = options.menus;

const CurrentPage = Variable<ConfigPage>('General');

export const SettingsMenu = (): JSX.Element => {
    return (
        <box name={'Configuration'} halign={Gtk.Align.FILL} hexpand vertical>
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
                                            halign={Gtk.Align.CENTER}
                                        />
                                    );
                                }

                                return <box />;
                            })}
                        </box>
                    );
                })}
            </box>
            <stack
                className="themes-menu-stack"
                transitionType={bind(transition).as((transitionType) => StackTransitionMap[transitionType])}
                transitionDuration={bind(transitionTime)}
                shown={bind(CurrentPage)}
                vexpand
            >
                <BarGeneral />
                <BarSettings />
                <MediaMenuSettings />
                <NotificationSettings />
                <OSDSettings />
                <VolumeMenuSettings />
                <ClockMenuSettings />
                <DashboardMenuSettings />
                <CustomModuleSettings />
                <PowerMenuSettings />
            </stack>
        </box>
    );
};
