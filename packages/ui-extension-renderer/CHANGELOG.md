# @knime/ui-extension-renderer

## 2.3.36

### Patch Changes

- Updated dependencies [640ba04]
  - @knime/components@1.41.7

## 2.3.35

### Patch Changes

- b6c2eb9: add repository link to package.json
- Updated dependencies [b6c2eb9]
  - @knime/components@1.41.6
  - @knime/styles@1.14.3

## 2.3.34

### Patch Changes

- Updated dependencies [4099706]
  - @knime/components@1.41.5

## 2.3.33

### Patch Changes

- @knime/components@1.41.4

## 2.3.32

### Patch Changes

- Updated dependencies [dae9c04]
  - @knime/components@1.41.3

## 2.3.31

### Patch Changes

- Updated dependencies [f2ce76e]
  - @knime/components@1.41.2

## 2.3.30

### Patch Changes

- Updated dependencies [4fa675a]
  - @knime/components@1.41.1

## 2.3.29

### Patch Changes

- Updated dependencies [69ee640]
  - @knime/components@1.41.0

## 2.3.28

### Patch Changes

- Updated dependencies [fd66ef6]
  - @knime/components@1.40.1

## 2.3.27

### Patch Changes

- Updated dependencies [d394585]
  - @knime/components@1.40.0

## 2.3.26

### Patch Changes

- Updated dependencies [2933ca3]
  - @knime/components@1.39.4

## 2.3.25

### Patch Changes

- Updated dependencies [3b8b06f]
  - @knime/components@1.39.3

## 2.3.24

### Patch Changes

- Updated dependencies [a554e60]
  - @knime/components@1.39.2

## 2.3.23

### Patch Changes

- Updated dependencies [637189c]
  - @knime/components@1.39.1

## 2.3.22

### Patch Changes

- Updated dependencies [28c4851]
  - @knime/components@1.39.0
  - @knime/styles@1.14.2

## 2.3.21

### Patch Changes

- Updated dependencies [490ab62]
  - @knime/styles@1.14.1
  - @knime/components@1.38.8

## 2.3.20

### Patch Changes

- @knime/components@1.38.7

## 2.3.19

### Patch Changes

- Updated dependencies [98b2ff5]
  - @knime/components@1.38.6

## 2.3.18

### Patch Changes

- Updated dependencies [e814867]
  - @knime/components@1.38.5

## 2.3.17

### Patch Changes

- Updated dependencies [8fc76a1]
  - @knime/styles@1.14.0
  - @knime/components@1.38.4

## 2.3.16

### Patch Changes

- Updated dependencies [5e6e229]
  - @knime/components@1.38.3

## 2.3.15

### Patch Changes

- Updated dependencies [d17a4d3]
  - @knime/components@1.38.2

## 2.3.14

### Patch Changes

- Updated dependencies [feda14b]
  - @knime/components@1.38.1

## 2.3.13

### Patch Changes

- Updated dependencies [8794178]
  - @knime/components@1.38.0

## 2.3.12

### Patch Changes

- Updated dependencies [712590e]
  - @knime/styles@1.13.0
  - @knime/components@1.37.4

## 2.3.11

### Patch Changes

- Updated dependencies [e06f88c]
  - @knime/styles@1.12.1
  - @knime/components@1.37.3

## 2.3.10

### Patch Changes

- Updated dependencies [95587b5]
  - @knime/styles@1.12.0
  - @knime/components@1.37.2

## 2.3.9

### Patch Changes

- Updated dependencies [a771f90]
  - @knime/components@1.37.1

## 2.3.8

### Patch Changes

- Updated dependencies [1b3973e]
  - @knime/components@1.37.0

## 2.3.7

### Patch Changes

- Updated dependencies [2fb809c]
  - @knime/components@1.36.1

## 2.3.6

### Patch Changes

- Updated dependencies [c75b415]
  - @knime/components@1.36.0

## 2.3.5

### Patch Changes

- 73ea3a3: Correct DataType icon use for missing and path variables
- Updated dependencies [73ea3a3]
  - @knime/components@1.35.1
  - @knime/styles@1.11.1

## 2.3.4

### Patch Changes

- Updated dependencies [e1c15d1]
  - @knime/components@1.35.0

## 2.3.3

### Patch Changes

- Updated dependencies [6e00414]
  - @knime/components@1.34.3

## 2.3.2

### Patch Changes

- Updated dependencies [7fcf85b]
  - @knime/components@1.34.2

## 2.3.1

### Patch Changes

- Updated dependencies [6887f7b]
  - @knime/components@1.34.1

## 2.3.0

### Minor Changes

- 0df972d: Dependency updates. Mostly relevant:

  - vite, vitest (and coverage reporter), vite-plugin-vue, vue-tsc
  - tiptap
  - vueuse/core

  Other improvements:

  - Updated license-checker to allow for Open Font License (OFL)
  - Updated svgo.config.d.ts to fix detection of svg config when supplying it to the vite-svg-loader plugin in vite.config files
  - Remove usages of interface in favor of type, when used in .vue; interfaces create multiple type issues when inferring props, etc which are likely caused by the declaration merging feature of interfaces.

### Patch Changes

- Updated dependencies [0df972d]
  - @knime/components@1.34.0
  - @knime/styles@1.11.0

## 2.2.5

### Patch Changes

- 97d93be: Fix bug introduced with FSR-64. Reverting to `null` as the default value for the `initialSharedData`
  prop in UIExtension.vue, because `null` is an expected fallback value and `{}` was being used instead.

## 2.2.4

### Patch Changes

- Updated dependencies [170b8d2]
  - @knime/components@1.33.2

## 2.2.3

### Patch Changes

- 0f074fc: add bubbling of escape event over iframe boundary (via custom event)

## 2.2.2

### Patch Changes

- Updated dependencies [e7d2020]
  - @knime/components@1.33.1

## 2.2.1

### Patch Changes

- Updated dependencies [f9c2726]
  - @knime/components@1.33.0

## 2.2.0

### Minor Changes

- 51d4769: Remove usages of the FunctionalComponent type for svg icon imports and replace it with the more proper Component type

### Patch Changes

- Updated dependencies [51d4769]
  - @knime/components@1.32.0
  - @knime/styles@1.10.0

## 2.1.2

### Patch Changes

- Updated dependencies [11332fe]
  - @knime/styles@1.9.0
  - @knime/components@1.31.2

## 2.1.1

### Patch Changes

- Updated dependencies [88df4da]
  - @knime/styles@1.8.0
  - @knime/components@1.31.1

## 2.1.0

### Minor Changes

- 493c9f0: TS improvements
  - removed namespaces: UIExtensionPushEvents
  - replaced any with fitting type or unknown/never

### Patch Changes

- Updated dependencies [493c9f0]
  - @knime/components@1.31.0

## 2.0.51

### Patch Changes

- Updated dependencies [8e21558]
  - @knime/styles@1.7.0
  - @knime/components@1.30.1

## 2.0.50

### Patch Changes

- Updated dependencies
  - @knime/components@1.30.0

## 2.0.49

### Patch Changes

- Updated dependencies [04258bf]
  - @knime/styles@1.6.0
  - @knime/components@1.29.2

## 2.0.48

### Patch Changes

- Updated dependencies [2a0a9fd]
  - @knime/components@1.29.1

## 2.0.47

### Patch Changes

- Updated dependencies [5c1e0fa]
  - @knime/components@1.29.0

## 2.0.46

### Patch Changes

- Updated dependencies [8e0a90a]
  - @knime/styles@1.5.0
  - @knime/components@1.28.7

## 2.0.45

### Patch Changes

- 294d416: Call teardown of UIExtShadowApp on unmount. Fixes possible memory leaks.

## 2.0.44

### Patch Changes

- Updated dependencies [64c9333]
  - @knime/components@1.28.5

## 2.0.43

### Patch Changes

- Updated dependencies [04ed897]
  - @knime/components@1.28.4

## 2.0.42

### Patch Changes

- Updated dependencies [33f0fa5]
  - @knime/components@1.28.3

## 2.0.41

### Patch Changes

- Updated dependencies [9757f66]
  - @knime/components@1.28.2

## 2.0.40

### Patch Changes

- Updated dependencies [4b9650c]
  - @knime/components@1.28.1

## 2.0.39

### Patch Changes

- Updated dependencies [7b84a54]
  - @knime/components@1.28.0

## 2.0.38

### Patch Changes

- Updated dependencies [e88dcfd]
  - @knime/components@1.27.0

## 2.0.37

### Patch Changes

- Updated dependencies [549a7f8]
  - @knime/components@1.26.0

## 2.0.36

### Patch Changes

- Updated dependencies [751cb18]
  - @knime/components@1.25.4

## 2.0.35

### Patch Changes

- Updated dependencies [dea510f]
  - @knime/components@1.25.3

## 2.0.34

### Patch Changes

- Updated dependencies [e177076]
  - @knime/components@1.25.2

## 2.0.33

### Patch Changes

- Updated dependencies [a5c359f]
  - @knime/components@1.25.1

## 2.0.32

### Patch Changes

- Updated dependencies [2d42337]
  - @knime/components@1.25.0

## 2.0.31

### Patch Changes

- Updated dependencies [6e1501f]
  - @knime/styles@1.4.0
  - @knime/components@1.24.2

## 2.0.30

### Patch Changes

- Updated dependencies [803a5b9]
  - @knime/components@1.24.1

## 2.0.29

### Patch Changes

- Updated dependencies [8582dc1]
  - @knime/components@1.24.0

## 2.0.28

### Patch Changes

- Updated dependencies [9ccf905]
  - @knime/components@1.23.0

## 2.0.27

### Patch Changes

- Updated dependencies [93103f5]
  - @knime/components@1.22.2

## 2.0.26

### Patch Changes

- Updated dependencies [4cc131a]
  - @knime/components@1.22.1

## 2.0.25

### Patch Changes

- Updated dependencies [ef010ff]
  - @knime/components@1.22.0

## 2.0.24

### Patch Changes

- @knime/components@1.21.1

## 2.0.23

### Patch Changes

- Updated dependencies [02c95c8]
  - @knime/components@1.21.0

## 2.0.22

### Patch Changes

- Updated dependencies [6c99c22]
  - @knime/components@1.20.0

## 2.0.21

### Patch Changes

- Updated dependencies [5f3ca36]
  - @knime/components@1.19.4

## 2.0.20

### Patch Changes

- Updated dependencies [b30c0b8]
  - @knime/components@1.19.3

## 2.0.19

### Patch Changes

- Updated dependencies [a674c18]
  - @knime/components@1.19.2

## 2.0.18

### Patch Changes

- Updated dependencies [0932714]
  - @knime/components@1.19.1

## 2.0.17

### Patch Changes

- Updated dependencies [4aa2490]
  - @knime/components@1.19.0

## 2.0.16

### Patch Changes

- Updated dependencies
  - @knime/components@1.18.8

## 2.0.15

### Patch Changes

- Updated dependencies [992a9e4]
  - @knime/components@1.18.7

## 2.0.14

### Patch Changes

- Updated dependencies [3fd06dd]
  - @knime/components@1.18.6

## 2.0.13

### Patch Changes

- Updated dependencies [59af778]
  - @knime/components@1.18.5

## 2.0.12

### Patch Changes

- Updated dependencies [b10e3aa]
  - @knime/styles@1.3.1
  - @knime/components@1.18.4

## 2.0.11

### Patch Changes

- Updated dependencies
  - @knime/components@1.18.3

## 2.0.10

### Patch Changes

- Updated dependencies
  - @knime/components@1.18.2

## 2.0.9

### Patch Changes

- Updated dependencies [3141407]
  - @knime/components@1.18.1

## 2.0.8

### Patch Changes

- Updated dependencies [976dba9]
- Updated dependencies [976dba9]
  - @knime/components@1.18.0
  - @knime/styles@1.3.0

## 2.0.7

### Patch Changes

- c1766a5: Add view for blocking errors

## 2.0.6

### Patch Changes

- Updated dependencies [1f2459e]
  - @knime/components@1.17.0

## 2.0.5

### Patch Changes

- Updated dependencies [de31f24]
  - @knime/components@1.16.0

## 2.0.4

### Patch Changes

- Updated dependencies
  - @knime/components@1.15.6

## 2.0.3

### Patch Changes

- e392961: Version bump of v-calendar in the pnpm-lock which should have been part of a previous version bump
- Updated dependencies [e392961]
  - @knime/components@1.15.5

## 2.0.2

### Patch Changes

- Updated dependencies [ec12810]
  - @knime/components@1.15.4

## 2.0.1

### Patch Changes

- Updated dependencies [c1bb1a7]
  - @knime/components@1.15.3

## 2.0.0

### Major Changes

- 52708e6: Moved UIExtension API definition from @knime/ui-extension-service to @knime/ui-extension-renderer. Breaking changes for embedders (i.e. consumers of knime/ui-extension-renderer): The vue components are available under "@knime/ui-extension-renderer/vue" now (along with all necessary types). For ui extensions (i.e. consumerts of @knime/ui-extension-service): The API no longer uses Enums but instead union types of concrete strings.

## 1.3.9

### Patch Changes

- f94dddb: Handle async components to allow reactivity while wrapping in higher order components
- Updated dependencies [f94dddb]
  - @knime/components@1.15.2

## 1.3.8

### Patch Changes

- Updated dependencies [03f69d0]
  - @knime/components@1.15.1

## 1.3.7

### Patch Changes

- Updated dependencies [ea2bc0b]
  - @knime/components@1.15.0
  - @knime/styles@1.2.0

## 1.3.6

### Patch Changes

- Updated dependencies [eabff98]
  - @knime/components@1.14.0

## 1.3.5

### Patch Changes

- Updated dependencies [4f06376]
  - @knime/components@1.13.1

## 1.3.4

### Patch Changes

- Updated dependencies [1787fe5]
  - @knime/components@1.13.0

## 1.3.3

### Patch Changes

- @knime/components@1.12.3

## 1.3.2

### Patch Changes

- Updated dependencies [7765daf]
  - @knime/components@1.12.2

## 1.3.1

### Patch Changes

- d58ea81: Fix direct import to prevent typescript error
- Updated dependencies [d58ea81]
  - @knime/ui-extension-service@1.2.1
  - @knime/components@1.12.1

## 1.3.0

### Minor Changes

- 893d560: Add IntervalInput component for setting either date or time intervals

### Patch Changes

- Updated dependencies [893d560]
  - @knime/ui-extension-service@1.2.0
  - @knime/components@1.12.0

## 1.2.1

### Patch Changes

- Updated dependencies [9fa8163]
  - @knime/components@1.11.1

## 1.2.0

### Minor Changes

- f51877c: Change UI Extension Alert API to expose more details to the embedder

### Patch Changes

- Updated dependencies [f51877c]
  - @knime/ui-extension-service@1.1.0

## 1.1.48

### Patch Changes

- Updated dependencies [5b0167e]
  - @knime/components@1.11.0

## 1.1.47

### Patch Changes

- Updated dependencies [c0fc6a3]
  - @knime/components@1.10.0

## 1.1.46

### Patch Changes

- Updated dependencies [14cc92c]
  - @knime/components@1.9.3

## 1.1.45

### Patch Changes

- Updated dependencies [ecf7936]
  - @knime/components@1.9.2

## 1.1.44

### Patch Changes

- Updated dependencies [c5069f0]
- Updated dependencies [f21a042]
  - @knime/ui-extension-service@1.0.2
  - @knime/components@1.9.1

## 1.1.43

### Patch Changes

- Updated dependencies [2c648a8]
  - @knime/components@1.9.0

## 1.1.42

### Patch Changes

- Updated dependencies [15a4479]
  - @knime/components@1.8.2

## 1.1.41

### Patch Changes

- Updated dependencies [3b80728]
  - @knime/components@1.8.1

## 1.1.40

### Patch Changes

- Updated dependencies [ea959e0]
- Updated dependencies [eb4729f]
- Updated dependencies [ea959e0]
- Updated dependencies [ea959e0]
  - @knime/components@1.8.0

## 1.1.39

### Patch Changes

- Updated dependencies [efdbcc0]
  - @knime/components@1.7.4

## 1.1.38

### Patch Changes

- Updated dependencies [3a67b9a]
  - @knime/components@1.7.3

## 1.1.37

### Patch Changes

- Updated dependencies [3c33e6c]
  - @knime/components@1.7.2

## 1.1.36

### Patch Changes

- Updated dependencies
  - @knime/styles@1.1.1
  - @knime/components@1.7.1

## 1.1.35

### Patch Changes

- Updated dependencies [4ade605]
  - @knime/components@1.7.0

## 1.1.34

### Patch Changes

- Updated dependencies
  - @knime/components@1.6.1

## 1.1.33

### Patch Changes

- Updated dependencies [29856fd]
  - @knime/ui-extension-service@1.0.1

## 1.1.32

### Patch Changes

- Updated dependencies [a8eebec]
  - @knime/components@1.6.0

## 1.1.31

### Patch Changes

- Updated dependencies [64039e4]
  - @knime/components@1.5.2

## 1.1.30

### Patch Changes

- Updated dependencies
  - @knime/components@1.5.1

## 1.1.29

### Patch Changes

- Updated dependencies [86327c6]
- Updated dependencies [e11d91e]
- Updated dependencies [9d19c8a]
  - @knime/ui-extension-service@1.0.0
  - @knime/components@1.5.0

## 1.1.28

### Patch Changes

- Updated dependencies [c12d135]
  - @knime/components@1.4.5

## 1.1.27

### Patch Changes

- 9c30746: Add data value view methods to API layer
- Updated dependencies [e5fff5a]
- Updated dependencies [9364d3a]
  - @knime/components@1.4.4

## 1.1.26

### Patch Changes

- Updated dependencies [285389a]
  - @knime/components@1.4.3

## 1.1.25

### Patch Changes

- Updated dependencies [8433348]
  - @knime/components@1.4.2

## 1.1.24

### Patch Changes

- Updated dependencies [36f4ccb]
  - @knime/components@1.4.1

## 1.1.23

### Patch Changes

- Updated dependencies [29bfef4]
  - @knime/components@1.4.0

## 1.1.22

### Patch Changes

- Updated dependencies [df2caa5]
  - @knime/styles@1.1.0
  - @knime/components@1.3.4

## 1.1.21

### Patch Changes

- Updated dependencies [80502ce]
  - @knime/components@1.3.3

## 1.1.20

### Patch Changes

- Updated dependencies [99dd829]
  - @knime/components@1.3.2

## 1.1.19

### Patch Changes

- Updated dependencies [c642514]
- Updated dependencies [c642514]
  - @knime/components@1.3.1

## 1.1.18

### Patch Changes

- Updated dependencies [fad6298]
  - @knime/components@1.3.0

## 1.1.17

### Patch Changes

- Updated dependencies [5beafff]
  - @knime/components@1.2.7

## 1.1.16

### Patch Changes

- Updated dependencies
  - @knime/styles@1.0.11
  - @knime/components@1.2.6

## 1.1.15

### Patch Changes

- Updated dependencies [337e26b]
  - @knime/components@1.2.5
  - @knime/styles@1.0.10

## 1.1.14

### Patch Changes

- Updated dependencies [7762ab2]
  - @knime/components@1.2.4

## 1.1.13

### Patch Changes

- Updated dependencies [e63edc9]
  - @knime/components@1.2.3

## 1.1.12

### Patch Changes

- Updated dependencies [7fe461f]
  - @knime/components@1.2.2

## 1.1.11

### Patch Changes

- Updated dependencies [e114a57]
  - @knime/components@1.2.1
  - @knime/styles@1.0.9

## 1.1.10

### Patch Changes

- Updated dependencies [0fd52b2]
  - @knime/components@1.2.0

## 1.1.9

### Patch Changes

- Updated dependencies [3e2c166]
- Updated dependencies [89e6afa]
  - @knime/styles@1.0.8
  - @knime/components@1.1.10

## 1.1.8

### Patch Changes

- Updated dependencies [2f39d7f]
  - @knime/components@1.1.9

## 1.1.7

### Patch Changes

- Updated dependencies [4c5b04f]
  - @knime/components@1.1.8

## 1.1.6

### Patch Changes

- Updated dependencies [bb78d4a]
  - @knime/components@1.1.7

## 1.1.5

### Patch Changes

- Updated dependencies [24fe1ac]
  - @knime/components@1.1.6

## 1.1.4

### Patch Changes

- Updated dependencies [0703852]
  - @knime/components@1.1.5

## 1.1.3

### Patch Changes

- Updated dependencies [0dfd63d]
  - @knime/components@1.1.4

## 1.1.2

### Patch Changes

- Updated dependencies [9f80e7f]
  - @knime/styles@1.0.7
  - @knime/components@1.1.3

## 1.1.1

### Patch Changes

- Updated dependencies [6b380fb]
  - @knime/components@1.1.2

## 1.1.0

### Minor Changes

- Rename package from @knime/ui-extensions-renderer to @knime/ui-extension-renderer

## 1.0.20

### Patch Changes

- Updated dependencies [1bec85f]
  - @knime/styles@1.0.6
  - @knime/components@1.1.1

## 1.0.19

### Patch Changes

- 0d185ea: address issue in subdependency
- Updated dependencies [7b8c18f]
- Updated dependencies [0d185ea]
  - @knime/components@1.1.0
  - @knime/styles@1.0.5

## 1.0.18

### Patch Changes

- Updated dependencies [63f2b55]
  - @knime/styles@1.0.4
  - @knime/components@1.0.16

## 1.0.17

### Patch Changes

- fed323e: Add 'name' property to all components utilizing Options API. This is necessary to properly stub components in unit tests using Vue Test Utils.
- Updated dependencies [fed323e]
  - @knime/components@1.0.15

## 1.0.16

### Patch Changes

- Updated dependencies [b542f53]
  - @knime/components@1.0.14

## 1.0.15

### Patch Changes

- Updated dependencies
  - @knime/components@1.0.13

## 1.0.14

### Patch Changes

- 289e2b3: update ui-extension-service dependency version

## 1.0.13

### Patch Changes

- Updated dependencies [15a0549]
  - @knime/styles@1.0.3
  - @knime/components@1.0.12

## 1.0.12

### Patch Changes

- Updated dependencies [86c6ca6]
- Updated dependencies [90424b2]
- Updated dependencies [4de967c]
  - @knime/components@1.0.11
  - @knime/styles@1.0.2

## 1.0.11

### Patch Changes

- 5d827df: Update @knime/ui-extension-service dependency to 0.36.0

## 1.0.10

### Patch Changes

- 1ae1f1d: Update @knime/ui-extension-service dependency to 0.35.0
- Updated dependencies [9044ad2]
  - @knime/components@1.0.10

## 1.0.9

### Patch Changes

- Updated dependencies [8d1c239]
  - @knime/components@1.0.9

## 1.0.8

### Patch Changes

- @knime/components@1.0.8

## 1.0.7

### Patch Changes

- Updated dependencies [e48ef4d]
  - @knime/components@1.0.7

## 1.0.6

### Patch Changes

- Updated dependencies [63cf961]
  - @knime/styles@1.0.1
  - @knime/components@1.0.6

## 1.0.5

### Patch Changes

- b2c9869: fix inconsistent consola versions
- Updated dependencies [a087e42]
- Updated dependencies [b2c9869]
  - @knime/components@1.0.5

## 1.0.4

### Patch Changes

- Updated dependencies
  - @knime/components@1.0.4

## 1.0.3

### Patch Changes

- Updated dependencies [d8340c6]
- Updated dependencies [2d43ad8]
- Updated dependencies [deed6b1]
- Updated dependencies [34248af]
  - @knime/components@1.0.3

## 1.0.2

### Patch Changes

- @knime/components@1.0.2

## 1.0.1

### Patch Changes

- Updated dependencies [b311cae]
- Updated dependencies [a40d582]
  - @knime/components@1.0.1
