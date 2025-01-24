import { type UploadManagerNS } from "@knime/utils";
import type { UploadItem } from "./types";
type UseUploadManagerOptions = Omit<UploadManagerNS.UploaderConfig, "onProgress">;
/**
 * This composable wraps the `uploadManager` utility from
 * `@knime/utils` in order to provide reactive state that works seamlessly
 * in a Vue component
 *
 * The reactive state returned (`uploadItems`) will update whenever the progress
 * or status of each item being uploaded changes
 */
export declare const useUploadManager: (options: UseUploadManagerOptions) => {
    uploadState: import("vue").Ref<Record<string, UploadItem & {
        parentId: string;
    }>>;
    hasPendingUploads: import("vue").ComputedRef<boolean>;
    totalPendingUploads: import("vue").ComputedRef<number>;
    start: (parentId: string, uploadPayload: Array<{
        uploadId: string;
        file: File;
    }>) => Promise<void>;
    cancel: (uploadId: string) => void;
    canCancel: (uploadId: string) => boolean;
    removeItem: (uploadId: string) => void;
    resetState: () => void;
    setFailed: (uploadId: string, error: Error) => void;
};
export {};
