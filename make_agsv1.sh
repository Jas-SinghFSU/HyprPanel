#!/bin/bash

makepkg -si

echo "Cleaning up build files..."
rm -rf -- pkg src *.pkg.tar.* *.tar.gz

echo "Build and installation completed successfully. All generated files have been cleaned up."
