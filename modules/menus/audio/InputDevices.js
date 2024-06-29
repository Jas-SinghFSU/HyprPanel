const audio = await Service.import("audio");

const renderInputDevices = (inputDevices) => {
  if (!inputDevices.length) {
    return [
      Widget.Box({
        class_name: `menu-unfound-button input`,
        child: Widget.Box({
          children: [
            Widget.Label({
              class_name: "menu-button-name input",
              label: "No input devices found...",
            }),
          ],
        }),
      }),
    ];
  }
  return inputDevices.map((device) => {
    return Widget.Button({
      on_primary_click: () => (audio.microphone = device),
      class_name: `menu-button audio input ${device}`,
      child: Widget.Box({
        children: [
          Widget.Box({
            hpack: "start",
            children: [
              Widget.Label({
                class_name: audio.microphone
                  .bind("description")
                  .as((v) =>
                    device.description === v
                      ? "menu-button-icon active input"
                      : "menu-button-icon input",
                  ),
                label: "",
              }),
              Widget.Label({
                truncate: "end",
                wrap: true,
                class_name: audio.microphone
                  .bind("description")
                  .as((v) =>
                    device.description === v
                      ? "menu-button-name active input"
                      : "menu-button-name input",
                  ),
                label: device.description,
              }),
            ],
          }),
        ],
      }),
    });
  });
};

export { renderInputDevices };
