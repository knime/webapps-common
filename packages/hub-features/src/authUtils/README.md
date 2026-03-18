# KNIME® Hub Auth Utils

The auth utils can be used to implement authentication in the hub. The idea is to use them in conjunction with the [knime-hub-auth-rely] service. Please check the service docs for detailed infos about the authentication flow.

[knime-hub-auth-rely]: https://github.com/knime/knime-hub-auth-rely

## Common usage pattern

First you need to setup the account injector. This will make sure that the auth identity information
is fetched on critical authenticated paths. Normally, this means as part of a `vue-router` route guard
or a `Nuxt` middleware.

```ts
/// router.ts
import { authUtils } from "@knime/hub-features";

const setupMainRouteMiddleware = (): NavigationGuard => {
  // 1. First we create the injector. This returns the function that
  // schedules running the token refresher periodically
  const accountRefresher = authUtils.createAccountInjector({
    // `getIdentity` is just a fetch function that hits the API to get the
    // account information; in a nutshell a user `id` and a `name`
    getIdentity,
  });

  // 2. Here we're now returning the _actual_ navigation guard
  return async () => {
    try {
      await accountRefresher();
      return true; // allow navigation
    } catch (error) {
      consola.error("Navigation middleware error", error);
      return false; // cancel navigation
    }
  };
};

const router = createRouter({
  history: createWebHistory(base),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeRouteComponent,
      // 3. Simply setup your middleware for usage
      beforeEnter: [setupMainRouteMiddleware()],

      // 4. A simpler usage could have been
      // beforeEnter: [authUtils.createAccountInjector({ getIdentity })],
    },
  ],
});
```

### Handle auth errors

Another common pattern you'll need is to react to authentication errors (401/403) on your requests. There's different ways
to do this depending on the setup, but it usually revolves around setting up some HTTP request interceptor that runs some
code upon receveing a 401 (and optionally sometimes a 403).

Below is an example of an `ofetch` interceptor and how you would use these utils for such a case

```ts
// interceptor.ts
import { authUtils } from "@knime/hub-features";

export const unauthorizedInterceptor: HttpInterceptor = {
  response: {
    onError: ({ response }) => {
      if (response?.status === 401) {
        // This function performs the redirection automatically.
        authUtils.client.navigateToLogin({ wdywtg: window.location.href });

        throw new Error("Auth failure");
      }
    },
  },
};
```

However, in the above example, the usage of `authUtils.client.navigateToLogin` is client-side code, which uses the `window` object to
redirect. Therefore, this doesn't work on SSR. If you need a server-side redirect, or if you want more control of _how_ you redirect (e.g using Nuxt's `navigateTo` function)
you can instead call another util which returns the login url and you can perform the redirection on your own:

```ts
// some-file.ts

import { authUtils } from "@knime/hub-features";

const someHandler = () => {
  // ...
  const loginPath = authUtils.paths.login({ wdywtg: to.fullPath });
  return navigateTo(loginPath, {
    external: true,
    redirectCode: TEMPORARY_REDIRECT,
  });

  // ...
};
```

### Accessing auth state

With the middleware in place, you can now reference the auth state in your app by making use of the provided stateful composable:

```ts
/// some-file.ts
import { authUtils } from "@knime/hub-features";

const { loggedInUser, isLoggedIn } = authUtils.useAuthState();
```

This state is immutable and is owned and controlled by the auth refresher internally.

### Stop refreshing the auth token

In addition to the route middleware setup, you might run into cases where you want to stop the refresher manually. For this, simply import the corresponding function and call it:

```ts
import { authUtils } from "@knime/hub-features";

authUtils.stopTokenRefresh();
```
