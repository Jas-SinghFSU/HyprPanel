const powerOptions = {
  sleep: "systemctl suspend",
  reboot: "systemctl reboot",
  logout: "pkill Hyprland",
  shutdown: "shutdown now",
};

class PowerMenu extends Service {
  static {
    Service.register(
      this,
      {},
      {
        title: ["string"],
        cmd: ["string"],
      },
    );
  }

  #title = "";
  #cmd = "";

  get title() {
    return this.#title;
  }

  action(action) {
    [this.#cmd, this.#title] = {
      sleep: [powerOptions.sleep, "Sleep"],
      reboot: [powerOptions.reboot, "Reboot"],
      logout: [powerOptions.logout, "Log Out"],
      shutdown: [powerOptions.shutdown, "Shutdown"],
    }[action];

    this.notify("cmd");
    this.notify("title");
    this.emit("changed");
    App.closeWindow("powermenu");
    App.openWindow("verification");
  }

  shutdown = () => {
    this.action("shutdown");
  };

  exec = () => {
    App.closeWindow("verification");
    Utils.exec(this.#cmd);
  };
}

const powermenu = new PowerMenu();
Object.assign(globalThis, { powermenu });
export default powermenu;
