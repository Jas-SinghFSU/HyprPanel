#!/bin/bash

outputDir="$HOME/Pictures/Screenshots/"
outputFile="snapshot_$(date +%Y-%m-%d_%H-%M-%S).png"
outputPath="$outputDir/$outputFile"
mkdir -p "$outputDir"

if grimblast copysave area "$outputPath"; then
    recentFile=$(ls -t "$outputDir"/snapshot_*.png | head -n 1)
    notify-send "Grimblast" "Your snapshot has been saved." \
        -i video-x-generic \
        -a "Grimblast" \
        -t 7000 \
        -u normal \
        --action="scriptAction:-dolphin $outputDir=Directory" \
        --action="scriptAction:-xdg-open $recentFile=View"
fi
