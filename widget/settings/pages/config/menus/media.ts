import { Option } from 'widget/settings/shared/Option';
import { Header } from 'widget/settings/shared/Header';

import options from 'options';
import Scrollable from 'types/widgets/scrollable';
import { Attribute, Child } from 'lib/types/widget';

export const MediaMenuSettings = (): Scrollable<Child, Attribute> => {
    return Widget.Scrollable({
        vscroll: 'automatic',
        child: Widget.Box({
            class_name: 'bar-theme-page paged-container',
            vertical: true,
            children: [
                Header('Media'),
                Option({ opt: options.menus.media.hideAuthor, title: 'Hide Author', type: 'boolean' }),
                Option({ opt: options.menus.media.hideAlbum, title: 'Hide Album', type: 'boolean' }),
            ],
        }),
    });
};
