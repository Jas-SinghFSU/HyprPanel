export const Power = () => {
  return {
    component: Widget.Box({
      child: Widget.Button({
        child: Widget.Label({
          class_name: "bar-power_label",
          label: "⏻",
        }),
      }),
    }),
    isVisible: true,
  };
};
