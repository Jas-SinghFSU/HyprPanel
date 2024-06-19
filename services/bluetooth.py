#!/usr/bin/env python3

import dbus
import dbus.service
import dbus.mainloop.glib
from gi.repository import GLib
import subprocess
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

AGENT_PATH = "/test/agent"
CAPABILITY = "NoInputNoOutput"

def send_notification_with_actions(title, message, actions, action_handler):
    bus = dbus.SessionBus()
    notification_object = bus.get_object("org.freedesktop.Notifications", "/org/freedesktop/Notifications")
    notify_interface = dbus.Interface(notification_object, "org.freedesktop.Notifications")
    bus.add_signal_receiver(action_handler,
                            dbus_interface="org.freedesktop.Notifications",
                            signal_name="ActionInvoked")
    notify_interface.Notify("bluetooth_agent", 0, "", title, message, actions, {}, -1)

class Agent(dbus.service.Object):
    def __init__(self, bus):
        dbus.service.Object.__init__(self, bus, AGENT_PATH)

    @dbus.service.method("org.bluez.Agent1", in_signature="", out_signature="")
    def Release(self):
        logging.info("Release")

    def get_device_name(self, device):
        bus = dbus.SystemBus()
        device_proxy = bus.get_object("org.bluez", device)
        device_properties = dbus.Interface(device_proxy, "org.freedesktop.DBus.Properties")
        return device_properties.Get("org.bluez.Device1", "Name")

    @dbus.service.method("org.bluez.Agent1", in_signature="o", out_signature="")
    def RequestPinCode(self, device):
        device_name = self.get_device_name(device)
        logging.info(f"RequestPinCode {device_name} ({device})")
        self.request_input("Enter PIN code", f"Enter PIN code for device {device_name}", device, "pin")

    @dbus.service.method("org.bluez.Agent1", in_signature="o", out_signature="u")
    def RequestPasskey(self, device):
        device_name = self.get_device_name(device)
        logging.info(f"RequestPasskey {device_name} ({device})")
        self.request_input("Enter Passkey", f"Enter passkey for device {device_name}", device, "passkey")

    @dbus.service.method("org.bluez.Agent1", in_signature="ou", out_signature="")
    def DisplayPasskey(self, device, passkey):
        device_name = self.get_device_name(device)
        logging.info(f"DisplayPasskey {device_name} passkey {passkey}")
        send_notification_with_actions("Bluetooth Pairing Request", f"Passkey for device {device_name} is {passkey}", [], lambda *args: None)

    @dbus.service.method("org.bluez.Agent1", in_signature="ou", out_signature="")
    def RequestConfirmation(self, device, passkey):
        device_name = self.get_device_name(device)
        logging.info(f"RequestConfirmation {device_name} passkey {passkey}")
        actions = ["confirm", "Confirm", "deny", "Deny"]
        
        def action_handler(notification_id, action_key):
            if action_key == "confirm":
                logging.info(f"Confirmed pairing for {device_name}")
                self.send_reply(device)
            elif action_key == "deny":
                logging.info(f"Denied pairing for {device_name}")
                self.send_error(device, "org.bluez.Error.Rejected")
        
        send_notification_with_actions("Bluetooth Pairing Request",
                                       f"Confirm passkey {passkey} for device {device_name}",
                                       actions, action_handler)
        return

    @dbus.service.method("org.bluez.Agent1", in_signature="o", out_signature="")
    def RequestAuthorization(self, device):
        device_name = self.get_device_name(device)
        logging.info(f"RequestAuthorization {device_name}")
        actions = ["confirm", "Confirm", "deny", "Deny"]
        
        def action_handler(notification_id, action_key):
            if action_key == "confirm":
                logging.info(f"Authorized device {device_name}")
                self.send_reply(device)
            elif action_key == "deny":
                logging.info(f"Denied authorization for {device_name}")
                self.send_error(device, "org.bluez.Error.Rejected")
        
        send_notification_with_actions("Bluetooth Service Authorization",
                                       f"Authorize device {device_name}",
                                       actions, action_handler)
        return

    @dbus.service.method("org.bluez.Agent1", in_signature="os", out_signature="")
    def AuthorizeService(self, device, uuid):
        device_name = self.get_device_name(device)
        logging.info(f"AuthorizeService {device_name} uuid {uuid}")
        actions = ["confirm", "Confirm", "deny", "Deny"]
        
        def action_handler(notification_id, action_key):
            if action_key == "confirm":
                logging.info(f"Authorized service {uuid} for device {device_name}")
                self.send_reply(device)
            elif action_key == "deny":
                logging.info(f"Denied authorization for service {uuid} on device {device_name}")
                self.send_error(device, "org.bluez.Error.Rejected")

        send_notification_with_actions("Bluetooth Service Authorization",
                                       f"Authorize service {uuid} for device {device_name}",
                                       actions, action_handler)
        return

    @dbus.service.method("org.bluez.Agent1", in_signature="", out_signature="")
    def Cancel(self):
        logging.info("Cancel")

    def request_input(self, title, message, device, input_type):
        def action_handler(notification_id, action_key):
            if action_key == "input":
                result = subprocess.run(["zenity", "--entry", "--title", title, "--text", message], capture_output=True, text=True)
                user_input = result.stdout.strip()
                if input_type == "pin":
                    self.handle_pin_input(device, user_input)
                elif input_type == "passkey":
                    self.handle_passkey_input(device, user_input)
            elif action_key == "cancel":
                self.send_error(device, "org.bluez.Error.Rejected")

        actions = ["input", "Enter", "cancel", "Cancel"]
        send_notification_with_actions(title, message, actions, action_handler)

    def handle_pin_input(self, device, pin_code):
        logging.info(f"PIN code entered for {device}: {pin_code}")
        self.send_reply(device)

    def handle_passkey_input(self, device, passkey):
        logging.info(f"Passkey entered for {device}: {passkey}")
        self.send_reply(device)

    def send_reply(self, device):
        logging.info(f"Sending reply for {device}")
        bus = dbus.SystemBus()
        agent = bus.get_object("org.bluez", device)
        agent_interface = dbus.Interface(agent, "org.bluez.Device1")
        agent_interface.Pair(reply_handler=self.success_callback, error_handler=self.error_callback)

    def send_error(self, device, error):
        logging.info(f"Sending error for {device}")
        bus = dbus.SystemBus()
        agent = bus.get_object("org.bluez", device)
        agent_interface = dbus.Interface(agent, "org.bluez.Device1")
        agent_interface.CancelPairing(reply_handler=self.success_callback, error_handler=self.error_callback)

    def success_callback(self):
        logging.info("Operation succeeded")

    def error_callback(self, error):
        logging.error(f"Operation failed: {error}")

def register_agent():
    bus = dbus.SystemBus()
    manager = dbus.Interface(bus.get_object("org.bluez", "/org/bluez"), "org.bluez.AgentManager1")
    path = AGENT_PATH
    agent = Agent(bus)
    manager.RegisterAgent(path, CAPABILITY)
    manager.RequestDefaultAgent(path)
    logging.info("Agent registered")

if __name__ == "__main__":
    dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)
    register_agent()
    loop = GLib.MainLoop()
    loop.run()
