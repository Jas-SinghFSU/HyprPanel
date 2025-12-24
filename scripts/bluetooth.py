#!/usr/bin/env python3
"""
bluetooth.py: A BlueZ Agent for hyprpanel that
gracefully no-ops if python3-dbus, python3-gi, or BlueZ aren’t present.
"""

import os
import sys
import time
import shutil
import subprocess
import logging
from typing import Optional, Callable

# -------------------------------------------------------------------
# Logger setup
# -------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# -------------------------------------------------------------------
# Feature-flag: keep process alive on missing Bluetooth?
#   Set HYPERPANEL_BT_KEEP_ALIVE=1|true to enable.
# -------------------------------------------------------------------
KEEP_ALIVE_ON_MISSING_BT = os.environ.get(
    "HYPERPANEL_BT_KEEP_ALIVE", "0"
).lower() in ("1", "true", "yes")

# -------------------------------------------------------------------
# Attempt imports
# -------------------------------------------------------------------
_have_dbus = False
_have_glib = False
try:
    import dbus
    import dbus.service
    import dbus.mainloop.glib
    _have_dbus = True
except ImportError:
    logger.warning(
        "python3-dbus not found; Bluetooth support will be disabled."
    )

try:
    from gi.repository import GLib
    _have_glib = True
except ImportError:
    logger.warning(
        "python3-gi (GObject Introspection) not found; "
        "Bluetooth support will be disabled."
    )

HAS_BT_DEPENDENCIES = _have_dbus and _have_glib

# -------------------------------------------------------------------
# Helpers
# -------------------------------------------------------------------
def idle_or_exit() -> None:
    """
    If KEEP_ALIVE is set, block forever (via GLib.MainLoop if available,
    otherwise via a long sleep).  Otherwise exit(0).
    """
    if KEEP_ALIVE_ON_MISSING_BT:
        if _have_glib:
            logger.info(
                "Entering idle GLib.MainLoop (Bluetooth disabled)."
                "  Unset HYPERPANEL_BT_KEEP_ALIVE to stop."
            )
            GLib.MainLoop().run()
        else:
            logger.info(
                "Sleeping indefinitely (Bluetooth disabled, "
                "GLib unavailable)."
            )
            while True:
                time.sleep(3600)
    else:
        sys.exit(0)


def is_bluez_running() -> bool:
    """
    Return True if org.bluez is registered on the system bus.
    """
    if not _have_dbus:
        return False
    try:
        bus = dbus.SystemBus()
        bus.get_name_owner("org.bluez")
        return True
    except dbus.exceptions.DBusException:
        return False


def send_notification_with_actions(
    title: str,
    message: str,
    actions: list,
    action_handler
) -> Callable[[], None]:
    """
    Send a Desktop Notification via org.freedesktop.Notifications,
    wiring 'ActionInvoked' to action_handler.  Returns a disconnect()
    function that removes the signal receiver.
    On any failure, logs a warning and returns a no-op disconnect.
    """
    if not _have_dbus:
        logger.debug("DBus unavailable: skipping notification.")
        return lambda: None

    try:
        bus = dbus.SessionBus()
        obj = bus.get_object(
            "org.freedesktop.Notifications",
            "/org/freedesktop/Notifications"
        )
        notify_iface = dbus.Interface(
            obj,
            "org.freedesktop.Notifications"
        )

        last_id = notify_iface.Notify(
            "hyprpanel-bluetooth",  # app name
            0,                      # replaces_id
            "",                     # icon
            title,
            message,
            actions,
            {},                     # hints
            -1                      # expire_timeout
        )

        def _on_action(nid, key):
            if nid == last_id:
                action_handler(nid, key)

        bus.add_signal_receiver(
            _on_action,
            dbus_interface="org.freedesktop.Notifications",
            signal_name="ActionInvoked"
        )

        def disconnect():
            try:
                bus.remove_signal_receiver(
                    _on_action,
                    dbus_interface="org.freedesktop.Notifications",
                    signal_name="ActionInvoked"
                )
            except Exception:
                pass

        return disconnect

    except Exception as e:
        logger.warning(f"Could not send notification: {e}")
        return lambda: None


def request_input_sync(title: str, message: str) -> Optional[str]:
    """
    Synchronously prompt the user for text:
      - If 'zenity' is on PATH, use a GUI entry dialog.
      - Otherwise, if stdin is a TTY, fall back to console input().
      - Else return None immediately.
    """
    if shutil.which("zenity"):
        try:
            res = subprocess.run(
                ["zenity", "--entry", "--title", title, "--text", message],
                capture_output=True,
                text=True,
                check=True
            )
            return res.stdout.strip() or None
        except subprocess.CalledProcessError:
            logger.info("Zenity entry cancelled by user.")
            return None
        except Exception:
            logger.exception("Unexpected error launching Zenity.")
            return None
    else:
        logger.warning(
            "'zenity' not found; falling back to console prompt if possible."
        )
        if sys.stdin.isatty():
            try:
                line = input(f"{title}\n{message}\n> ")
                return line.strip() or None
            except (KeyboardInterrupt, EOFError):
                logger.info("Console input cancelled by user.")
                return None
        else:
            logger.warning(
                "No GUI dialog and no TTY available; cannot prompt."
            )
            return None

# -------------------------------------------------------------------
# Null Agent (for when dependencies are missing)
# -------------------------------------------------------------------
class NullAgent:
    """A no-op agent; run() will simply idle_or_exit()."""
    def run(self):
        logger.info("Bluetooth agent disabled (stub).")
        idle_or_exit()

# -------------------------------------------------------------------
# BlueZ Agent Implementation
# -------------------------------------------------------------------
if HAS_BT_DEPENDENCIES:
    class Agent(dbus.service.Object):
        AGENT_PATH = "/org/hyprpanel/bluez_agent"
        CAPABILITY = "KeyboardDisplay" # Changed to allow passkey/pin entry

        def __init__(self, bus):
            super().__init__(bus, self.AGENT_PATH)
            self._bus = bus
            self._active_notifies = []

        @dbus.service.method("org.bluez.Agent1", in_signature="", out_signature="")
        def Release(self):
            logger.info("BlueZ Agent released by BlueZ daemon.")

        def _get_device_name(self, device_path: str) -> str:
            try:
                proxy = self._bus.get_object("org.bluez", device_path)
                props = dbus.Interface(
                    proxy,
                    "org.freedesktop.DBus.Properties"
                )
                name = props.Get("org.bluez.Device1", "Name")
                return str(name) if name else "Unknown"
            except Exception:
                logger.debug(
                    f"Failed to fetch device name for {device_path}",
                    exc_info=True
                )
                return "Unknown"

        @dbus.service.method("org.bluez.Agent1", in_signature="o", out_signature="s")
        def RequestPinCode(self, device):
            name = self._get_device_name(device)
            logger.info(f"RequestPinCode for {name}")
            pin = request_input_sync(
                "Bluetooth PIN Code",
                f"Enter PIN code for {name}"
            )
            if not pin:
                logger.info("No PIN provided; rejecting.")
                raise dbus.exceptions.DBusException(
                    "PIN code entry cancelled or empty.",
                    name="org.bluez.Error.Rejected"
                )
            return pin

        @dbus.service.method("org.bluez.Agent1", in_signature="o", out_signature="u")
        def RequestPasskey(self, device):
            name = self._get_device_name(device)
            logger.info(f"RequestPasskey for {name}")
            s = request_input_sync(
                "Bluetooth Passkey",
                f"Enter numeric passkey (000000–999999) for {name}"
            )
            if not s:
                logger.info("No passkey provided; rejecting.")
                raise dbus.exceptions.DBusException(
                    "Passkey entry cancelled or empty.",
                    name="org.bluez.Error.Rejected"
                )
            try:
                pk = int(s)
                if not (0 <= pk <= 999999):
                    raise ValueError
                return dbus.UInt32(pk)
            except ValueError:
                logger.info(f"Invalid passkey '{s}'; rejecting.")
                raise dbus.exceptions.DBusException(
                    "Invalid passkey entered.",
                    name="org.bluez.Error.Rejected"
                )

        @dbus.service.method("org.bluez.Agent1", in_signature="ou", out_signature="")
        def DisplayPasskey(self, device, passkey):
            name = self._get_device_name(device)
            logger.info(f"DisplayPasskey for {name}: {passkey:06d}")
            disc = send_notification_with_actions(
                "Bluetooth Pairing Request",
                f"Passkey for {name}: {passkey:06d}",
                [],              # no interactive actions
                lambda *args: None
            )
            self._active_notifies.append(disc)

        @dbus.service.method("org.bluez.Agent1", in_signature="ou", out_signature="")
        def RequestConfirmation(self, device, passkey):
            name = self._get_device_name(device)
            logger.info(f"RequestConfirmation for {name}: {passkey:06d}")
            confirmed = []
            def handler(nid, action_key):
                confirmed.append(action_key == "confirm")
                loop.quit()

            actions = ["confirm", "Confirm", "deny", "Deny"]
            disc = send_notification_with_actions(
                "Bluetooth Pairing Request",
                f"Confirm passkey {passkey:06d} for {name}",
                actions,
                handler
            )
            self._active_notifies.append(disc)

            loop = GLib.MainLoop()
            loop.run()

            disc()
            self._active_notifies.remove(disc)

            if not confirmed or not confirmed[0]:
                raise dbus.exceptions.DBusException(
                    "User denied confirmation.",
                    name="org.bluez.Error.Rejected"
                )

        @dbus.service.method("org.bluez.Agent1", in_signature="o", out_signature="")
        def RequestAuthorization(self, device):
            name = self._get_device_name(device)
            logger.info(f"RequestAuthorization for {name}")
            authorized = []
            def handler(nid, action_key):
                authorized.append(action_key == "confirm")
                loop.quit()

            actions = ["confirm", "Confirm", "deny", "Deny"]
            disc = send_notification_with_actions(
                "Bluetooth Authorization",
                f"Authorize device {name}?",
                actions,
                handler
            )
            self._active_notifies.append(disc)

            loop = GLib.MainLoop()
            loop.run()

            disc()
            self._active_notifies.remove(disc)

            if not authorized or not authorized[0]:
                raise dbus.exceptions.DBusException(
                    "User denied authorization.",
                    name="org.bluez.Error.Rejected"
                )

        @dbus.service.method("org.bluez.Agent1", in_signature="os", out_signature="")
        def AuthorizeService(self, device, uuid):
            name = self._get_device_name(device)
            logger.info(f"AuthorizeService for {name} (uuid={uuid})")
            authorized = []
            def handler(nid, action_key):
                authorized.append(action_key == "confirm")
                loop.quit()

            actions = ["confirm", "Confirm", "deny", "Deny"]
            disc = send_notification_with_actions(
                "Service Authorization",
                f"Authorize service {uuid} for {name}?",
                actions,
                handler
            )
            self._active_notifies.append(disc)

            loop = GLib.MainLoop()
            loop.run()

            disc()
            self._active_notifies.remove(disc)

            if not authorized or not authorized[0]:
                raise dbus.exceptions.DBusException(
                    "User denied service authorization.",
                    name="org.bluez.Error.Rejected"
                )

        @dbus.service.method("org.bluez.Agent1", in_signature="", out_signature="")
        def Cancel(self):
            logger.info("Request canceled by BlueZ.")

    def register_agent(bus) -> Optional[Agent]:
        """
        Attempt to register our Agent on org.bluez.  Returns the Agent
        if successful, or None on any DBusException.
        """
        try:
            mgr = dbus.Interface(
                bus.get_object("org.bluez", "/org/bluez"),
                "org.bluez.AgentManager1"
            )
            agent = Agent(bus)
            mgr.RegisterAgent(Agent.AGENT_PATH, Agent.CAPABILITY)
            mgr.RequestDefaultAgent(Agent.AGENT_PATH)
            logger.info("Bluetooth agent registered successfully.")
            return agent
        except dbus.exceptions.DBusException as e:
            if e.get_dbus_name() == "org.freedesktop.DBus.Error.ServiceUnknown":
                logger.warning(
                    "BlueZ daemon not found on system bus; skipping agent."
                )
            else:
                logger.error(
                    f"Failed to register Bluetooth agent: {e}",
                    exc_info=True
                )
            return None

# -------------------------------------------------------------------
# Main entry
# -------------------------------------------------------------------
def main():
    # 1) Missing Python deps?
    if not HAS_BT_DEPENDENCIES:
        logger.warning("Missing DBus/GLib Python bindings; Bluetooth disabled.")
        NullAgent().run()
        return

    # 2) BlueZ daemon up?
    if not is_bluez_running():
        logger.warning("BlueZ daemon not detected; Bluetooth disabled.")
        idle_or_exit()
        return

    # 3) Hook GLib into dbus-python and get the system bus
    dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)
    bus = dbus.SystemBus()

    # 4) Try registering our agent
    agent = register_agent(bus)
    if agent is None:
        idle_or_exit()
        return

    # 5) All good: spin the GLib loop
    logger.info("Entering Bluetooth agent main loop.")
    try:
        GLib.MainLoop().run()
    except KeyboardInterrupt:
        logger.info("Bluetooth agent stopped by user.")


if __name__ == "__main__":
    main()
