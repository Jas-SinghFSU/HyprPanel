import { Attribute } from 'lib/types/widget';
import Entry from 'types/widgets/entry';

export const passwordInput = (): Entry<Attribute> => {
    return Widget.Entry({
        className: 'login-password',
        on_change: (self) => {
            // isUnsaved.value = self.text !== opt.value
        },
        on_accept: (self) => {
            // opt.value = self.text as T;
        },
        setup: (self) => {
            self.grab_focus();
        },
    });
};
