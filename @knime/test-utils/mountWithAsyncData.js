import { mount, shallowMount } from '@vue/test-utils';

let wrapInAsyncData = method => async (component, context, options) => {
    if (!component.asyncData && !component.fetch) {
        return method(component, options);
    }

    // setup spies on redirect and error in order to interrupt mounting
    let redirectSpy, errorSpy, originalRedirect, originalError;
    if (context.redirect) {
        // jest.spyOn() does not seem to work on spies
        originalRedirect = context.redirect;
        redirectSpy = jest.fn(originalRedirect);
        context.redirect = redirectSpy;
    }
    if (context.error) {
        originalError = context.error;
        errorSpy = jest.fn(originalError);
        context.error = errorSpy;
    }

    component = { ...component }; // clone original config object to avoid pollution

    if (component.asyncData) {
        // call asyncData
        let defaultData = component.data ? component.data() : {};
        let asyncData = await component.asyncData(context);

        // check if redirect() or error() was called
        let canceled = false;
        if (redirectSpy) {
            canceled = canceled || redirectSpy.mock.calls.length > 0;
            context.redirect = originalRedirect;
        }
        if (errorSpy) {
            canceled = canceled || errorSpy.mock.calls.length > 0;
            context.error = originalError;
        }
        if (canceled) {
            return null;
        }

        // merge asyncData with original data
        component.data = function () {
            return {
                ...defaultData,
                ...asyncData
            };
        };
    }

    if (component.fetch) {
        // call fetch
        await component.fetch(context);

        // check if redirect() or error() was called
        let canceled = false;
        if (redirectSpy) {
            canceled = canceled || redirectSpy.mock.calls.length > 0;
            context.redirect = originalRedirect;
        }
        if (errorSpy) {
            canceled = canceled || errorSpy.mock.calls.length > 0;
            context.error = originalError;
        }
        if (canceled) {
            return null;
        }
    }


    return method(component, options);
};

const mountWithAsyncData = wrapInAsyncData(mount);
const shallowMountWithAsyncData = wrapInAsyncData(shallowMount);

export {
    mountWithAsyncData,
    shallowMountWithAsyncData
};
