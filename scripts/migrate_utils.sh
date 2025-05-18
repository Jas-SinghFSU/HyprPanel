#!/bin/bash

# Migration script for reorganizing HyprPanel utilities

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting HyprPanel utilities migration...${NC}"

# Create backup first
echo -e "${YELLOW}Creating backup...${NC}"
cp -r src src_backup_$(date +%Y%m%d_%H%M%S)

# Create new directory structure
echo -e "${YELLOW}Creating new directory structure...${NC}"

# Core directories
mkdir -p src/core/errors
mkdir -p src/core/process
mkdir -p src/core/validation
mkdir -p src/core/system

# Services directories
mkdir -p src/services/notifications
mkdir -p src/services/window
mkdir -p src/services/display
mkdir -p src/services/weather
mkdir -p src/services/media
mkdir -p src/services/system

# Utils directories
mkdir -p src/utils/string
mkdir -p src/utils/array
mkdir -p src/utils/path
mkdir -p src/utils/events
mkdir -p src/utils/icons
mkdir -p src/utils/positioning
mkdir -p src/utils/time
mkdir -p src/utils/theme

# Constants directory
mkdir -p src/constants

# Types directories
mkdir -p src/types/modules
mkdir -p src/types/services
mkdir -p src/types/common

# Modules directory
mkdir -p src/modules/shared

echo -e "${GREEN}Directory structure created successfully!${NC}"
echo -e "${YELLOW}Next step: Creating new utility files...${NC}"