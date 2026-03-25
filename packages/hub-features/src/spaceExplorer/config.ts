import type { ToastService } from "@knime/components";

export type GlobalContext = {
  toastService: ToastService;
};

let __globalContext: GlobalContext | undefined;

export const initGlobalContext = (ctx: GlobalContext) => {
  __globalContext = ctx;
};

export const getGlobalContext = () => Object.freeze(__globalContext);
