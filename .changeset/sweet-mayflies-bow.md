---
"@knime/eslint-config": major
---

update to eslint 9 and migrate eslint configs to flat config format

- upgrade to eslint 9
- update dependencies
- migrate eslint configs to flat config and add names to each config object
- use `eslint-plugin-import-x` instead of `eslint-plugin-import` (compatibility with nuxt3 ruleset)
- remove configs for jest, vue2, nuxt2 and the legacy config
- improve readme and package description

Using this version will require you to also update to eslint 9.x.x and use the flat config format and write the configs as es modules.
Extending a config form `@knime/eslint-config` looks something like this then:

```js
import config from "@knime/eslint-config/<config>.js";

export default [
  ...config,
  {
    // additional config
  },
  // additional configs
];
```

If you need to extend the files covered with the base config you will need to do it like this:

```js
...config.map((conf) => {
    if (conf.name?.includes("@knime/eslint-config/<config>")) {
      return {
        ...conf,
        files: [...conf.files, "*.ts", "*.tsx", "*.mts", "*.cts", "*.vue"],
      };
    }
    return conf;
  })
```

All config objects we export have a name, so should any other configs need adjustment afterwards they can be found through the name and then be adjusted.
The config objects are generally named after the config file with the "@knime/eslint-config/" prefix. Exceptions for this are the nuxt and vue-typescript configs as they use special helper functions to assemble the config that we couldn't pass a name to.
