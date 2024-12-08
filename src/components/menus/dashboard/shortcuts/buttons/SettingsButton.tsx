import { App, Gdk } from 'astal/gtk3';

export const SettingsButton = (): JSX.Element => {
    return (
        <button
            className={'dashboard-button'}
            tooltipText={'HyprPanel Configuration'}
            vexpand
            onButtonPressEvent={(_, event) => {
                const buttonClicked = event.get_button()[1];

                if (buttonClicked !== Gdk.BUTTON_PRIMARY) {
                    return;
                }

                App.get_window('dashboardmenu')?.set_visible(false);
                App.toggle_window('settings-dialog');
            }}
        >
            <label className={'button-label txt-icon'} label={'󰒓'} />
        </button>
    );
};
