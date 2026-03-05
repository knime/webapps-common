import { logger } from "./logger";
import { buildLoginPath, buildLogoutPath } from "./shared";

/**
 * Navigates to the login path. This function does not work on SSR
 */
export const navigateToLogin = ({ wdywtg }: { wdywtg?: string } = {}) => {
  logger().debug("Navigating to login");
  window.location.href = buildLoginPath({ wdywtg }); // NOSONAR - intended window usage
};

/**
 * Navigates to the logout path. This function does not work on SSR
 */
export const navigateToLogout = ({ wdywtg }: { wdywtg?: string } = {}) => {
  logger().debug("Navigating to logout");
  window.location.href = buildLogoutPath({ wdywtg }); // NOSONAR - intended window usage
};
