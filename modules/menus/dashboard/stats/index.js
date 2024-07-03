const Stats = () => {
  return Widget.Box({
    class_name: "stats-container",
    children: [
      Widget.Box({
        class_name: "stat-cpu",
      }),
      Widget.Box({
        class_name: "stat-ram",
      }),
      Widget.Box({
        class_name: "stat-gpu",
      }),
      Widget.Box({
        class_name: "stat-storage",
      }),
    ],
  });
};

export { Stats };
