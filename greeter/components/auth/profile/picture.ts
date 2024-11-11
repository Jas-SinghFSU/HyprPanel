import { Attribute, Child } from 'lib/types/widget';
import loginSession from 'greeter/services/loginSession';
import Box from 'types/widgets/box';

export const profilePicture = (): Box<Child, Attribute> => {
    return Widget.Box({
        className: 'profilePicture',
        css: `background-image: url("${loginSession.getCurrentProfilePicture()}")`,
    });
};
