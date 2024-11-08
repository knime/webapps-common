import type { Placement } from "@floating-ui/vue";

export const sideAndAlignToPlacement = (
  side?: "top" | "right" | "bottom" | "left",
  align?: "start" | "center" | "end",
) => {
  const sideWithFallback = side ?? "bottom";

  if (!align || align === "center") {
    return sideWithFallback as Placement;
  }
  return `${sideWithFallback}-${align}` as Placement;
};
