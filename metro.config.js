const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

const ignoredRootDirs = [
  ".codex-git",
  ".expo",
  ".expo-home",
  ".npm-cache",
  ".vercel",
  ".vercel-home",
  "dist",
  "dist-debug",
  "web-build",
];

config.resolver.blockList = ignoredRootDirs.map(
  (dir) => new RegExp(`^${escapeRegExp(path.join(projectRoot, dir))}(/.*)?$`),
);

// Keep Metro on the plain Node filesystem watcher. On this project Watchman
// and large repo-local tool caches can make Expo appear to freeze before bind.
config.resolver.useWatchman = false;

module.exports = config;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
