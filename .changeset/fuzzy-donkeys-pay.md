---
"@knime/ui-extension-renderer": major
"@knime/ui-extension-service": major
---

Moved UIExtension API definition from @knime/ui-extension-service to @knime/ui-extension-renderer. Breaking changes for embedders (i.e. consumers of knime/ui-extension-renderer): The vue components are available under "@knime/ui-extension-renderer/vue" now (along with all necessary types). For ui extensions (i.e. consumerts of @knime/ui-extension-service): The API no longer uses Enums but instead union types of concrete strings.
