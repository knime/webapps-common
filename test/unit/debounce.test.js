/* eslint-disable no-magic-numbers */
import debounce from '~/util/debounce';

jest.useFakeTimers();

describe('debounce', () => {
    let method = jest.fn();

    it('debounces many calls to a few', () => {
        const debouncedMethod = debounce(method, 100);

        debouncedMethod();
        debouncedMethod();
        debouncedMethod();
        debouncedMethod();

        expect(method).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(10);
        expect(method).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(20);
        expect(method).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(300);
        expect(method).toHaveBeenCalledTimes(2);
    });
});
