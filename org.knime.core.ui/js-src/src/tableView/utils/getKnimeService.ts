import type { KnimeService } from '@knime/ui-extension-service';
import { inject } from 'vue';

export default () => {
    const getKnimeService = (inject('getKnimeService') || (() => null)) as (() => KnimeService);
    return getKnimeService();
};
