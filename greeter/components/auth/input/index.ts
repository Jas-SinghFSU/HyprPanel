import loginSession from 'greeter/services/loginSession';
import { Attribute } from 'lib/types/widget';
import Entry from 'types/widgets/entry';

export const passwordInput = (): Entry<Attribute> => {
    return Widget.Entry({
        className: 'login-password',
        expand: false,
        hpack: 'center',
        vpack: 'center',
        placeholderText: 'password',
        visibility: false,
        on_change: (self) => {
            loginSession.password.value = self.text || '';
        },
        on_accept: () => {
            loginSession.login();
        },
        setup: (self) => {
            self.grab_focus();
        },
    });
};
