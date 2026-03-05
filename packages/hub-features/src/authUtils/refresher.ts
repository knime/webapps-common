import { navigateToLogout } from "./client";
import { logger } from "./logger";
import { AUTH_SERVICE_PATH } from "./shared";
import type { RefresherOptions } from "./types";

const REFRESH_BUFFER = 10;
/**
 * Subtracts a random noise value from the ttl to refresh the token before it actually expires.
 *
 * @param {number}  ttlSeconds - time-to-live (TTL) in seconds
 */
const subtractRandomNoise = (ttlSeconds: number) => {
  const randomBuffer = Math.random() * (REFRESH_BUFFER / 2); // NOSONAR using random numbers is safe here
  return Math.floor((ttlSeconds - REFRESH_BUFFER - randomBuffer) * 1000);
};

let timeout: number | NodeJS.Timeout;

/**
 * Start proactively refreshing the token before it expires.
 */
export const startRefresher = (options: RefresherOptions = {}) => {
  logger().debug("Starting token refresher");

  globalThis.clearTimeout(timeout);

  const fetchData = async () => {
    try {
      const response = await fetch(`${AUTH_SERVICE_PATH}/refresh`);

      if (!response.ok) {
        throw new Error(`Error during auth refresh: ${response.status}`);
      }

      options?.onRefreshComplete?.();
      const { expiry } = await response.json();

      const msUntilRefresh = subtractRandomNoise(expiry);

      logger().debug(
        `Token is valid. Expires in ${expiry}s, refreshing in ${msUntilRefresh / 1000}s`,
      );

      timeout = globalThis.setTimeout(() => {
        // eslint-disable-next-line no-void
        void fetchData();
      }, msUntilRefresh);
    } catch (error) {
      logger().warn(`Token refresh failed: ${error}, logging out`);
      navigateToLogout({ wdywtg: "/?authError=refresh" });
    }
  };

  // eslint-disable-next-line no-void
  void fetchData();
};

export const stopRefresher = () => {
  if (timeout !== undefined) {
    logger().info("Stopping auth refresh timer");
    globalThis.clearTimeout(timeout);
  }
};
