#!/bin/bash

SOURCE_DIR="./assets/fonts"
DEST_DIR="$HOME/.local/share/fonts"
DEST_PATH="$DEST_DIR/NFP"

if [ ! -d "$SOURCE_DIR" ]; then
    echo "Source directory '$SOURCE_DIR' does not exist."
    exit 1
fi

if [ ! -d "$DEST_PATH" ]; then
    echo "Destination directory '$DEST_PATH' does not exist. Creating it..."
    mkdir -p "$DEST_PATH"
fi

if [ -z "$(ls -A "$SOURCE_DIR")" ]; then
    echo "Source directory '$SOURCE_DIR' is empty. No files to copy."
    exit 1
fi

echo "Copying fonts from '$SOURCE_DIR' to '$DEST_PATH'..."
cp -r "$SOURCE_DIR"/* "$DEST_PATH"

echo "Updating font cache..."
fc-cache -fv

echo "Fonts installed successfully."
