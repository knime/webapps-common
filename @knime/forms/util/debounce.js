// Use this method to reduce many method calls to a few.
// It's an 'immediate' implementation, so it will call the callback once immediately an then again after the given wait.

export default (callback, wait) => {
    let timer;
    let lastCall = 0;
    return (...args) => {
        clearTimeout(timer);
        const now = Date.now();
        const timeFromLastCall = now - lastCall;

        if (timeFromLastCall > wait) {
            lastCall = now;
            callback(...args);
        } else {
            timer = setTimeout(() => {
                lastCall = now;
                callback(...args);
            }, wait);
        }
    };
};
