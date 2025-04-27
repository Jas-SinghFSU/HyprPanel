#!/bin/bash

# Provided by: https://github.com/JJDizz1L

install_arch_updates() {
    echo "Updating Arch Linux system..."
    sudo pacman -Syu
    echo "Updating AUR packages..."
    if command -v paru &> /dev/null; then
    paru -Syu
    elif command -v yay &> /dev/null; then
    yay -Syu
    # Если ни один хелпер не найден
    else
    echo "Missing AUR Helper. Try installing yay or paru"
    fi
    echo "Updating Flatpak packages..."
    flatpak update -y
    echo "Done with Arch & AUR updates."   
    echo "Press any key to exit..."
    read -n 1
}

install_ubuntu_updates() {
    echo "Updating Ubuntu system..."
    sudo apt update && sudo apt upgrade -y
    echo "Updating Flatpak packages..."
    flatpak update -y
    echo "Done with Ubuntu updates."
    echo "Press any key to exit..."
    read -n 1
}

install_fedora_updates() {
    echo "Updating Fedora system..."
    sudo dnf update -y
    echo "Updating Flatpak packages..."
    flatpak update -y
    echo "Done with Fedora updates."
    echo "Press any key to exit..."
    read -n 1
}

install_flatpak_updates() {
    echo "Updating Flatpak packages..."
    flatpak update -y
    echo "Done with FlatPak updates."
    echo "Press any key to exit..."
    read -n 1
}

case "$1" in
-arch)
    install_arch_updates
    ;;
-ubuntu)
    install_ubuntu_updates
    ;;
-fedora)
    install_fedora_updates
    ;;
-flatpak)
    install_flatpak_updates
    ;;
*)
    echo "Usage: $0 {-arch|-ubuntu|-fedora|-flatpak}"
    ;;
esac

exit 1
