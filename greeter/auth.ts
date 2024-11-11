import GLib from 'gi://GLib?version=2.0';
import icons from 'lib/icons';
import Login from './services/Login';

// const userName = Variable(allUsersArray[0]);
const userName = Variable('jaskir');
const iconFile = `/var/lib/AccountsService/icons/${userName}`;

const loggingin = Variable(false);

const loginSession = new Login();
console.log(await loginSession.getAllSession());

const CMD = GLib.getenv('ASZTAL_DM_CMD') || 'Hyprland';

const ENV = GLib.getenv('ASZTAL_DM_ENV') || 'WLR_NO_HARDWARE_CURSORS=1 _JAVA_AWT_WM_NONREPARENTING=1';

async function login(pw: string): Promise<void> {
    loggingin.value = true;
    const greetd = await Service.import('greetd');
    return greetd.login(userName.value, pw, CMD, ENV.split(/\s+/)).catch((res) => {
        loggingin.value = false;
        response.label = res?.description || JSON.stringify(res);
        password.text = '';
        revealer.reveal_child = true;
    });
}

const avatar = Widget.Box({
    class_name: 'avatar',
    hpack: 'center',
    css: `background-image: url('${iconFile}')`,
});

const password = Widget.Entry({
    placeholder_text: 'Password',
    hexpand: true,
    visibility: false,
    on_accept: ({ text }) => {
        login(text || '');
    },
});

const response = Widget.Label({
    class_name: 'response',
    wrap: true,
    max_width_chars: 35,
    hpack: 'center',
    hexpand: true,
    xalign: 0.5,
});

const revealer = Widget.Revealer({
    transition: 'slide_down',
    child: response,
});

export default Widget.Box({
    class_name: 'auth',
    expand: true,
    attribute: { password },
    vertical: true,
    children: [
        Widget.Overlay({
            child: Widget.Box(
                {
                    css: 'min-width: 200px; min-height: 200px;',
                    vertical: true,
                },
                Widget.Box({
                    class_name: 'wallpaper',
                    expand: true,
                }),
                Widget.Box({
                    class_name: 'wallpaper-contrast',
                    vexpand: true,
                }),
            ),
            overlay: Widget.Box(
                {
                    vpack: 'end',
                    vertical: true,
                },
                avatar,
                Widget.Box({
                    hpack: 'center',
                    children: [
                        Widget.Icon(icons.ui.avatar),
                        Widget.Label({
                            label: userName.bind('value'),
                        }),
                    ],
                }),
                Widget.Box(
                    {
                        class_name: 'password',
                    },
                    Widget.Spinner({
                        visible: loggingin.bind(),
                        active: true,
                    }),
                    Widget.Icon({
                        visible: loggingin.bind().as((b) => !b),
                        icon: icons.ui.lock,
                    }),
                    password,
                ),
            ),
        }),
        Widget.Box({ class_name: 'response-box' }, revealer),
    ],
});
