const powerProfiles = await Service.import('powerprofiles');
import { PowerProfile, PowerProfileObject, PowerProfiles } from 'lib/types/powerprofiles.js';
import icons from '../../../icons/index.js';
import { BoxWidget } from 'lib/types/widget.js';

const EnergyProfiles = (): BoxWidget => {
    const isValidProfile = (profile: string): profile is PowerProfile =>
        profile === 'power-saver' || profile === 'balanced' || profile === 'performance';

    return Widget.Box({
        class_name: 'menu-section-container energy',
        vertical: true,
        children: [
            Widget.Box({
                class_name: 'menu-label-container',
                hpack: 'fill',
                child: Widget.Label({
                    class_name: 'menu-label',
                    hexpand: true,
                    hpack: 'start',
                    label: 'Power Profile',
                }),
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
