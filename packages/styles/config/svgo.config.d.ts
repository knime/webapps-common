import svgLoader from "vite-svg-loader";

export type SvgoConfig = Required<
  NonNullable<Parameters<typeof svgLoader>[0]>
>["svgoConfig"];

export const svgoConfig: SvgoConfig;
