import type { FunctionalComponent, SVGAttributes } from "vue";

import type { PillVariant } from "../Pill/Pill.vue";

export type ProgressItemProps = {
  id: string;
  title: string;
  subtitle?: string;
  progress?: number;
  statusPill?: {
    text: string;
    variant: PillVariant;
    icon?: FunctionalComponent<SVGAttributes>;
    tooltip?: string;
  };
};
