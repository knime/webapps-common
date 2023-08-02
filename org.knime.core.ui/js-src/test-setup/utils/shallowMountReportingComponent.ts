import { shallowMount } from '@vue/test-utils';
import { ReportingService } from '@knime/ui-extension-service';
import { vi } from 'vitest';

export default (component: any, isReport: boolean = false) => {
    const setRenderCompleted = vi.fn();
    // eslint-disable-next-line no-extra-parens
    (ReportingService as any).mockImplementation((knimeService) => ({
        isReportingActive: () => knimeService.isReport,
        setRenderCompleted
    }));
    const wrapper = shallowMount(component, {
        global: {
            provide: {
                getKnimeService: () => ({ isReport })
            }
        }
    });
    return { wrapper, setRenderCompleted };
};
