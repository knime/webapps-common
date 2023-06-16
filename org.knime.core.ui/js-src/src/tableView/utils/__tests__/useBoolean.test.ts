import { describe, expect, it } from 'vitest';
import useBoolean from '../useBoolean';

describe('useBoolean', () => {
    it('sets initial state to false per default', () => {
        const boolean = useBoolean();
        expect(boolean.state).toBeFalsy();
    });

    it('sets intial state to true if wanted', () => {
        const boolean = useBoolean(true);
        expect(boolean.state).toBeTruthy();
    });

    it('sets state to true', () => {
        const boolean = useBoolean();

        boolean.setTrue();

        expect(boolean.state).toBeTruthy();
    });

    it('sets state to false', () => {
        const boolean = useBoolean(false);

        boolean.setFalse();
        
        expect(boolean.state).toBeFalsy();
    });
});
