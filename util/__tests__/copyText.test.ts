import { describe, it, expect, beforeAll, vi } from 'vitest';

import { copyText } from '../copyText';

describe('copyText', () => {
    beforeAll(() => {
        document.execCommand = vi.fn();
    });

    it('copies text', () => {
        const text = '/bla/foo/clap';
        copyText(text);
        expect(document.execCommand).toHaveBeenCalledWith('copy');
    });
});
