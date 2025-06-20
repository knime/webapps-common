---
"@knime/hub-features": patch
---

Fix baseURL handling on ofetch client used by the upload, download and versions features.
Supplying a custom baseURL with trailing slashes now doesn't break these features
