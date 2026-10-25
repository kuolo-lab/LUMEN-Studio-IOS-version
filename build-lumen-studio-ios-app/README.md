# LUMEN Studio

Professional camera and darkroom-grade photo editor. Free, offline, local-first. Built with React, Vite, and Capacitor 7.

This repository already had a working **Android** GitHub Actions path. iOS support is added on top of that project. The app ID is still `com.lumenstudio.app`. The web build directory is still `dist`.

## Current project layout

If you are looking at the GitHub repo `kuolo-lab/LUMEN-studio`, the app currently lives in:

```text
lumen-studio-github-apk/lumen-studio-android-ready/
```

The Android workflow already searches for `package.json`, so that nested folder is fine. The new iOS workflow uses the same search.

## What runs where

| You want | Use | Machine you need |
| --- | --- | --- |
| Try the app in a browser | `npm install` then `npm run dev` | Windows, Mac, or Linux |
| Installable Android APK | [GITHUB-APK-GUIDE.md](GITHUB-APK-GUIDE.md) | Windows is enough |
| Proof the iOS project compiles | [GITHUB-IOS-GUIDE.md](GITHUB-IOS-GUIDE.md) | Windows is enough to *start* GitHub Actions |
| App on a real iPhone | Xcode signing after the iOS project exists | A Mac + Apple ID |
| TestFlight / App Store | Signed distribution build | Paid Apple Developer Program |

## iOS in one paragraph

GitHub Actions can compile this app on a Mac runner. That produces an **unsigned iOS Simulator `.app`** and the **Xcode project**. It does **not** produce a signed `.ipa`, and it will **not** install on an iPhone by itself. Installing on an iPhone is a later Xcode step. Details and troubleshooting are in [GITHUB-IOS-GUIDE.md](GITHUB-IOS-GUIDE.md) and [README-IOS.md](README-IOS.md).

## Local web build

From the folder that contains `package.json`:

```bash
npm install
npm run dev
```

Production web build (required before any Capacitor sync):

```bash
npm run build
```

That writes `dist/`, which Capacitor copies into Android and iOS.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run build` | Vite production build into `dist/` |
| `npm run android:prepare` | Build, sync Android, patch camera permission |
| `npm run ios:prepare` | Build, sync iOS, patch camera permission (Mac) |
| `npx cap add android` | Create the Android platform folder |
| `npx cap add ios` | Create the iOS platform folder (needs a Mac for a full native toolchain) |

## Android

Unchanged. See [README-ANDROID.md](README-ANDROID.md) and [GITHUB-APK-GUIDE.md](GITHUB-APK-GUIDE.md).

## iOS permissions

The iOS patch script only adds camera usage text, because the existing camera tab uses `getUserMedia`. Microphone, Photos, and location permissions are not requested.
