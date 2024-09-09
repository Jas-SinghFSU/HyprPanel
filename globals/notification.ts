import icons from "modules/icons/index";

export const getNotificationIcon = (app_name: string, app_icon: string, app_entry: string) => {
    let icon: string = icons.fallback.notification;

    if (Utils.lookUpIcon(app_name) || Utils.lookUpIcon(app_name.toLowerCase() || "")) {
        icon = Utils.lookUpIcon(app_name)
            ? app_name
            : Utils.lookUpIcon(app_name.toLowerCase())
                ? app_name.toLowerCase()
                : "";
    }

    if (Utils.lookUpIcon(app_icon) && icon === "") {
        icon = app_icon;
    }

    if (Utils.lookUpIcon(app_entry || "") && icon === "") {
        icon = app_entry || "";
    }

    return icon;
};

