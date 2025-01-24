import { type MaybeRef } from "vue";
import type { HintState } from "../types";
export declare const initialized: import("vue").Ref<boolean>;
export declare const currentlyVisibleHint: import("vue").Ref<string | null>;
type UseHintStateOptions = {
    storageKey: string;
    uniqueUserId: MaybeRef<string>;
    getRemoteHintState: (storageKey: string) => Promise<HintState>;
    setRemoteHintState: (storageKey: string, state: HintState) => Promise<boolean>;
};
export declare const useHintState: ({ storageKey, uniqueUserId, getRemoteHintState, setRemoteHintState, }: UseHintStateOptions) => {
    initialize: () => Promise<void>;
    isInitialized: Readonly<import("vue").Ref<boolean>>;
    completeHint: (hintId: string) => void;
    completeHintWithoutVisibility: (hintId: string) => void;
    isCompleted: (hintId: string) => boolean;
    isAllSkipped: import("vue").ComputedRef<boolean>;
    setSkipAll: () => void;
    currentlyVisibleHint: import("vue").Ref<string | null>;
    setCurrentlyVisibleHint: (hintId: string | null) => void;
};
export {};
