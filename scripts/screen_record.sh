#!/usr/bin/env bash
# Requires wf-recorder: https://github.com/ammen99/wf-recorder

outputDir="$HOME/Videos/Screencasts"
defaultSink=$(pactl get-default-sink)
WF_RECORDER_OPTS="--audio=$defaultSink.monitor -c libx264rgb"

checkRecording() {
    if pgrep -f "wf-recorder" >/dev/null; then
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

    outputFile="recording_$(date +%Y-%m-%d_%H-%M-%S)"
    outputPath="$outputDir/${outputFile}.mp4"
    mkdir -p "$outputDir"

    if [ "$target" == "screen" ]; then
        monitor_info=$(hyprctl -j monitors | jq -r ".[] | select(.name == \"$3\")")
        w=$(echo $monitor_info | jq -r '.width')
        h=$(echo $monitor_info | jq -r '.height')
        x=$(echo $monitor_info | jq -r '.x')
        y=$(echo $monitor_info | jq -r '.y')
        wf-recorder $WF_RECORDER_OPTS --geometry "${x},${y} ${w}x${h}" --file "$outputPath" &
    elif [ "$target" == "region" ]; then
        wf-recorder $WF_RECORDER_OPTS --geometry "$(slurp)" --file "$outputPath" &
    else
        echo "Usage: $0 start {region|screen [screen_name]}"
        exit 1
    fi
    disown "$(jobs -p | tail -n 1)"

    echo "Recording started. Output will be saved to $outputPath"
}

stopRecording() {
    if ! checkRecording; then
        echo "No recording is in progress."
        exit 1
    fi

    pkill -SIGINT -f wf-recorder

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
    echo "Usage: $0 {start [screen screen_name|region]|stop|status}"
    exit 1
    ;;
esac
