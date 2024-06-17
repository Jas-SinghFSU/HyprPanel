const audio = await Service.import("audio");
import DropdownMenu from "../DropdownMenu.js";

export default () => {
  const renderPlaybacks = (playbackDevices) => {
    return playbackDevices.map((device) => {
      if (device.description === "Dummy Output") {
        return Widget.Box({
          class_name: "menu-unfound-button playback",
          child: Widget.Box({
            children: [
              Widget.Label({
                class_name: "menu-button-name playback",
                label: "No playback devices found...",
              }),
            ],
          }),
        });
      }
      return Widget.Button({
        class_name: `menu-button audio playback ${device}`,
        cursor: "pointer",
        on_primary_click: () => (audio.speaker = device),
        child: Widget.Box({
          children: [
            Widget.Box({
              hpack: "start",
              children: [
                Widget.Label({
                  truncate: "end",
                  wrap: true,
                  class_name: audio.speaker
                    .bind("description")
                    .as((v) =>
                      device.description === v
                        ? "menu-button-icon active playback"
                        : "menu-button-icon playback",
                    ),
                  label: "",
                }),
                Widget.Label({
                  class_name: audio.speaker
                    .bind("description")
                    .as((v) =>
                      device.description === v
                        ? "menu-button-name active playback"
                        : "menu-button-name playback",
                    ),
                  truncate: "end",
                  wrap: true,
                  label: device.description,
                }),
              ],
            }),
            Widget.Box({
              hpack: "end",
              expand: true,
              children: [
                Widget.Label({
                  class_name: "menu-button-isactive audio playback",
                  label: audio.speaker
                    .bind("description")
                    .as((v) => (device.description === v ? " " : "")),
                }),
              ],
            }),
          ],
        }),
      });
    });
  };

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
        cursor: "pointer",
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
            Widget.Box({
              hpack: "end",
              expand: true,
              children: [
                Widget.Label({
                  class_name: "menu-button-isactive audio input",
                  truncate: "end",
                  wrap: true,
                  label: audio.microphone
                    .bind("description")
                    .as((v) => (device.description === v ? " " : "")),
                }),
              ],
            }),
          ],
        }),
      });
    });
  };

  const renderActivePlayback = () => {
    return [
      Widget.Label({
        class_name: "menu-active playback",
        truncate: "end",
        expand: true,
        wrap: true,
        label: audio.bind("speaker").as((v) => v.description || ""),
      }),
      Widget.Box({
        class_name: "menu-slider-container playback",
        children: [
          Widget.Label({
            class_name: "menu-active-icon playback",
            label: audio.speaker
              .bind("volume")
              .as((v) => `${v === 0 ? "󰖁" : "󰕾"}`),
          }),
          Widget.Slider({
            value: audio["speaker"].bind("volume"),
            class_name: "menu-active-slider menu-slider playback",
            draw_value: false,
            hexpand: true,
            min: 0,
            max: 1,
            onChange: ({ value }) => (audio.speaker.volume = value),
          }),
          Widget.Label({
            class_name: "menu-active-percentage playback",
            label: audio.speaker
              .bind("volume")
              .as((v) => `${Math.floor(v * 100)}%`),
          }),
        ],
      }),
    ];
  };

  const renderActiveInput = () => {
    return [
      Widget.Label({
        class_name: "menu-active input",
        truncate: "end",
        wrap: true,
        label: audio.bind("microphone").as((v) => v.description || ""),
      }),
      Widget.Box({
        class_name: "menu-slider-container input",
        children: [
          Widget.Label({
            class_name: "menu-active-icon input",
            label: audio.microphone
              .bind("volume")
              .as((v) => `${v === 0 ? "󰍭" : "󰍬"}`),
          }),
          Widget.Slider({
            value: audio.microphone.bind("volume").as((v) => v),
            class_name: "menu-active-slider menu-slider inputs",
            draw_value: false,
            hexpand: true,
            min: 0,
            max: 1,
            onChange: ({ value }) => (audio.microphone.volume = value),
          }),
          Widget.Label({
            class_name: "menu-active-percentage input",
            label: audio.microphone
              .bind("volume")
              .as((v) => `${Math.floor(v * 100)}%`),
          }),
        ],
      }),
    ];
  };

  return DropdownMenu({
    name: "audiomenu",
    transition: "crossfade",
    child: Widget.Box({
      class_name: "menu-items",
      child: Widget.Box({
        vertical: true,
        class_name: "menu-items-container",
        children: [
          Widget.Box({
            class_name: "menu-dropdown-label-container",
            hpack: "start",
            children: [
              Widget.Label({
                class_name: "menu-dropdown-label audio",
                label: "Audio",
              }),
            ],
          }),
          Widget.Separator({
            class_name: "menu-separator",
          }),
          Widget.Box({
            class_name: "menu-active-container playback",
            vertical: true,
            children: renderActivePlayback(),
          }),
          Widget.Box({
            class_name: "menu-active-container input",
            vertical: true,
            children: renderActiveInput(),
          }),
          Widget.Separator({
            class_name: "menu-separator",
          }),
          Widget.Box({
            class_name: "menu-container playback",
            vertical: true,
            children: [
              Widget.Box({
                class_name: "menu-label-container",
                child: Widget.Label({
                  class_name: "menu-label audio playback",
                  label: "Playback Devices",
                  hpack: "start",
                }),
              }),
              Widget.Box({
                vertical: true,
                children: audio.bind("speakers").as((v) => renderPlaybacks(v)),
              }),
            ],
          }),
          Widget.Separator({
            class_name: "menu-separator",
          }),
          Widget.Box({
            class_name: "menu-container input",
            vertical: true,
            children: [
              Widget.Box({
                class_name: "menu-label-container",
                child: Widget.Label({
                  class_name: "menu-label audio input",
                  hpack: "start",
                  label: "Input Devices",
                }),
              }),
              Widget.Box({
                vertical: true,
                children: audio
                  .bind("microphones")
                  .as((v) => renderInputDevices(v)),
              }),
            ],
          }),
        ],
      }),
    }),
  });
};
