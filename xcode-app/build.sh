#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
APP_NAME="耳界智能诊室系统"
BUILD_DIR="$SCRIPT_DIR/build"
APP_BUNDLE="$BUILD_DIR/$APP_NAME.app"
CONTENTS="$APP_BUNDLE/Contents"
MACOS="$CONTENTS/MacOS"
RESOURCES="$CONTENTS/Resources"

echo "🔨 编译 Swift..."
rm -rf "$BUILD_DIR"
mkdir -p "$MACOS" "$RESOURCES"

# 编译为 Universal Binary (Intel + Apple Silicon)
swiftc \
  -target arm64-apple-macos10.15 \
  -parse-as-library \
  -o "$MACOS/ShuguangHIS-arm64" \
  "$SCRIPT_DIR/ShuguangHIS/AppDelegate.swift" \
  -framework Cocoa \
  -framework WebKit

swiftc \
  -target x86_64-apple-macos10.15 \
  -parse-as-library \
  -o "$MACOS/ShuguangHIS-x86_64" \
  "$SCRIPT_DIR/ShuguangHIS/AppDelegate.swift" \
  -framework Cocoa \
  -framework WebKit

# 合并为 Universal Binary
lipo -create "$MACOS/ShuguangHIS-arm64" "$MACOS/ShuguangHIS-x86_64" -output "$MACOS/ShuguangHIS"
rm "$MACOS/ShuguangHIS-arm64" "$MACOS/ShuguangHIS-x86_64"

echo "📦 复制资源..."
cp "$SCRIPT_DIR/ShuguangHIS/Info.plist" "$CONTENTS/"
cp -R "$PROJECT_ROOT/dist" "$RESOURCES/dist"

# 复制图标
if [ -f /tmp/app.icns ]; then
  cp /tmp/app.icns "$RESOURCES/AppIcon.icns"
fi

echo "🔏 签名..."
codesign --force --deep --sign - "$APP_BUNDLE"

echo "✅ 构建完成: $APP_BUNDLE"
echo "📏 大小: $(du -sh "$APP_BUNDLE" | cut -f1)"
