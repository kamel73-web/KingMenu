#!/bin/bash
set -e

# Auto-incrémenter le versionCode
CURRENT=$(grep "versionCode" android/app/build.gradle | grep -o '[0-9]*')
NEW=$((CURRENT + 1))
sed -i "s/versionCode $CURRENT/versionCode $NEW/" android/app/build.gradle
sed -i "s/versionName \"1.0.$CURRENT\"/versionName \"1.0.$NEW\"/" android/app/build.gradle
echo "✅ Version: $NEW"

# Build
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export ANDROID_HOME=/workspaces/android-sdk
CAPACITOR_BUILD=true npm run build
npx cap sync android
cd android && ./gradlew bundleRelease

# Sign
base64 -d /workspaces/KingMenu/keystore.txt > /workspaces/KingMenu/keystore.jks
jarsigner -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore /workspaces/KingMenu/keystore.jks \
  /workspaces/KingMenu/android/app/build/outputs/bundle/release/app-release.aab \
  release

echo "🎉 Build terminé — version $NEW"
