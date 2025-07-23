export default {
  // allowed licenses; others will fail
  onlyAllow: [
    "MIT",
    "ISC",
    "BSD",
    "Apache-2.0",
    "CC0-1.0",
    "CC-BY-3.0",
    "CC-BY-4.0",
    "CC-BY-ND-4.0",
    "MPL-2.0",
    "Public Domain",
    "Zlib",
    "Unlicense",
    "BlueOak-1.0.0",
    "OFL-1.1",
  ],

  // e.g. 'nuxt@2.0.0'
  excludePackages: [
    "webapps-common@0.0.0",
    "knime-build-tools@0.0.0",
    "knime-ui@0.0.0-unused",
    "knime-ui-extension-service@1.0.0",
    "knime-pagebuilder@1.0.0",
    "cluster-key-slot@1.1.0", // recognized as Apache* but is actually Apache-2.0 license
    "argparse@2.0.1", // licensed under Python-2.0 but not included in the production app
    "jackspeak@2.3.6", // licensed under BlueOak-1.0.0 but not included in the production app
    "path-scurry@1.10.1", // licensed under BlueOak-1.0.0 but not included in the production app
    "@img/sharp-libvips-darwin-arm64@1.0.2", // licensed under LGPL-3.0, included in knime-hub-webapp without modifications and with attribution
    "@img/sharp-libvips-darwin-x64@1.0.2",
    "@img/sharp-libvips-linux-arm64@1.0.2",
    "@img/sharp-libvips-linux-x64@1.0.2",
    "@img/sharp-libvips-linuxmusl-arm64@1.0.2",
    "@img/sharp-libvips-linuxmusl-x64@1.0.2",
    "@img/sharp-libvips-win32-x64",
    "@netlify/binary-info@1.0.0", // licensed under Apache-2.0 but not included in the production app
    "audit-resolve-core@3.0.0-3", // licensed under Apache-2.0 but file not included in the production app
    "npm-audit-resolver@3.0.0-RC.0", // recognized as Apache* but is actually Apache-2.0 license
    "esm-resolve@1.0.8", // recognized as Apache* but is actually Apache-2.0 license
  ],

  // manually add packages to the credits, e.g.:
  // { name: 'myownpackage', licenses: 'MyOwnLicense 2.0', licenseText: 'Custom license text' }
  manualPackages: [],
};
