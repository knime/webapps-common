export interface HintConfiguration {
  title: string;
  description: string;
  linkText?: string;
  linkHref?: string;
  dependsOn: string[];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export type HintState = {
  completedHints: string[];
  skipAll: boolean;
};
