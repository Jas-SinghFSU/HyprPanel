#!/bin/bash

has_param() {
    local term="$1"
    shift
    for arg; do
        if [[ $arg == "$term" ]]; then
            return 0
        fi
    done
    return 1
}

wait_for_process_to_finish() {
    local process_name="$1"
    local pid

    while pid=$(pgrep -x "$process_name"); do
        wait "$pid" 2>/dev/null || true
    done

    sleep 2
}

check_arch_updates() {
    if command -v paru &> /dev/null; then
        aur_helper="paru"
    else
        aur_helper="yay"
    fi

    if has_param "-tooltip" "$@"; then
        command=" | head -n 50"
        official_updates=""
        aur_updates=""
        wait_for_process_to_finish "checkupdates"
    else
        command="2>/dev/null | wc -l"
        official_updates=0
        aur_updates=0
    fi

    aur_command="$aur_helper -Qum $command"
    official_command="checkupdates $command"

    if has_param "-y" "$@"; then
        aur_updates=$(eval "$aur_command")
    elif has_param "-p" "$@"; then
        official_updates=$(eval "$official_command")
    else
        aur_updates=$(eval "$aur_command")
        official_updates=$(eval "$official_command")
    fi

    if has_param "-tooltip" "$@"; then
        if [ "$official_updates" ];then
            echo "pacman:"
            echo "$official_updates"
        fi
        if [ "$official_updates" ] && [ "$aur_updates" ];then
            echo ""
        fi
        if [ "$aur_updates" ];then
            echo "AUR:"
            echo "$aur_updates"
        fi
    else
        total_updates=$((official_updates + aur_updates))
        echo $total_updates
    fi


}

check_ubuntu_updates() {
    result=$(apt-get -s -o Debug::NoLocking=true upgrade | grep -c ^Inst)
    echo "$result"
}

check_fedora_updates() {
    result=$(dnf check-update -q | grep -v '^Loaded plugins' | grep -v '^No match for' | wc -l)
    echo "$result"
}

case "$1" in
    -arch)
        check_arch_updates "$2" "$3"
        ;;
    -ubuntu)
        check_ubuntu_updates
        ;;
    -fedora)
        check_fedora_updates
        ;;
    *)
        echo "0"
        ;;
esac
