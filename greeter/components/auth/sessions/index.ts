import { Attribute, Child } from 'lib/types/widget';
import { sessionButton } from './session/index';
import Box from 'types/widgets/box';
import { loginButton } from './login/index';

export const sessionSelector = (): Box<Child, Attribute> => {
    return Widget.Box({
        className: 'sessionContainer',
        children: [sessionButton(), loginButton()],
    });
};
