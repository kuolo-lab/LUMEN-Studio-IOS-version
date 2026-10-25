import fs from 'node:fs';
import path from 'node:path';

const candidates = [
  path.resolve('ios/App/App/Info.plist'),
  path.resolve('ios/App/Info.plist'),
];

const plistPath = candidates.find((p) => fs.existsSync(p));
if (!plistPath) {
  console.error('iOS project not found. Run: npx cap add ios');
  process.exit(1);
}

let xml = fs.readFileSync(plistPath, 'utf8');

const cameraKey = 'NSCameraUsageDescription';
const cameraValue =
  'LUMEN Studio uses the camera for the live viewfinder. Photos are processed on this device only and are never uploaded.';

if (xml.includes(`<key>${cameraKey}</key>`)) {
  console.log(`Info.plist already contains ${cameraKey}.`);
} else {
  if (!xml.includes('</dict>')) {
    console.error(`Could not update ${plistPath}: missing </dict> closing tag.`);
    process.exit(1);
  }
  const block = `\t<key>${cameraKey}</key>\n\t<string>${cameraValue}</string>\n`;
  xml = xml.replace('</dict>', `${block}</dict>`);
  fs.writeFileSync(plistPath, xml);
  console.log(`Patched ${plistPath} with ${cameraKey}.`);
}
