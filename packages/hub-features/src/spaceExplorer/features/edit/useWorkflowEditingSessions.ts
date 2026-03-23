import {
  type ComputedRef,
  type FilterConfig,
  computed,
  onMounted,
  reactive,
  useNuxtApp,
  watch,
} from "#imports";
import type { SessionType } from "#shared/repositoryDefinition/session";
import { chunk } from "lodash-es";

import { useSessionRepository } from "~/__shared/repository/sessionsRepository";

export type EditSession =
  // no sessions were loaded
  | { state: "unchecked" }
  // locked by someone else because its edited
  | {
      state: "locked";
      sessionId: string;
      workflowId: string;
      creator: string;
      type: SessionType;
    }
  // free to edit
  | { state: "free" };

type UseSessionsForWorkflowIdsOptions = {
  canSubscribe: ComputedRef<boolean>;
  workflowIds: ComputedRef<string[]>;
  subscribeConfig: {
    scope: string;
    filters?: FilterConfig;
  };
};

/**
 * Composable to check for existing editing sessions for the given workflows
 */
export const useSessionsForWorkflowIds = ({
  canSubscribe,
  workflowIds,
  subscribeConfig,
}: UseSessionsForWorkflowIdsOptions) => {
  const activeSessions = reactive(new Map<string, EditSession>());
  const workflowIdsFilter = computed(() => workflowIds.value.join(","));

  /**
   * Gets the existing sessions (if any) for the given workflow ids.
   * For validation purposes, if the total ids exceed a certain amount, there
   * will be multiple requests that send ids in batches to avoid spamming the API
   */
  const fetchSessionsForWorkflowIds = (workflowIds: string[]) => {
    activeSessions.clear();

    const MAX_WORKFLOWS_QUERY_SIZE = 100;
    const sessionRepository = useSessionRepository();
    const batches = chunk(workflowIds, MAX_WORKFLOWS_QUERY_SIZE);

    workflowIds.forEach((id) => activeSessions.set(id, { state: "unchecked" }));

    const promises = batches.map((batch) =>
      sessionRepository.getEditSessionsForWorkflows(batch).catch((error) => {
        consola.error("Failed to check edit sessions for workflow ids", {
          workflowIds: batch,
          error,
        });

        return [];
      }),
    );

    Promise.all(promises)
      .then((sessionBatches) => {
        // remove the "unchecked" state for every workflow
        workflowIds.forEach((id) => activeSessions.set(id, { state: "free" }));

        // then add the "locked" state for the found sessions
        sessionBatches
          .flatMap((sessions) => sessions)
          .forEach((session) => {
            const {
              id: sessionId = "",
              workflowId = "",
              creator = "",
              type,
            } = session!;

            activeSessions.set(workflowId, {
              state: "locked",
              sessionId,
              workflowId,
              creator,
              type,
            });
          });
      })
      .catch((error) => {
        consola.error("Failed to check edit sessions for workflow ids", {
          workflowIds,
          error,
        });
      });
  };

  onMounted(() => {
    // Only use this onMounted because it's not compatible with SSR
    const { $eventSubscriber } = useNuxtApp();

    watch(
      [canSubscribe, workflowIdsFilter],
      ([canSubscribeValue, workflowIdsFilterValue]) => {
        $eventSubscriber.off({ typeOrId: "sessions" });

        if (!canSubscribeValue || !workflowIdsFilterValue) {
          return;
        }

        activeSessions.clear();

        $eventSubscriber.on({
          type: "sessions",
          ...subscribeConfig,
          filters: {
            ...subscribeConfig.filters,
            workflowIds: workflowIds.value,
          },
          onMessage: () => {
            fetchSessionsForWorkflowIds(workflowIds.value);
          },
        });

        fetchSessionsForWorkflowIds(workflowIds.value);
      },
      { immediate: true },
    );
  });

  const getSessionByWorkflowId = (workflowId: string) =>
    activeSessions.get(workflowId) ?? { state: "unchecked" };

  return {
    activeSessions: computed(() => [...activeSessions.values()]),
    getSessionByWorkflowId,
  };
};
