import { App, Gdk } from 'astal/gtk3';
import { SettingsDialogLoader } from 'src/components/settings/lazyLoader';

export const SettingsButton = (): JSX.Element => {
    return (
        <button
            className={'dashboard-button'}
            tooltipText={'HyprPanel Configuration'}
            vexpand
            onButtonPressEvent={async (_, event) => {
                const buttonClicked = event.get_button()[1];

                if (buttonClicked !== Gdk.BUTTON_PRIMARY) {
                    return;
                }

                App.get_window('dashboardmenu')?.set_visible(false);
                const loader = SettingsDialogLoader.getInstance();
                await loader.toggle();
            }}
        >
            <label className={'button-label txt-icon'} label={'󰒓'} />
        </button>
    );
};
