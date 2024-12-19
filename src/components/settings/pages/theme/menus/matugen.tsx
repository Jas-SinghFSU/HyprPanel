import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';

import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const Matugen = (): JSX.Element => {
    return (
        <scrollable
            name={'Matugen Settings'}
            className="menu-theme-page paged-container"
            vscroll={Gtk.PolicyType.AUTOMATIC}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            vexpand={true}
        >
            <box vertical>
                {/* Matugen Settings Section */}
                <Header title="Matugen Settings" />
                <Option
                    opt={options.theme.matugen}
                    title="Enable Matugen"
                    type="boolean"
                    dependencies={['matugen', 'swww']}
                />
                <Option
                    opt={options.theme.matugen_settings.mode}
                    title="Matugen Theme"
                    type="enum"
                    enums={['light', 'dark']}
                />
                <Option
                    opt={options.theme.matugen_settings.scheme_type}
                    title="Matugen Scheme"
                    type="enum"
                    enums={[
                        'content',
                        'expressive',
                        'fidelity',
                        'fruit-salad',
                        'monochrome',
                        'neutral',
                        'rainbow',
                        'tonal-spot',
                    ]}
                />
                <Option
                    opt={options.theme.matugen_settings.variation}
                    title="Matugen Variation"
                    type="enum"
                    enums={[
                        'standard_1',
                        'standard_2',
                        'standard_3',
                        'monochrome_1',
                        'monochrome_2',
                        'monochrome_3',
                        'vivid_1',
                        'vivid_2',
                        'vivid_3',
                    ]}
                />
                <Option
                    opt={options.theme.matugen_settings.contrast}
                    title="Contrast"
                    subtitle="Range: -1 to 1 (Default: 0)"
                    type="float"
                />
            </box>
        </scrollable>
    );
};
