export const Power = () => {
  return {
    component: Widget.Box({
      child: Widget.Button({
        class_name: "bar-powermenu",
        child: Widget.Icon({
          class_name: "bar-power_label",
          icon: "system-shutdown-symbolic",
        }),
      }),
    }),
    isVisible: true,
    props: {
      on_clicked: () => App.toggleWindow("powermenu"),
    },
  };
};
