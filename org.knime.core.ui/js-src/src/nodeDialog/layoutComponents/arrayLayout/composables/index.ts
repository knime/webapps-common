import Provided from "@/nodeDialog/types/provided";
import inject from "@/nodeDialog/utils/inject";
import { provide } from "vue";

export const addIndexToStateProviders = (index: number) => {
  const injectionKey = "addStateProviderListener";
  const addStateProviderListener = inject(injectionKey);

  const wrapperWithIndex: Provided[typeof injectionKey] = (
    { id, indices = [] },
    callback,
  ) =>
    addStateProviderListener(
      {
        id,
        indices: [...indices, index],
      },
      callback,
    );

  provide(injectionKey, wrapperWithIndex);
};

export const addIndexToTriggers = (index: number) => {
  const injectionKey = "trigger";
  const addStateProviderListener = inject(injectionKey);

  const wrapperWithIndex: Provided[typeof injectionKey] = ({
    id,
    indices = [],
  }) =>
    addStateProviderListener({
      id,
      indices: [...indices, index],
    });

  provide(injectionKey, wrapperWithIndex);
};
