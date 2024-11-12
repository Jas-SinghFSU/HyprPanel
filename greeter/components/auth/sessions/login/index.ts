import loginSession from 'greeter/services/loginSession';
import { GtkWidget } from 'lib/types/widget';

export const loginButton = (): GtkWidget => {
    return Widget.Button({
        className: 'loginButton',
        expand: false,
        label: '',
        onPrimaryClick: () => {
            loginSession.login();
        },
    });
};
