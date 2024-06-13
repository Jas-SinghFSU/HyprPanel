const audio = await Service.import("audio");
import DropdownMenu from "../DropdownMenu.js";

export default () => {
  const playbackDevices = Variable(audio.speakers);
  const inputDevices = Variable(audio.microphones);

  audio.connect("changed", (aVal) => {
    playbackDevices.value = aVal.speakers;
    inputDevices.value = aVal.microphones;
  });

  const renderPlaybacks = (playbackDevices) => {
    return playbackDevices.map((device) => {
      if (device.description === "Dummy Output") {
        return Widget.Box({
          class_name: `audiomenu-playback-button not-found`,
          child: Widget.Box({
            children: [
              Widget.Label({
                class_name: "audiomenu-playback-button-icon",
                label: "No playback devices found...",
              }),
            ],
          }),
        });
      }
      return Widget.Button({
        class_name: `audiomenu-button playback ${device}`,
        child: Widget.Box({
          children: [
            Widget.Label({
              class_name: "audiomenu-button-icon playback",
              label: "o",
            }),
            Widget.Label({
              class_name: "audiomenu-button-name playback",
              truncate: "end",
              expand: true,
              wrap: true,
              label: device.description,
            }),
            Widget.Label({
              class_name: "audiomenu-button-isactive playback",
              label: audio.speaker
                .bind("description")
                .as((v) => (device.description === v ? " y" : "")),
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
          class_name: `audiomenu-inputs-button not-found`,
          child: Widget.Box({
            children: [
              Widget.Label({
                class_name: "audiomenu-inputs-button-icon",
                label: "No input devices found...",
              }),
            ],
          }),
        }),
      ];
    }
    return inputDevices.map((device) => {
      return Widget.Button({
        class_name: `audiomenu-button input ${device}`,
        child: Widget.Box({
          children: [
            Widget.Label({
              class_name: "audiomenu-button-icon input",
              label: "/",
            }),
            Widget.Label({
              class_name: "audiomenu-button-name input",
              label: device.description,
            }),
            Widget.Label({
              class_name: "audiomenu-button-isactive input",
              truncate: "end",
              expand: true,
              wrap: true,
              label: audio.microphone
                .bind("description")
                .as((v) => (device.description === v ? " y" : "")),
            }),
          ],
        }),
      });
    });
  };

  const renderActivePlayback = () => {
    return [
      Widget.Label({
        class_name: "audiomenu-active playback",
        truncate: "end",
        expand: true,
        wrap: true,
        label: audio.bind("speaker").as((v) => v.description || ""),
      }),
      Widget.Box({
        class_name: "audiomenu-slider-container playback",
        children: [
          Widget.Label({
            class_name: "audiomenu-active-icon playback",
            label: audio.speaker
              .bind("volume")
              .as((v) => `${v === 0 ? "m" : "a"}`),
          }),
          Widget.Slider({
            value: audio.speaker.bind("volume").as((v) => v * 100),
            class_name: "audiomenu-active-slider playback",
            draw_value: false,
            hexpand: true,
            min: 0,
            max: 100,
            onChange: ({ value }) => (audio.speaker.volume = value / 100),
          }),
          Widget.Label({
            class_name: "audiomenu-active-percentage playback",
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
        class_name: "audiomenu-active input",
        truncate: "end",
        wrap: true,
        label: audio.bind("microphone").as((v) => v.description || ""),
      }),
      Widget.Box({
        class_name: "audiomenu-slider-container input",
        children: [
          Widget.Label({
            class_name: "audiomenu-active-icon input",
            label: audio.microphone
              .bind("volume")
              .as((v) => `${v === 0 ? "m" : "a"}`),
          }),
          Widget.Slider({
            value: audio.microphone.bind("volume").as((v) => v * 100),
            class_name: "audiomenu-active-slider inputs",
            draw_value: false,
            hexpand: true,
            min: 0,
            max: 100,
            onChange: ({ value }) => (audio.microphone.volume = value / 100),
          }),
          Widget.Label({
            class_name: "audiomenu-active-percentage input",
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
      class_name: "audiomenu-items",
      child: Widget.Box({
        vertical: true,
        class_name: "audiomenu-items-container",
        children: [
          Widget.Box({
            class_name: "audiomenu-dropdown-label-container",
            hpack: "start",
            children: [
              Widget.Label({
                class_name: "audiomenu-dropdown-label",
                label: "Audio Devices",
              }),
            ],
          }),
          Widget.Separator({
            class_name: "audiomenu-separator",
          }),
          Widget.Box({
            class_name: "audiomenu-active-container playback",
            vertical: true,
            children: renderActivePlayback(),
          }),
          Widget.Box({
            class_name: "audiomenu-active-container input",
            vertical: true,
            children: renderActiveInput(),
          }),
          Widget.Box({
            class_name: "audiomenu-label-container playback",
            vertical: true,
            hpack: "start",
            children: [
              Widget.Label({
                class_name: "audiomenu-label playback",
                label: "Playback Devices",
                hpack: "start",
              }),
              Widget.Box({
                vertical: true,
                children: audio
                  .bind("speakers")
                  .as((v) => renderPlaybacks(v)),
              }),
            ],
          }),
          Widget.Box({
            class_name: "audiomenu-label-container input",
            hpack: "start",
            vertical: true,
            children: [
              Widget.Label({
                class_name: "audiomenu-label input",
                hpack: "start",
                label: "Input Devices",
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
