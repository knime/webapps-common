export type VideoSource = Array<{ source: string; type: string }>;

export interface HintConfiguration {
  title: string;
  description: string;
  linkText?: string;
  linkHref?: string;
  video?: VideoSource;
  hideButtons?: boolean;
  dependsOn: string[];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export type HintState = {
  completedHints: string[];
  skipAll: boolean;
};
