#!/bin/bash

outputDir="$HOME/Videos"

checkRecording() {
    if pgrep -x "gpu-screen-recorder" > /dev/null; then
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

    if [ -z "$2" ]; then
        echo "Usage: $0 start {screen|window} [screen_name|window_id]"
        exit 1
    fi

    mode="$2"
    target="$3"

    outputFile="recording_$(date +%Y-%m-%d_%H-%M-%S).mp4"
    outputPath="$outputDir/$outputFile"
    mkdir -p "$outputDir"

    case "$mode" in
        screen)
            if [ -z "$target" ]; then
                echo "Usage: $0 start screen [screen_name]"
                exit 1
            fi
            gpu-screen-recorder -w "$target" -f 60 -a "$(pactl get-default-sink).monitor" -o "$outputPath" &
            ;;
        window)
            if [ -z "$target" ]; then
                echo "Usage: $0 start window [window_id]"
                exit 1
            fi
            gpu-screen-recorder -w "$target" -f 60 -a "$(pactl get-default-sink).monitor" -o "$outputPath" &
            ;;
        *)
            echo "Invalid mode. Use 'screen' or 'window'."
            exit 1
            ;;
    esac

    echo "Recording started. Output will be saved to $outputPath"
}

stopRecording() {
    if ! checkRecording; then
        echo "No recording is in progress."
        exit 1
    fi

    pkill -SIGINT gpu-screen-recorder
    recentFile=$(ls -t "$outputDir"/recording_*.mp4 | head -n 1)
    notify-send "Recording stopped" "Your recording has been saved." \
        -i video-x-generic \
        -a "Screen Recorder" \
        -t 10000 \
        -u normal \
        --action="open_directory=xdg-open $outputDir" \
        --action="play_recording=xdg-open $recentFile"
    echo "Recording stopped. Output saved to $recentFile"
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
            echo "A recording is in progress."
        else
            echo "No recording is in progress."
        fi
        ;;
    *)
        echo "Usage: $0 {start {screen|window} [screen_name|window_id]|stop|status}"
        exit 1
        ;;
esac
