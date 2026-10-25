# LUMEN Studio: iOS notes

The Android cloud-build path is unchanged. Use [`GITHUB-APK-GUIDE.md`](GITHUB-APK-GUIDE.md) for the APK, and [`GITHUB-IOS-GUIDE.md`](GITHUB-IOS-GUIDE.md) for iOS.

## What changed for iOS

The existing React + Vite + Capacitor 7 app now also declares the iOS platform:

- App ID stays `com.lumenstudio.app`
- App name stays `LUMEN Studio`
- Web build directory stays `dist`
- `@capacitor/ios` is installed next to the existing `@capacitor/android` package
- `scripts/patch-ios.mjs` writes `NSCameraUsageDescription` into `Info.plist`
- `.github/workflows/build-ios.yml` compiles on `macos-14` without touching the Android job

## Why a Windows PC cannot finish iPhone install

Apple requires Xcode to sign an app for a physical iPhone. Xcode only runs on macOS.

GitHub Actions **can** rent a Mac long enough to compile. That is why the iOS workflow exists. Compilation is not the same as signing, and an unsigned `.app` is not the same as the Android debug APK you already install on a phone.

## Local commands (Mac only)

Run these in the folder that contains `package.json`:

```bash
npm install
npm run build
npx cap add ios
npx cap sync ios
node scripts/patch-ios.mjs
npx cap open ios
```

If `npx cap add ios` says the iOS platform already exists, continue with build, sync, and the patch script.

## Permissions

Only the camera permission is added, because the existing camera tab uses `navigator.mediaDevices.getUserMedia()`.

Not added, because the current app does not need them:

- Microphone
- Photo Library
- Location
- Notifications

## Feature behavior on iOS

| Feature | Expected iOS behavior |
| --- | --- |
| Live viewfinder | Works after the iOS camera permission prompt |
| Capture to in-app gallery | Works; stored in IndexedDB inside the app |
| Manual ISO / shutter / torch | Usually **not** available in iOS WKWebView; UI falls back to auto |
| Editor, presets, studio, LUT | Same as the web/Android app |
| Save / export | On iOS, the share sheet is used when the browser download attribute would fail |
| Native Photos app library | Not used; LUMEN has its own gallery |
| DNG RAW | Not available; RAW mode still saves a PNG negative |

## Do not break Android

- Leave `scripts/patch-android.mjs` and `.github/workflows/build-apk.yml` in place
- Do not remove `@capacitor/android`
- The iOS workflow uses a different runner (`macos-14`) and different artifact names
