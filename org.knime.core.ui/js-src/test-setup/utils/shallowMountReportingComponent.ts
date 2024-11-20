import { vi } from "vitest";
import { shallowMount } from "@vue/test-utils";

import { ReportingService } from "@knime/ui-extension-service";

export default (component: any, isReport: boolean = false) => {
  const setRenderCompleted = vi.fn();
  // eslint-disable-next-line no-extra-parens
  (ReportingService as any).mockImplementation(
    ({ isReport }: { isReport: boolean }) => ({
      isReportingActive: () => isReport,
      setRenderCompleted,
    }),
  );
  const wrapper = shallowMount(component, {
    global: {
      provide: {
        getKnimeService: () => ({ isReport }),
      },
    },
  });
  return { wrapper, setRenderCompleted };
};
