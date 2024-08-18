export const Label = (name: string, sub = "", subtitleLink = '') => {
    const subTitle = () => {
        if (subtitleLink.length) {
            return Widget.Button({
                hpack: "start",
                vpack: "center",
                class_name: "options-sublabel-link",
                label: sub,
                // run a bash command to open the link in the default browswer
                on_primary_click: () => Utils.execAsync(`bash -c 'xdg-open ${subtitleLink}'`),
            })
        }
        return Widget.Label({
            hpack: "start",
            vpack: "center",
            class_name: "options-sublabel",
            label: sub
        })
    }
    return Widget.Box({
        vertical: true,
        hpack: "start",
        children: [
            Widget.Label({
                hpack: "start",
                vpack: "center",
                class_name: "options-label",
                label: name
            }),
            subTitle()
        ]
    })
}
