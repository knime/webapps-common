/* eslint-disable no-console */

const methods = ['log', 'error', 'warn'];

/**
 * Helper function to run code suppressing all console output
 * @param {Function} f The function to run. Can be async.
 * @returns {any} The original function's return value
 */
export default f => {
    let originals = methods.map(method => console[method]);
    methods.forEach(method => { console[method] = () => {}; });

    let originalConsola;
    if (global.consola) {
        originalConsola = global.consola;
        global.consola = consola.create({
            level: -1
        });
    }

    const restoreOriginals = () => {
        methods.forEach((method, i) => { console[method] = originals[i]; });
        if (originalConsola) {
            global.consola = originalConsola;
        }
    };

    if (f.constructor.name === 'AsyncFunction') {
        // async
        return f().finally(restoreOriginals);
    } else {
        // sync
        try {
            return f();
        } catch (e) {
            throw e;
        } finally {
            restoreOriginals();
        }
    }
};
