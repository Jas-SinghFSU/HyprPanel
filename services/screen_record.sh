#!/usr/bin/env bash

outputDir="$HOME/Videos/Screencasts"

checkRecording() {
    if pgrep -f "gpu-screen-recorder" >/dev/null; then
        return 0
    else
        return 1
    fi
}

startRecording() {
    if checkRecording; then
        echo "A recording is already in progress."
        exit 1
    fi

    target="$2"

    outputFile="recording_$(date +%Y-%m-%d_%H-%M-%S).mp4"
    outputPath="$outputDir/$outputFile"
    mkdir -p "$outputDir"

    if [ -z "$target" ]; then
        echo "Usage: $0 start screen [screen_name]"
        exit 1
    fi
    
    GPU_TYPE=$(lspci | grep -E 'VGA|3D' | grep -Ev '00:02.0|Integrated' > /dev/null && echo "" || echo "-encoder cpu")

    gpu-screen-recorder -w "$target" -f 60 -a "$(pactl get-default-sink).monitor" -o "$outputPath" $GPU_TYPE &

    echo "Recording started. Output will be saved to $outputPath"
}

stopRecording() {
    if ! checkRecording; then
        echo "No recording is in progress."
        exit 1
    fi

    pkill -f gpu-screen-recorder
    recentFile=$(ls -t "$outputDir"/recording_*.mp4 | head -n 1)
    notify-send "Recording stopped" "Your recording has been saved." \
        -i video-x-generic \
        -a "Screen Recorder" \
        -t 10000 \
        -u normal \
        --action="scriptAction:-xdg-open $outputDir=Directory" \
        --action="scriptAction:-xdg-open $recentFile=Play"
}

case "$1" in
start)
    startRecording "$@"
    ;;
stop)
    stopRecording
    ;;
status)
    if checkRecording; then
        echo "recording"
    else
        echo "not recording"
    fi
    ;;
*)
    echo "Usage: $0 {start [screen_name|window_id]|stop|status}"
    exit 1
    ;;
esac
