import { ref, type Ref } from "vue";
import type { Toast } from "./types";
import { cloneDeep, uniqueId } from "lodash-es";

export type ToastService = {
  show: (toast: Toast) => string;
  remove: (id: string) => void;
  removeBy: (predicate: (toast: Toast) => boolean) => void;
  autoRemove: () => void;
  toasts: Ref<Toast[]>;
};

export default function useToast(): ToastService {
  const toasts = ref<Toast[]>([]);

  const show = (toast: Toast): string => {
    const clonedToast = cloneDeep(toast);
    if (clonedToast.key) {
      const previousToast = toasts.value.find(
        ({ key }) => clonedToast.key === key,
      );
      if (previousToast) {
        return previousToast.id!;
      }
    }
    clonedToast.id = clonedToast.id
      ? `${clonedToast.id}-${uniqueId()}`
      : uniqueId();
    clonedToast.autoRemove = clonedToast.autoRemove ?? true;
    toasts.value.unshift(clonedToast);

    return clonedToast.id;
  };

  const remove = (id: string): void => {
    toasts.value = toasts.value.filter((toast: Toast) => toast.id !== id);
  };

  const removeBy = (predicate: (toast: Toast) => boolean): void => {
    toasts.value = toasts.value.filter((toast: Toast) => !predicate(toast));
  };

  const autoRemove = (): void => {
    toasts.value = toasts.value.filter((toast: Toast) => !toast.autoRemove);
  };

  return { show, remove, autoRemove, removeBy, toasts };
}
