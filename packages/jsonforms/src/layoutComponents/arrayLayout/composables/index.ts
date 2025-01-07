import { provide } from "vue";

import type { Provided } from "../../../types/provided";
import inject from "../../../utils/inject";

export const addIndexToStateProviders = (indexId: string, index: number) => {
  const injectionKey = "addStateProviderListener";
  const addStateProviderListener = inject(injectionKey);

  const wrapperWithIndex: Provided[typeof injectionKey] = (
    { id, indexIds = [], indices = [] },
    callback,
  ) =>
    addStateProviderListener(
      {
        id,
        indexIds: [indexId, ...indexIds],
        indices: [index, ...indices],
      },
      callback,
    );

  provide(injectionKey, wrapperWithIndex);
};

export const addIndexToTriggers = (indexId: string) => {
  const injectionKeyTrigger = "trigger";
  const trigger = inject(injectionKeyTrigger);

  const wrapperWithIndexTrigger: Provided[typeof injectionKeyTrigger] = ({
    id,
    indexIds = [],
  }) =>
    trigger({
      id,
      indexIds: [indexId, ...indexIds],
    });

  provide(injectionKeyTrigger, wrapperWithIndexTrigger);

  const injectionKeyIsTriggerActive = "isTriggerActive";
  const isTriggerActive = inject(injectionKeyIsTriggerActive);

  const wrapperWithIndexTriggerIsActive: Provided[typeof injectionKeyIsTriggerActive] =
    ({ id, indexIds = [] }) =>
      isTriggerActive({
        id,
        indexIds: [indexId, ...indexIds],
      });

  provide(injectionKeyIsTriggerActive, wrapperWithIndexTriggerIsActive);
};
