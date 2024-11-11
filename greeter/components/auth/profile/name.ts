import { Attribute } from 'lib/types/widget';
import Label from 'types/widgets/label';

export const profileName = (): Label<Attribute> => {
    return Widget.Label({
        className: 'profileName',
        label: 'Jaskir',
    });
};
