#!/bin/bash

# sync.sh - Copy boilerplate files from a starter project to a target directory
# Usage: ./sync.sh <project-name> <target-directory>
# Example: ./sync.sh expo /path-to-my-expo-project

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Show usage if no arguments provided
if [ $# -lt 2 ]; then
    echo "Usage: $0 <project-name> <target-directory>"
    echo ""
    echo "Available projects:"
    for dir in "$SCRIPT_DIR"/*/; do
        if [ -d "$dir" ]; then
            basename "$dir"
        fi
    done
    echo ""
    echo "Example: $0 expo /path-to-my-expo-project"
    exit 1
fi

PROJECT_NAME="$1"
TARGET_DIR="$2"
SOURCE_DIR="$SCRIPT_DIR/$PROJECT_NAME"

# Validate source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Project '$PROJECT_NAME' not found at $SOURCE_DIR"
    echo ""
    echo "Available projects:"
    for dir in "$SCRIPT_DIR"/*/; do
        if [ -d "$dir" ]; then
            basename "$dir"
        fi
    done
    exit 1
fi

# Create target directory if it doesn't exist
if [ ! -d "$TARGET_DIR" ]; then
    echo "Creating target directory: $TARGET_DIR"
    mkdir -p "$TARGET_DIR"
fi

# Convert target to absolute path
TARGET_DIR="$(cd "$TARGET_DIR" && pwd)"

echo "Syncing files from '$PROJECT_NAME' to '$TARGET_DIR'..."

# Copy all files from source to target
# Using cp -R to preserve structure, excluding .git
if command -v rsync &> /dev/null; then
    rsync -av --exclude='.git' "$SOURCE_DIR/" "$TARGET_DIR/"
else
    # Fallback to cp + find (avoid copying .git)
    cd "$SOURCE_DIR"
    find . -type f -not -path './.git/*' -exec cp --parents {} "$TARGET_DIR/" \;
fi

echo "Done! Files synced to: $TARGET_DIR"
