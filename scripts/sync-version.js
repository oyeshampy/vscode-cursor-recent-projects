#!/usr/bin/env node
/**
 * Sync version from package.json into CHANGELOG.md.
 * Edit "version" in package.json, then run: npm run version:sync
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pkgPath = path.join(root, "package.json");
const changelogPath = path.join(root, "CHANGELOG.md");

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const version = pkg.version;
if (!version) {
  console.error("No version in package.json");
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
let changelog = fs.readFileSync(changelogPath, "utf8");
// Update first ## [x.y.z] - date line to current version and today
changelog = changelog.replace(/^## \[[\d.]+\] - \d{4}-\d{2}-\d{2}/m, `## [${version}] - ${today}`);
fs.writeFileSync(changelogPath, changelog);
console.log(`Synced version ${version} to CHANGELOG.md (${today}).`);