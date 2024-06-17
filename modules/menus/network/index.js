const network = await Service.import("network");
import DropdownMenu from "../DropdownMenu.js";

export default () => {
  network.connect("changed", (value) => {
    console.log(JSON.stringify(value, null, 2));
  })
  const renderPlaybacks = (playbackDevices) => {
    // return playbackDevices.map((device) => {
    //   if (device.description === "Dummy Output") {
    //     return Widget.Box({
    //       class_name: "networkmenu-unfound-button playback",
    //       child: Widget.Box({
    //         children: [
    //           Widget.Label({
    //             class_name: "networkmenu-button-name playback",
    //             label: "No playback devices found...",
    //           }),
    //         ],
    //       }),
    //     });
    //   }
    //   return Widget.Button({
    //     class_name: `networkmenu-button playback ${device}`,
    //     cursor: "pointer",
    //     on_primary_click: () => (audio.speaker = device),
    //     child: Widget.Box({
    //       children: [
    //         Widget.Box({
    //           hpack: "start",
    //           children: [
    //             Widget.Label({
    //               truncate: "end",
    //               wrap: true,
    //               class_name: audio.speaker
    //                 .bind("description")
    //                 .as((v) =>
    //                   device.description === v
    //                     ? "networkmenu-button-icon active playback"
    //                     : "networkmenu-button-icon playback",
    //                 ),
    //               label: "",
    //             }),
    //             Widget.Label({
    //               class_name: audio.speaker
    //                 .bind("description")
    //                 .as((v) =>
    //                   device.description === v
    //                     ? "networkmenu-button-name active playback"
    //                     : "networkmenu-button-name playback",
    //                 ),
    //               truncate: "end",
    //               wrap: true,
    //               label: device.description,
    //             }),
    //           ],
    //         }),
    //         Widget.Box({
    //           hpack: "end",
    //           expand: true,
    //           children: [
    //             Widget.Label({
    //               class_name: "networkmenu-button-isactive playback",
    //               label: audio.speaker
    //                 .bind("description")
    //                 .as((v) => (device.description === v ? " " : "")),
    //             }),
    //           ],
    //         }),
    //       ],
    //     }),
    //   });
    // });
  };

  const renderInputDevices = (inputDevices) => {
    // if (!inputDevices.length) {
    //   return [
    //     Widget.Box({
    //       class_name: `networkmenu-unfound-button input`,
    //       child: Widget.Box({
    //         children: [
    //           Widget.Label({
    //             class_name: "networkmenu-button-name input",
    //             label: "No input devices found...",
    //           }),
    //         ],
    //       }),
    //     }),
    //   ];
    // }
    // return inputDevices.map((device) => {
    //   return Widget.Button({
    //     cursor: "pointer",
    //     on_primary_click: () => (audio.microphone = device),
    //     class_name: `networkmenu-button input ${device}`,
    //     child: Widget.Box({
    //       children: [
    //         Widget.Box({
    //           hpack: "start",
    //           children: [
    //             Widget.Label({
    //               class_name: audio.microphone
    //                 .bind("description")
    //                 .as((v) =>
    //                   device.description === v
    //                     ? "networkmenu-button-icon active input"
    //                     : "networkmenu-button-icon input",
    //                 ),
    //               label: "",
    //             }),
    //             Widget.Label({
    //               truncate: "end",
    //               wrap: true,
    //               class_name: audio.microphone
    //                 .bind("description")
    //                 .as((v) =>
    //                   device.description === v
    //                     ? "networkmenu-button-name active input"
    //                     : "networkmenu-button-name input",
    //                 ),
    //               label: device.description,
    //             }),
    //           ],
    //         }),
    //         Widget.Box({
    //           hpack: "end",
    //           expand: true,
    //           children: [
    //             Widget.Label({
    //               class_name: "networkmenu-button-isactive input",
    //               truncate: "end",
    //               wrap: true,
    //               label: audio.microphone
    //                 .bind("description")
    //                 .as((v) => (device.description === v ? " " : "")),
    //             }),
    //           ],
    //         }),
    //       ],
    //     }),
    //   });
    // });
  };

  const renderActivePlayback = () => {
    // return [
    //   Widget.Label({
    //     class_name: "networkmenu-active playback",
    //     truncate: "end",
    //     expand: true,
    //     wrap: true,
    //     label: audio.bind("speaker").as((v) => v.description || ""),
    //   }),
    //   Widget.Box({
    //     class_name: "networkmenu-slider-container playback",
    //     children: [
    //       Widget.Label({
    //         class_name: "networkmenu-active-icon playback",
    //         label: audio.speaker
    //           .bind("volume")
    //           .as((v) => `${v === 0 ? "󰖁" : "󰕾"}`),
    //       }),
    //       Widget.Slider({
    //         value: audio["speaker"].bind("volume"),
    //         class_name: "networkmenu-active-slider menu-slider playback",
    //         draw_value: false,
    //         hexpand: true,
    //         min: 0,
    //         max: 1,
    //         onChange: ({ value }) => (audio.speaker.volume = value),
    //       }),
    //       Widget.Label({
    //         class_name: "networkmenu-active-percentage playback",
    //         label: audio.speaker
    //           .bind("volume")
    //           .as((v) => `${Math.floor(v * 100)}%`),
    //       }),
    //     ],
    //   }),
    // ];
  };

  const renderActiveInput = () => {
    // return [
    //   Widget.Label({
    //     class_name: "networkmenu-active input",
    //     truncate: "end",
    //     wrap: true,
    //     label: audio.bind("microphone").as((v) => v.description || ""),
    //   }),
    //   Widget.Box({
    //     class_name: "networkmenu-slider-container input",
    //     children: [
    //       Widget.Label({
    //         class_name: "networkmenu-active-icon input",
    //         label: audio.microphone
    //           .bind("volume")
    //           .as((v) => `${v === 0 ? "󰍭" : "󰍬"}`),
    //       }),
    //       Widget.Slider({
    //         value: audio.microphone.bind("volume").as((v) => v),
    //         class_name: "networkmenu-active-slider menu-slider inputs",
    //         draw_value: false,
    //         hexpand: true,
    //         min: 0,
    //         max: 1,
    //         onChange: ({ value }) => (audio.microphone.volume = value),
    //       }),
    //       Widget.Label({
    //         class_name: "networkmenu-active-percentage input",
    //         label: audio.microphone
    //           .bind("volume")
    //           .as((v) => `${Math.floor(v * 100)}%`),
    //       }),
    //     ],
    //   }),
    // ];
  };

  return DropdownMenu({
    name: "networkmenu",
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
                label: "Network",
              }),
            ],
          }),
          Widget.Separator({
            class_name: "menu-separator",
          }),
          Widget.Box({
            class_name: "networkmenu-active-container playback",
            vertical: true,
            // children: renderActivePlayback(),
          }),
          Widget.Box({
            class_name: "networkmenu-active-container input",
            vertical: true,
            // children: renderActiveInput(),
          }),
          Widget.Separator({
            class_name: "menu-separator",
          }),
          Widget.Box({
            class_name: "networkmenu-label-container playback",
            vertical: true,
            children: [
              Widget.Label({
                class_name: "networkmenu-label playback",
                label: "Playback Devices",
                hpack: "start",
              }),
              // Widget.Box({
              //   vertical: true,
              //   children: audio.bind("speakers").as((v) => renderPlaybacks(v)),
              // }),
            ],
          }),
          Widget.Separator({
            class_name: "menu-separator",
          }),
          Widget.Box({
            class_name: "networkmenu-label-container input",
            vertical: true,
            children: [
              Widget.Label({
                class_name: "networkmenu-label input",
                hpack: "start",
                label: "Input Devices",
              }),
              // Widget.Box({
              //   vertical: true,
              //   children: audio
              //     .bind("microphones")
              //     .as((v) => renderInputDevices(v)),
              // }),
            ],
          }),
        ],
      }),
    }),
  });
};
