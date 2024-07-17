import Service from "resource:///com/github/Aylur/ags/service.js";
import App from "resource:///com/github/Aylur/ags/app.js";
import { monitorFile } from "resource:///com/github/Aylur/ags/utils.js";
import Gio from "gi://Gio";

class DirectoryMonitorService extends Service {
  static {
    Service.register(this, {}, {});
  }

  constructor() {
    super();
    this.recursiveDirectoryMonitor(`${App.configDir}/scss`);
  }

  recursiveDirectoryMonitor(directoryPath) {
    monitorFile(directoryPath, (_, eventType) => {
      if (eventType === Gio.FileMonitorEvent.CHANGES_DONE_HINT) {
        this.emit("changed");
      }
    });

    const directory = Gio.File.new_for_path(directoryPath);
    const enumerator = directory.enumerate_children(
      "standard::*",
      Gio.FileQueryInfoFlags.NONE,
      null,
    );

    let fileInfo;
    while ((fileInfo = enumerator.next_file(null)) !== null) {
      const childPath = directoryPath + "/" + fileInfo.get_name();
      if (fileInfo.get_file_type() === Gio.FileType.DIRECTORY) {
        this.recursiveDirectoryMonitor(childPath);
      }
    }
  }
}

const service = new DirectoryMonitorService();
export default service;
