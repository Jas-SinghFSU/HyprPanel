#!/bin/bash

# Script to analyze the codebase structure and identify areas for reorganization

echo "=== HyprPanel Codebase Analysis ==="
echo

# Count files by type
echo "File counts by type:"
echo "TypeScript files: $(find src -name "*.ts" -not -path "*/node_modules/*" | wc -l)"
echo "TSX files: $(find src -name "*.tsx" -not -path "*/node_modules/*" | wc -l)"
echo "Helper files: $(find src -name "*helper*.ts" -o -name "*utils*.ts" | wc -l)"
echo

# Find all helper and utils files
echo "=== Helper/Utils Files ==="
find src -name "*helper*.ts" -o -name "*utils*.ts" -o -name "*utilities*.ts" | sort
echo

# Find potential service candidates (files with state/class patterns)
echo "=== Potential Service Candidates ==="
grep -r "class\|Variable\|Variable<" src --include="*.ts" --include="*.tsx" | grep -v "node_modules" | cut -d: -f1 | sort -u | head -20
echo

# Find files with mixed concerns (large files)
echo "=== Large Files (>200 lines) ==="
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -rn | head -20
echo

# Identify shared directories
echo "=== Shared Directories ==="
find src -type d -name "shared" | sort
echo

# Find inconsistent naming patterns
echo "=== Inconsistent File Naming ==="
echo "Files not following index.ts pattern in their directories:"
find src -name "*.ts" -o -name "*.tsx" | grep -v index | while read file; do
    dir=$(dirname "$file")
    base=$(basename "$file" .ts | sed 's/\.tsx$//')
    if [ "$(basename "$dir")" != "$base" ]; then
        echo "$file"
    fi
done | head -10