import {
    ApplicationIcons,
    WorkspaceIcons,
    WorkspaceIconsColored,
} from 'src/components/bar/modules/workspaces/types';
import { opt } from 'src/lib/options';
import { ActiveWsIndicator } from 'src/lib/options/types';

export default {
    show_icons: opt(false),
    showAllActive: opt(true),
    ignored: opt(''),
    show_numbered: opt(false),
    showWsIcons: opt(false),
    showApplicationIcons: opt(false),
    applicationIconOncePerWorkspace: opt(true),
    applicationIconMap: opt<ApplicationIcons>({}),
    applicationIconFallback: opt('󰣆'),
    applicationIconEmptyWorkspace: opt(''),
    numbered_active_indicator: opt<ActiveWsIndicator>('underline'),
    icons: {
        available: opt(''),
        active: opt(''),
        occupied: opt(''),
    },
    workspaceIconMap: opt<WorkspaceIcons | WorkspaceIconsColored>({}),
    workspaces: opt(5),
    spacing: opt(1),
    monitorSpecific: opt(true),
    workspaceMask: opt(false),
    reverse_scroll: opt(false),
    scroll_speed: opt(5),
};
