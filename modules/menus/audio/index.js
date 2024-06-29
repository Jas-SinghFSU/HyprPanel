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

  const getIcon = (audioVol, isMuted) => {
    const speakerIcons = {
      101: "audio-volume-overamplified-symbolic",
      66: "audio-volume-high-symbolic",
      34: "audio-volume-medium-symbolic",
      1: "audio-volume-low-symbolic",
      0: "audio-volume-muted-symbolic",
    };

    const inputIcons = {
      66: "microphone-sensitivity-high-symbolic",
      34: "microphone-sensitivity-medium-symbolic",
      1: "microphone-sensitivity-low-symbolic",
      0: "microphone-disabled-symbolic",
    };

    const icon = isMuted
      ? 0
      : [101, 66, 34, 1, 0].find((threshold) => threshold <= audioVol * 100);

    return {
      spkr: speakerIcons[icon],
      mic: inputIcons[icon],
    };
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
      Widget.Box({
        class_name: "menu-slider-container playback",
        children: [
          Widget.Button({
            vexpand: false,
            vpack: "end",
            setup: (self) => {
              self.hook(audio, () => {
                const spkr = audio.speaker;
                const className = `menu-active-button playback ${spkr.is_muted ? "muted" : ""}`;
                return (self.class_name = className);
              });
            },
            on_primary_click: () =>
              (audio.speaker.is_muted = !audio.speaker.is_muted),
            child: Widget.Icon({
              class_name: "menu-active-icon playback",
              setup: (self) => {
                self.hook(audio, () => {
                  self.icon = getIcon(
                    audio.speaker.volume,
                    audio.speaker.is_muted,
                  )["spkr"];
                });
              },
            }),
          }),
          Widget.Box({
            vertical: true,
            children: [
              Widget.Label({
                class_name: "menu-active playback",
                hpack: "start",
                truncate: "end",
                expand: true,
                wrap: true,
                label: audio.bind("speaker").as((v) => v.description || ""),
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
            ],
          }),
          Widget.Label({
            vpack: "end",
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
      Widget.Box({
        class_name: "menu-slider-container input",
        children: [
          Widget.Button({
            vexpand: false,
            vpack: "end",
            setup: (self) => {
              self.hook(audio, () => {
                const mic = audio.microphone;
                const className = `menu-active-button input ${mic.is_muted ? "muted" : ""}`;
                return (self.class_name = className);
              });
            },
            on_primary_click: () =>
              (audio.microphone.is_muted = !audio.microphone.is_muted),
            child: Widget.Icon({
              class_name: "menu-active-icon input",
              setup: (self) => {
                self.hook(audio, () => {
                  self.icon = getIcon(
                    audio.microphone.volume,
                    audio.microphone.is_muted,
                  )["mic"];
                });
              },
            }),
          }),
          Widget.Box({
            vertical: true,
            children: [
              Widget.Label({
                class_name: "menu-active input",
                hpack: "start",
                truncate: "end",
                wrap: true,
                label: audio.bind("microphone").as((v) => v.description || ""),
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
            ],
          }),
          Widget.Label({
            class_name: "menu-active-percentage input",
            vpack: "end",
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
      hpack: "fill",
      hexpand: true,
      child: Widget.Box({
        vertical: true,
        hpack: "fill",
        hexpand: true,
        class_name: "menu-items-container",
        children: [
          Widget.Box({
            class_name: "menu-section-container volume",
            vertical: true,
            children: [
              Widget.Box({
                class_name: "menu-label-container volume",
                hpack: "fill",
                child: Widget.Label({
                  class_name: "menu-label audio volume",
                  hexpand: true,
                  hpack: "center",
                  label: "Volume",
                }),
              }),
              Widget.Box({
                class_name: "menu-items-section selected",
                vertical: true,
                children: [
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
                ],
              }),
            ],
          }),
          Widget.Box({
            class_name: "menu-section-container playback",
            vertical: true,
            children: [
              Widget.Box({
                class_name: "menu-label-container playback",
                hpack: "fill",
                child: Widget.Label({
                  class_name: "menu-label audio playback",
                  hexpand: true,
                  hpack: "center",
                  label: "Playback Devices",
                }),
              }),
              Widget.Box({
                class_name: "menu-items-section playback",
                vertical: true,
                children: [
                  Widget.Box({
                    class_name: "menu-container playback",
                    vertical: true,
                    children: [
                      Widget.Box({
                        vertical: true,
                        children: audio
                          .bind("speakers")
                          .as((v) => renderPlaybacks(v)),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          Widget.Box({
            class_name: "menu-section-container input",
            vertical: true,
            children: [
              Widget.Box({
                class_name: "menu-label-container playback",
                hpack: "fill",
                child: Widget.Label({
                  class_name: "menu-label audio playback",
                  hexpand: true,
                  hpack: "center",
                  label: "Input Devices",
                }),
              }),
              Widget.Box({
                class_name: "menu-items-section input",
                vertical: true,
                children: [
                  Widget.Box({
                    class_name: "menu-container input",
                    vertical: true,
                    children: [
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
            ],
          }),
        ],
      }),
    }),
  });
};
