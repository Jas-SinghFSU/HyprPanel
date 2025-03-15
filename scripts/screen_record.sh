#!/usr/bin/env bash
# Requires wf-recorder: https://github.com/ammen99/wf-recorder

defaultSink=$(pactl get-default-sink)
WF_RECORDER_OPTS="--audio=$defaultSink.monitor -c libx264rgb"
outputFile=""
outputDir=""

checkRecording() {
    pgrep -f "wf-recorder" >/dev/null
}

startRecording() {
    if checkRecording; then
        echo "A recording is already in progress."
        exit 1
    fi

    target="$2"
    outputDir=$(eval echo "$3")
    monitor_name="$4"

    if [ -z "$outputDir" ]; then
        echo "Error: Output directory is empty."
        exit 1
    fi

    if [ ! -d "$outputDir" ]; then
        echo "Error: Output directory '$outputDir' does not exist."
        exit 1
    fi

    outputFile="recording_$(date +%Y-%m-%d_%H-%M-%S).mp4"
    outputPath="$outputDir/$outputFile"

    echo "Target: $target"
    echo "Output dir: $outputDir"
    echo "Output file: $outputPath"

    if [ "$target" == "screen" ]; then
        if [ -z "$monitor_name" ]; then
            echo "Error: Monitor name is required for screen recording."
            exit 1
        fi

        monitor_info=$(hyprctl -j monitors | jq -r ".[] | select(.name == \"$monitor_name\")")
        if [ -z "$monitor_info" ]; then
            echo "Error: Monitor '$monitor_name' not found."
            exit 1
        fi

        w=$(echo "$monitor_info" | jq -r '.width')
        h=$(echo "$monitor_info" | jq -r '.height')
        scale=$(echo "$monitor_info" | jq -r '.scale')
        scaled_width=$(awk "BEGIN { print $w / $scale }")
        scaled_height=$(awk "BEGIN { print $h / $scale }")
        x=$(echo "$monitor_info" | jq -r '.x')
        y=$(echo "$monitor_info" | jq -r '.y')

        wf-recorder $WF_RECORDER_OPTS --geometry "${x},${y} ${scaled_width}x${scaled_height}" --file "$outputPath" &
    elif [ "$target" == "region" ]; then
        wf-recorder $WF_RECORDER_OPTS --geometry "$(slurp)" --file "$outputPath" &
    else
        echo "Usage: $0 start {screen [output_directory] [monitor_name]|region [output_directory]}"
        exit 1
    fi

    disown "$(jobs -p | tail -n 1)"
    echo "Recording started. Saving to $outputPath"
    echo "$outputPath" > /tmp/last_recording_path
}

stopRecording() {
    if ! checkRecording; then
        echo "No recording in progress."
        exit 1
    fi

    pkill -SIGINT -f wf-recorder
    sleep 1 # Give wf-recorder time to properly terminate before proceeding  

    outputPath=$(cat /tmp/last_recording_path 2>/dev/null)

    if [ -z "$outputPath" ] || [ ! -f "$outputPath" ]; then
        notify-send "Recording stopped" "No recent recording found." \
            -i video-x-generic \
            -a "Screen Recorder" \
            -t 10000
        exit 1
    fi

    notify-send "Recording stopped" "Saved to: $outputPath" \
        -i video-x-generic \
        -a "Screen Recorder" \
        -t 10000 \
        --action="scriptAction:-xdg-open $(dirname "$outputPath")=Open Directory" \
        --action="scriptAction:-xdg-open $outputPath=Play"
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
    echo "Usage: $0 {start [screen output_directory monitor_name|region output_directory]|stop|status}"
    exit 1
    ;;
esac
