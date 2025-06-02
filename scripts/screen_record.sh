#!/usr/bin/env bash
# Requires wf-recorder: https://github.com/ammen99/wf-recorder

# Get the default audio sink
defaultSink=$(pactl get-default-sink)
WF_RECORDER_OPTS="--audio=$defaultSink.monitor -c libx264rgb"
outputFile=""
outputDir=""

# Function to check if recording is active
checkRecording() {
    pgrep -f "wf-recorder" >/dev/null
}

# Function to start screen recording
startRecording() {
    if checkRecording; then
        echo "A recording is already in progress."
        exit 1
    fi

    target="$2"

    if [ "$target" == "screen" ]; then
        monitor_name="$3"
        outputDir="$4"
    elif [ "$target" == "region" ]; then
        outputDir="$3"
    else
        echo "Usage: $0 start {screen <monitor_name> | region} <output_directory>"
        exit 1
    fi

    # Set a default output directory if not provided
    outputDir="${outputDir:-$HOME/Videos}"

    # Expand ~ to $HOME if present in outputDir
    outputDir="${outputDir/#\~/$HOME}"

    # Ensure output directory exists
    if [ ! -d "$outputDir" ]; then
        mkdir -p "$outputDir"
        echo "Created output directory: $outputDir"
    fi

    # Generate output filename and path
    outputFile="recording_$(date +%Y-%m-%d_%H-%M-%S).mp4"
    outputPath="$outputDir/$outputFile"

    echo "Target: $target"
    echo "Monitor: ${monitor_name:-N/A}"
    echo "Output dir: $outputDir"
    echo "Output file: $outputPath"

    # Start screen recording
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
        x=$(echo "$monitor_info" | jq -r '.x')
        y=$(echo "$monitor_info" | jq -r '.y')

        transform=$(echo "$monitor_info" | jq -r '.transform')
        rotation_filter=""

        if [ "$transform" -eq 1 ] || [ "$transform" -eq 3 ]; then
            scaled_width=$(awk "BEGIN { print $h / $scale }")
            scaled_height=$(awk "BEGIN { print $w / $scale }")
        else
            scaled_width=$(awk "BEGIN { print $w / $scale }")
            scaled_height=$(awk "BEGIN { print $h / $scale }")
        fi

        case "$transform" in
        1)
            rotation_filter="-F transpose=1"
            ;;
        3)
            rotation_filter="-F transpose=2"
            ;;
        esac

        wf-recorder $WF_RECORDER_OPTS $rotation_filter --geometry "${x},${y} ${scaled_width}x${scaled_height}" --file "$outputPath" &
    elif [ "$target" == "region" ]; then
        wf-recorder $WF_RECORDER_OPTS --geometry "$(slurp)" --file "$outputPath" &
    fi

    disown "$(jobs -p | tail -n 1)"
    echo "Recording started. Saving to $outputPath"
    echo "$outputPath" >/tmp/last_recording_path
}

# Function to stop screen recording
stopRecording() {
    if ! checkRecording; then
        echo "No recording in progress."
        exit 1
    fi

    pkill -SIGINT -f wf-recorder
    sleep 1 # Allow wf-recorder time to terminate before proceeding

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

# Handle script arguments
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
    echo "Usage: $0 {start [screen <monitor_name> | region] <output_directory> | stop | status}"
    exit 1
    ;;
esac
