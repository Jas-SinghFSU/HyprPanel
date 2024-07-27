export const Label = (name: string, sub = "") => {
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
            Widget.Label({
                hpack: "start",
                vpack: "center",
                class_name: "options-sublabel",
                label: sub
            }),
        ]
    })
}
