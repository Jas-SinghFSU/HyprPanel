#!/bin/bash

check_arch_updates() {
    result=$(yay -Qum --noconfirm 2>/dev/null | wc -l || echo 0)
    echo "$result"
}

case "$1" in
-arch)
    check_arch_updates
    ;;
*)
    echo "0"
    ;;
esac
