type CreateDragGhostsParams = {
    /**
     * The DragStart event that originated the drag
     */
    dragStartEvent: DragEvent;
    /**
     * Whether to display a badge with a count next to the ghost
     */
    badgeCount: number | null;
    /**
     * targets that are selected and for whom ghosts will be created
     */
    selectedTargets: Array<{
        /**
         * Text content to display in each ghost
         */
        textContent: string;
        /**
         * Element itself
         */
        targetEl: HTMLElement;
    }>;
};
type CreateDragGhostsReturnType = {
    /**
     * The added ghosts
     */
    ghosts: Array<HTMLElement>;
    /**
     * A function to remove the ghost when needed. It receives a
     * parameter to determine whether to animate the removal of the ghosts (true by default)
     */
    removeGhosts: (animateOut?: boolean) => void;
    /**
     * A function to replace the ghost element when needed.
     */
    replaceGhostPreview: (params: {
        shouldUseCustomPreview: boolean;
        ghostPreviewEl: HTMLElement;
        opts?: {
            leftOffset?: number;
            topOffset?: number;
        };
    }) => void;
};
/**
 * Creates the drag ghosts for the FileExplorer drag operations
 */
export declare const createDragGhosts: ({ badgeCount, selectedTargets, }: CreateDragGhostsParams) => CreateDragGhostsReturnType;
export {};
