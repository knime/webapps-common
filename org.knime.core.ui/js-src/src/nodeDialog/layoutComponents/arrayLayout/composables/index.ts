import Provided from "@/nodeDialog/types/provided";
import inject from "@/nodeDialog/utils/inject";
import { provide } from "vue";

export const addIndexToStateProviders = (indexId: string) => {
  const injectionKey = "addStateProviderListener";
  const addStateProviderListener = inject(injectionKey);

  const wrapperWithIndex: Provided[typeof injectionKey] = (
    { id, indexIds = [] },
    callback,
  ) =>
    addStateProviderListener(
      {
        id,
        indexIds: [indexId, ...indexIds],
      },
      callback,
    );

  provide(injectionKey, wrapperWithIndex);
};

export const addIndexToTriggers = (indexId: string) => {
  const injectionKey = "trigger";
  const trigger = inject(injectionKey);

  const wrapperWithIndex: Provided[typeof injectionKey] = ({
    id,
    indexIds = [],
  }) =>
    trigger({
      id,
      indexIds: [indexId, ...indexIds],
    });

  provide(injectionKey, wrapperWithIndex);
};
