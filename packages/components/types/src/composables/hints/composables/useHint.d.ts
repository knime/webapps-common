import { type MaybeRef, type Ref } from "vue";
import type { HintConfiguration, HintState, MaybeElement } from "../types";
type UseHintSetupOptions = {
    /** the hints */
    hints: Record<string, HintConfiguration>;
    /** key for this hint instance */
    storageKey: string;
    /** user ID used as identifier for the local storage */
    uniqueUserId: MaybeRef<string>;
    /** skip all hints (if there is no session for example) */
    skipHints: MaybeRef<boolean>;
    /** callback function to retrieve remote hint states */
    getRemoteHintState: (storageKey: string) => Promise<HintState>;
    /** callback function to set remote hint states */
    setRemoteHintState: (storageKey: string, state: HintState) => Promise<boolean>;
};
export declare const setupHints: ({ hints, uniqueUserId, storageKey, skipHints, getRemoteHintState, setRemoteHintState, }: Partial<UseHintSetupOptions>, hintSetupId?: string) => void;
export declare const useHint: ({ hintSetupId }?: {
    hintSetupId?: string | undefined;
}) => {
    isCompleted: (hintId: string) => boolean;
    isAllSkipped: Readonly<Ref<boolean>>;
    createHint: ({ hintId, referenceSelector, referenceElement, isVisibleCondition, }: {
        hintId: string;
        /** custom selector - takes precedence over the configured one */
        referenceSelector?: string;
        /** element reference - if given this is used over any selector */
        referenceElement?: Ref<MaybeElement>;
        isVisibleCondition?: Ref<boolean>;
    }) => void;
    getCompleteHintComponentCallback: (hintId: string) => () => void;
    completeHintWithoutComponent: (hintId: string) => void;
};
export {};
