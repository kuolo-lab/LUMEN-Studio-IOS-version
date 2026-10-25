# Build LUMEN Studio for iOS with GitHub Actions

This is the iOS companion to `GITHUB-APK-GUIDE.md`. GitHub's macOS machines compile the existing React + Capacitor project. You do **not** need a Mac to *start* the build, but you **do** still need a Mac (and an Apple ID) later if you want the app on a real iPhone.

This workflow does **not** replace or change the Android APK workflow.

## What this workflow actually produces

A green iOS workflow is useful, but it is **not** the same thing as an installable iPhone app.

| Stage | What you get | Mac needed? | Apple ID needed? | Paid Developer Program? |
| --- | --- | --- | --- | --- |
| 1. GitHub compiles the iOS project | Proof the app builds, plus downloadable artifacts | No (GitHub uses its own Mac) | No | No |
| 2. Unsigned Simulator `.app` | Runs only inside Xcode's iOS Simulator on a Mac | Yes, to run it | No | No |
| 3. Signed development install | App on *your* iPhone for about 7 days | Yes (Xcode) | Yes, free Apple ID | No |
| 4. Signed `.ipa` / TestFlight | Shareable install file / TestFlight testers | Yes, or CI with secrets | Yes | Yes ($99/year) |
| 5. App Store | Public listing | Yes, or CI with secrets | Yes | Yes |

GitHub Actions in this repository does **step 1** and uploads the files from **step 2**. It does **not** automatically produce a signed `.ipa` you can AirDrop onto an iPhone.

## Files this iOS setup uses

Keep these in the **same folder as `package.json`** (in the current GitHub repo that is `lumen-studio-github-apk/lumen-studio-android-ready/`):

- `package.json` — must include `@capacitor/ios` and `@capacitor/cli`
- `capacitor.config.ts` — app ID `com.lumenstudio.app`, web dir `dist`
- `scripts/patch-ios.mjs` — writes the iOS camera permission text
- `src/` and the rest of the existing app (do not replace these)

Keep this file in the **repository root**:

- `.github/workflows/build-ios.yml`

Leave `.github/workflows/build-apk.yml` exactly as it is.

## 1. Copy the new files into your GitHub repo

If you work on Windows:

1. Open your existing `kuolo-lab/LUMEN-studio` repository on GitHub.
2. Add or update these files (full contents are in this project):
   - `.github/workflows/build-ios.yml` at the **repository root**
   - `lumen-studio-github-apk/lumen-studio-android-ready/scripts/patch-ios.mjs`
   - `lumen-studio-github-apk/lumen-studio-android-ready/capacitor.config.ts`
   - the updated `package.json` in that same project folder
3. Do **not** delete `build-apk.yml`, `scripts/patch-android.mjs`, or the Android scripts.

If you use GitHub Desktop or git on Windows, the commands are:

```bat
git add .github/workflows/build-ios.yml
git add lumen-studio-github-apk/lumen-studio-android-ready/package.json
git add lumen-studio-github-apk/lumen-studio-android-ready/package-lock.json
git add lumen-studio-github-apk/lumen-studio-android-ready/capacitor.config.ts
git add lumen-studio-github-apk/lumen-studio-android-ready/scripts/patch-ios.mjs
git add lumen-studio-github-apk/lumen-studio-android-ready/src
git commit -m "Add Capacitor iOS platform support and GitHub iOS build"
git push
```

Only add `src` if you also copied the small iOS compatibility edits (camera permission wording, iOS save/share fallback). If you did not copy those edits, skip that line.

## 2. Run the iOS workflow

1. Open https://github.com/kuolo-lab/LUMEN-studio
2. Click the **Actions** tab
3. If GitHub asks you to enable Actions, enable them
4. In the left list, click **Build LUMEN Studio iOS**
5. Click **Run workflow** → branch `main` → **Run workflow**
6. Open the newest run and wait. macOS builds often take 10–25 minutes
7. A green check means the compile finished. A red X means a step failed — open that step and copy the first real error

The Android workflow can keep running on Ubuntu at the same time. They do not share jobs.

## 3. Download the artifacts

On the successful run page, scroll to **Artifacts**.

You should see:

1. **Lumen-Studio-iOS-Simulator-App**
   - Downloads as a ZIP
   - Inside is `App.app`
   - This is an **unsigned iOS Simulator build**
   - It will **not** install on an iPhone
2. **Lumen-Studio-iOS-Xcode-Project**
   - Downloads as a ZIP
   - Inside is the generated `ios/` Xcode project plus `WHAT-THIS-CONTAINS.txt`
   - This is the folder you open on a Mac with Xcode

If an artifact is missing, the upload step failed. Open **Collect build outputs** and **Upload** steps in the log.

## 4. The simplest path onto a real iPhone

You are on Windows, so GitHub can compile, but Apple still requires Xcode to sign for a physical iPhone.

**Simplest practical path:**

1. Let GitHub Actions finish with a green check. That proves the iOS project compiles.
2. Borrow or use a Mac (yours, a friend's, a school lab, or a paid cloud Mac).
3. On that Mac:
   - Install **Xcode** from the Mac App Store and open it once to accept the license
   - Install **Node.js LTS**
   - Clone this repository
   - In Terminal, from the folder that contains `package.json`:

```bash
npm install
npm run build
npx cap add ios
npx cap sync ios
node scripts/patch-ios.mjs
npx cap open ios
```

4. In Xcode:
   - Click **App** in the left sidebar
   - Open **Signing & Capabilities**
   - Check **Automatically manage signing**
   - Team: add your **free Apple ID** (Xcode → Settings → Accounts → +)
   - Plug in the iPhone with a cable, trust the computer
   - Choose the iPhone as the run destination
   - Press the Play button

The first time, the iPhone will say the developer is untrusted. On the phone go to **Settings → General → VPN & Device Management** (wording varies by iOS version) and trust your Apple ID. Then open LUMEN Studio.

A free Apple ID install typically expires after **7 days**. You reopen Xcode and press Play again to refresh it. A paid Apple Developer Program membership is required for TestFlight, a lasting `.ipa`, or the App Store.

## 5. What you cannot do from Windows alone

- You cannot run Xcode on Windows
- You cannot install the GitHub **Simulator** `.app` on an iPhone
- You cannot sideload an unsigned iOS app the way you sideload the Android debug APK
- GitHub Actions cannot sign an iPhone build unless you later add Apple certificates and provisioning profiles as repository secrets. That is a separate, more advanced setup and is **not** included here

## Troubleshooting

### Dependency conflicts (`npm install` fails)

- Use Node.js 22, same as the Android workflow
- Delete `node_modules` on the runner is automatic; locally delete `node_modules` and run `npm install` again
- Do not mix Capacitor 6 and 7. This project uses Capacitor 7 (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/ios`)

### `npx cap add ios` says the platform already exists

That is OK. The workflow skips creation and continues with `cap sync`.

### Missing iOS platform files / `ios/App/App.xcworkspace` not found

- Confirm `@capacitor/ios` is in `package.json`
- Confirm the web build created `dist/index.html` before `cap add`
- Open the **Create iOS platform** and **Sync web assets** logs
- CocoaPods must succeed; the next error is usually the real one

### CocoaPods failures

Look for `pod install` in the log.

Common fixes already in the workflow:

- `LANG=en_US.UTF-8` and `LC_ALL=en_US.UTF-8`
- macOS 14 runner with the bundled CocoaPods

If pods still fail, copy the `pod install` error. Typical causes are a truncated `Podfile`, network timeouts, or a Capacitor iOS version mismatch.

### Code-signing errors

The workflow builds for the **Simulator** with `CODE_SIGNING_ALLOWED=NO`, so it should **not** need a signing certificate.

If you see `requires a development team` or `No provisioning profiles`, you are looking at a **device** build, not this workflow. Device builds need Xcode signing on a Mac.

### Unavailable provisioning profiles

That error appears only when exporting a signed `.ipa` or running on a physical device. This GitHub job does not create provisioning profiles. Add an Apple Developer team in Xcode on a Mac, or later add certificates as GitHub secrets.

### Camera permission dialog never appears

- Confirm `scripts/patch-ios.mjs` ran (log line: `Patched ... NSCameraUsageDescription`)
- On the iPhone: **Settings → LUMEN Studio → Camera**
- The in-app Settings tab can request camera access again

### Manual shutter speed / ISO look unavailable

That is expected on iOS. The camera still uses `getUserMedia`. Advanced WebView constraints (manual ISO, shutter, torch) are mostly an Android Chrome/WebView feature. The UI already falls back to auto and says so.

## Honest limitations

- This is the same React app wrapped in a native iOS shell with Capacitor. It is not a rewrite in Swift.
- GitHub Actions here produces an **unsigned Simulator build** plus the Xcode project.
- It does **not** produce a signed iPhone `.ipa`.
- RAW capture is still a lossless PNG negative, not sensor DNG.
- Photos live in the app's IndexedDB. Deleting the iOS app deletes that gallery unless you exported files.
