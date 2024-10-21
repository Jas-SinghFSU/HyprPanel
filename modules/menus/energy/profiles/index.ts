const powerProfiles = await Service.import('powerprofiles');
import { PowerProfile, PowerProfileObject, PowerProfiles } from 'lib/types/powerprofiles.js';
import { BoxWidget } from 'lib/types/widget.js';
import icons from '../../../icons/index.js';
import { uptime } from "lib/variables.js";

const EnergyProfiles = (): BoxWidget => {
    const isValidProfile = (profile: string): profile is PowerProfile =>
        profile === 'power-saver' || profile === 'balanced' || profile === 'performance';

    function up(up: number) {
        const h = Math.floor(up / 60)
        const m = Math.floor(up % 60)
        return ` : ${h < 10? "0" + h : h}:${m < 10 ? "0" + m : m}`
    }

    return Widget.Box({
        class_name: 'menu-section-container energy',
        vertical: true,
        children: [
            Widget.Box({
                class_name: 'menu-label-container',
                hpack: 'fill',
                children: [Widget.Label({
                    class_name: 'menu-label',
                    hexpand: true,
                    hpack: 'start',
                    label: 'Power Profile',
                }),
                Widget.Label({
                    class_name: "menu-label",
                    css: "font-size: 0.9em",
                    label: uptime.bind().as(up),
                })
                ],
            }),
            Widget.Box({
                class_name: 'menu-items-section',
                vpack: 'fill',
                vexpand: true,
                vertical: true,
                children: powerProfiles.bind('profiles').as((profiles: PowerProfiles) => {
                    return profiles.map((prof: PowerProfileObject) => {
                        const profileLabels = {
                            'power-saver': 'Power Saver',
                            balanced: 'Balanced',
                            performance: 'Performance',
                        };

                        const profileType = prof.Profile;

                        if (!isValidProfile(profileType)) {
                            return profileLabels.balanced;
                        }

                        return Widget.Button({
                            on_primary_click: () => {
                                powerProfiles.active_profile = prof.Profile;
                            },
                            class_name: powerProfiles.bind('active_profile').as((active) => {
                                return `power-profile-item ${active === prof.Profile ? 'active' : ''}`;
                            }),
                            child: Widget.Box({
                                children: [
                                    Widget.Icon({
                                        class_name: 'power-profile-icon',
                                        icon: icons.powerprofile[profileType],
                                    }),
                                    Widget.Label({
                                        class_name: 'power-profile-label',
                                        label: profileLabels[profileType],
                                    }),
                                ],
                            }),
                        });
                    });
                }),
            }),
        ],
    });
};

export { EnergyProfiles };
