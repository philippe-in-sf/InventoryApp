const expoConfig = require("eslint-config-expo/flat");

module.exports = [
  ...expoConfig,
  {
    ignores: [".expo/**", ".npm-cache/**", "node_modules/**", "dist/**", "web-build/**"],
  },
];
