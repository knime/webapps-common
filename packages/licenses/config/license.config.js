module.exports = {
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
    "audit-resolve-core@3.0.0-3", // licensed under Apache-2.0 but file not included in the production app
    "npm-audit-resolver@3.0.0-7", // recognized as Apache* but is actually Apache-2.0 license
  ],

  // manually add packages to the credits, e.g.:
  // {name: 'myownpackage', licenses: 'MyOwnLicense 2.0', licenseText: 'Custom license text'}
  manualPackages: [
    {
      name: "Roboto Font",
      repository: "https://fonts.google.com/specimen/Roboto",
      licenses: "Apache-2.0",
      licenseText:
        'Copyright 2011 Google Inc.\n\nLicensed under the Apache License, Version 2.0 (the "License");\nyou may not use this file except in compliance with the License.\nYou may obtain a copy of the License at\n\n    http://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an "AS IS" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.',
    },
    {
      name: "Roboto Mono Font",
      repository: "https://fonts.google.com/specimen/Roboto+Mono",
      licenses: "Apache-2.0",
      licenseText:
        'Copyright 2015 Google Inc.\n\nLicensed under the Apache License, Version 2.0 (the "License");\nyou may not use this file except in compliance with the License.\nYou may obtain a copy of the License at\n\n    http://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an "AS IS" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.',
    },
  ],
};
