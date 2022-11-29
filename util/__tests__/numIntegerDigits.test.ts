/* eslint-disable no-magic-numbers */
import { describe, it, expect } from 'vitest';

import numIntegerDigits from '../numIntegerDigits';

describe('numIntegerDigits.js', () => {
    it('counts integer places of number', () => {
        expect(numIntegerDigits(457812)).toStrictEqual(6);
        expect(numIntegerDigits(-47812)).toStrictEqual(5);
        expect(numIntegerDigits(-47812.343)).toStrictEqual(5);
        expect(numIntegerDigits(47812.343)).toStrictEqual(5);
        expect(numIntegerDigits(0)).toStrictEqual(1);
        expect(numIntegerDigits(Infinity)).toStrictEqual(Infinity);
        expect(numIntegerDigits(Number.MAX_SAFE_INTEGER)).toStrictEqual(16);
        expect(numIntegerDigits(Number.MIN_SAFE_INTEGER)).toStrictEqual(16);
    });
});
