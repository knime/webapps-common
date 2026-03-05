import { logger } from "./logger";
import { startRefresher } from "./refresher";
import type { AccountInjectorOptions } from "./types";
import { setLoggedInUser, useAuthState } from "./useAuthState";

/**
 * This function does two main things:
 * 1. Fetch the user identity and store it via the auth composable.
 * 2. Start the background refresher which will renew tokens according to the
 *    auth service TTL.
 *
 * Typical usage is from a route middleware for routes that require
 * authentication. See README for a more in-depth example usage
 *
 * @param options AccountInjectorOptions
 * @returns a function that, when called, will load the identity (if needed)
 * and start the token refresher. The returned function will throw if the
 * underlying identity fetch fails.
 */
export function createAccountInjector(options: AccountInjectorOptions) {
  return async () => {
    const { isLoggedIn } = useAuthState();

    if (!isLoggedIn.value) {
      try {
        const identity = await options.getIdentity();

        if (identity) {
          logger().info("Fetched user identity", {
            id: identity.id,
            name: identity.name,
          });

          setLoggedInUser(identity);
          startRefresher({ onRefreshComplete: options.onRefreshComplete });
        } else {
          logger().error("Logged in, but could not retrieve logged in user");
        }
      } catch (e) {
        logger().error(
          "Not logged in, http request interceptor should redirect to login",
          e,
        );
        throw e;
      }
    }
  };
}
