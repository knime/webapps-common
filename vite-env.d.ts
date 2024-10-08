/// <reference types="@knime/utils/globals.d.ts" />
/// <reference types="@knime/styles/config/svg.d.ts" />
/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

interface ImportMeta {
  glob: (
    pattern: string,
    options?: { eager?: boolean },
  ) => Record<string, { result: object }>;
}
