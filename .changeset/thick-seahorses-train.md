---
"@knime/components": minor
---

- Refactor: `ProgressItem` component
  - Reworked component to make it more general-purpose, taking props that only
    consider rendering and removing coupling to the specific upload use-case
  - Improve behavior of progressbar. Now, showing/hiding the progress bar doesn't
    cause the content of the ProgressItem to jump
- Refactor: `ProgressList` component
  - Reworked to be a very minimal component, just handling minimal styles for
    `ProgressItem`s rendered in the default slot
- Add: `UploadProgressPanel` component
  - Specific component tailor-made for the upload use-case. Makes use of `ProgressItem`s
- Add: `useUploadManager` composable
  - composable that makes use of the `uploadManager` utility and provides
    reactive state to track uploads
