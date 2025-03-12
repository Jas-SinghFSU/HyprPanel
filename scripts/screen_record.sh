#!/usr/bin/env bash
# Requires wf-recorder : https://github.com/ammen99/wf-recorder, jq, hyprctl, zenity (for GUI folder picker)

defaultSink=$(pactl get-default-sink)
WF_RECORDER_OPTS="--audio=$defaultSink.monitor -c libx264rgb"
tempDir="/tmp/screencasts"

checkRecording() {
    pgrep -f "wf-recorder" >/dev/null
}

startRecording() {
    if checkRecording; then
        echo "A recording is already in progress."
        exit 1
    fi

    target="$2"
    mkdir -p "$tempDir"
    outputFile="recording_$(date +%Y-%m-%d_%H-%M-%S).mp4"
    outputPath="$tempDir/$outputFile"

    if [ "$target" == "screen" ]; then
        monitor_info=$(hyprctl -j monitors | jq -r ".[] | select(.name == \"$3\")")
        w=$(echo $monitor_info | jq -r '.width')
        h=$(echo $monitor_info | jq -r '.height')
        scale=$(echo $monitor_info | jq -r '.scale')
        scaled_width=$(echo "${w} / ${scale}" | bc)
        scaled_height=$(echo "${h} / ${scale}" | bc)
        x=$(echo $monitor_info | jq -r '.x')
        y=$(echo $monitor_info | jq -r '.y')
        wf-recorder $WF_RECORDER_OPTS --geometry "${x},${y} ${scaled_width}x${scaled_height}" --file "$outputPath" &
    elif [ "$target" == "region" ]; then
        wf-recorder $WF_RECORDER_OPTS --geometry "$(slurp)" --file "$outputPath" &
    else
        echo "Usage: $0 start {region|screen [screen_name]}"
        exit 1
    fi
    disown "$(jobs -p | tail -n 1)"

    echo "Recording started..."
}

stopRecording() {
    if ! checkRecording; then
        echo "No recording is in progress."
        exit 1
    fi

    pkill -SIGINT -f wf-recorder

    recentFile=$(ls -t "$tempDir"/*.mp4 | head -n 1)

    # Let the user pick a directory using Zenity
    saveDir=$(zenity --file-selection --directory --title="Select Directory to Save Recording")
    
    if [ -n "$saveDir" ]; then
        mv "$recentFile" "$saveDir/"
        notify-send "Recording saved" "File saved to $saveDir."
    else
        notify-send "Recording discarded" "File was not saved."
    fi
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
    echo "Usage: $0 {start [screen screen_name|region]|stop|status}"
    exit 1
    ;;
esac
