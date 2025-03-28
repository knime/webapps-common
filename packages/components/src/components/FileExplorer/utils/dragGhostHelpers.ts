import { animate } from "motion";

import * as knimeColors from "@knime/styles/colors/knimeColors";

const COLORS = {
  dragGhostContainer: {
    background: knimeColors.CornflowerSemi,
    font: knimeColors.CornflowerDark,
  },
  dragGhostBadge: {
    background: knimeColors.Masala,
    font: knimeColors.White,
  },
} as const;

/**
 * Apply styles to given element
 */
const applyStyles = (
  element: HTMLElement,
  styles: Partial<CSSStyleDeclaration>,
): void => {
  Object.entries(styles).forEach(([property, value]) => {
    // @ts-expect-error no implicit any
    element.style[property] = value;
  });
};

/**
 * Creates the element that will be used to display the badge with the count of the total
 * selected items
 * @param {Number} count number to display in the badge
 */
const createGhostBadgeElement = (count: number): HTMLElement => {
  const badge = document.createElement("div");
  const MAX_COUNT = 99;
  badge.innerText = count <= MAX_COUNT ? count.toString() : "99+";
  badge.id = "drag-ghost-badge";

  const badgeStyles: Partial<CSSStyleDeclaration> = {
    background: COLORS.dragGhostBadge.background,
    color: COLORS.dragGhostBadge.font,
    fontSize: "13px",
    lineHeight: "11px",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    right: "-10px",
    top: "-10px",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    padding: "5px",
    pointerEvents: "none",
  };

  applyStyles(badge, badgeStyles);

  return badge;
};

/**
 * Uses an existing svg icon on the `target` element to use as icon for
 * the generated ghost. Returns null if no svg icon can be found in the target
 * @returns  The icon element to add to the ghost
 */
const createGhostIcon = (target: HTMLElement): HTMLElement | null => {
  const originalIcon = target.querySelector("svg");
  if (!originalIcon) {
    return null;
  }

  const iconEl = originalIcon.cloneNode(true) as HTMLElement;
  iconEl.style.width = "20px";
  iconEl.style.height = "20px";
  iconEl.style.marginRight = "10px";
  iconEl.style.stroke = knimeColors.CornflowerDark;

  return iconEl;
};

const applyPositionOffsets = (position: { x: number; y: number }) => {
  return {
    x: position.x + document.documentElement.scrollLeft,
    y: position.y + document.documentElement.scrollTop,
  };
};

type CreateGhostElementParams = {
  /**
   * text to display in the ghost
   */
  textContent: string;
  /**
   * the element being ghosted. it's used to initally position the ghost on the same coordinates
   */
  target: HTMLElement;
  /**
   * whether to add boxShadow styles to the ghost
   */
  addShadow?: boolean;
  /**
   * if specified, will add the badge with this value as a count
   */
  badgeCount?: number | null;
};

const createGhostElement = ({
  textContent,
  target,
  badgeCount,
  addShadow = false,
}: CreateGhostElementParams): { ghost: HTMLElement; badge?: HTMLElement } => {
  const TEXT_SIZE_THRESHOLD = 15;
  const ghost = document.createElement("div");
  ghost.innerText =
    textContent.length > TEXT_SIZE_THRESHOLD
      ? `${textContent.slice(0, TEXT_SIZE_THRESHOLD)}…`
      : textContent;
  ghost.setAttribute("data-id", "drag-ghost");

  const fontSize = getComputedStyle(target).getPropertyValue("font-size");
  const { x, y, width, height } = target.getBoundingClientRect();

  const withOffset = applyPositionOffsets({ x, y });

  const ghostStyles: Partial<CSSStyleDeclaration> = {
    background: COLORS.dragGhostContainer.background,
    color: COLORS.dragGhostContainer.font,

    // use the original target's position to initialize the ghost
    position: "absolute",
    top: `${withOffset.y}px`,
    left: `${withOffset.x}px`,
    width: `${width}px`,
    height: `${height}px`,
    zIndex: "9",

    // make sure the ghost doesn't interfere with the drag
    pointerEvents: "none",

    fontSize,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "0 12px",
    borderRadius: "4px",
    opacity: "1",
    boxShadow: addShadow ? "0px 2px 10px rgba(130, 133, 134, 0.4)" : "initial",
  };

  applyStyles(ghost, ghostStyles);

  const iconEl = createGhostIcon(target);
  if (iconEl) {
    ghost.prepend(iconEl);
  }

  if (badgeCount) {
    const badge = createGhostBadgeElement(badgeCount);
    ghost.appendChild(badge);
    return { ghost, badge };
  }

  return { ghost };
};

/**
 * Returns a function to serve as an event handler to update the ghost's position
 */
const createGhostPositionUpdateHandler =
  (ghosts: Array<HTMLElement>) =>
  ({ clientX, clientY }: DragEvent) => {
    if (clientX === 0 && clientY === 0) {
      return;
    }

    const { x: left, y: top } = applyPositionOffsets({
      x: clientX,
      y: clientY,
    });

    ghosts.forEach((g) => {
      animate(g, { left, top, width: "200px" }, { duration: 0.01 });
    });
  };

let customGhostPreviewElement: HTMLElement | null = null;

const hideCustomGhostPreviewElement = () => {
  if (customGhostPreviewElement) {
    customGhostPreviewElement.style.display = "none";
  }
};

const showCustomGhostPreviewElement = () => {
  if (customGhostPreviewElement) {
    customGhostPreviewElement.style.display = "flex";
  }
};

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
    opts?: { leftOffset?: number; topOffset?: number };
  }) => void;
};

/**
 * Creates the drag ghosts for the FileExplorer drag operations
 */
export const createDragGhosts = ({
  badgeCount = null,
  selectedTargets,
}: CreateDragGhostsParams): CreateDragGhostsReturnType => {
  const ensureCleanState = () => {
    const maybeGhosts = document.querySelectorAll('[data-id="drag-ghost"]');
    if (maybeGhosts.length) {
      maybeGhosts.forEach((el) => el.parentNode?.removeChild(el));
    }
  };

  ensureCleanState();

  // separate the first target and use it to create the badge
  const [firstTarget, ...otherTargets] = selectedTargets;
  const { ghost: firstGhost, badge } = createGhostElement({
    addShadow: true,
    textContent: firstTarget.textContent,
    badgeCount,
    target: firstTarget.targetEl,
  });

  const ghosts = otherTargets.map(({ textContent, targetEl }, index) => {
    const { ghost } = createGhostElement({
      textContent,
      target: targetEl,

      // Don't add shadows when there are more than 2 elements to ghost, since it makes the shadow too dark
      addShadow: index < 2,
    });
    return { ghost, targetEl };
  });

  const allGhosts = [
    { ghost: firstGhost, targetEl: firstTarget.targetEl },
    ...ghosts,
  ];

  // add the ghosts to the document body so that they can be animated and positioned.
  // reverse them first to make sure the first ghost is added last and is displayed at the top
  allGhosts.reverse().forEach(({ ghost }) => {
    document.body.appendChild(ghost);
  });

  const ghostElements = allGhosts.map(({ ghost }) => ghost);

  const updatePosition = createGhostPositionUpdateHandler(ghostElements);

  document.addEventListener("drag", updatePosition);

  const setGhostDisplay =
    (display: string) =>
    ({ ghost }: { ghost: HTMLElement }) => {
      ghost.style.display = display;
    };

  const removeGhosts: CreateDragGhostsReturnType["removeGhosts"] = (
    animateOut = true,
  ) => {
    const removeGhost = ({ ghost }: { ghost: HTMLElement }) => {
      if (!animateOut) {
        ghost.style.display = "none";
      }
      try {
        document.body.removeChild(ghost);
      } catch (_error) {
        // mute exception trying to delete ghost.
        // this could happen if the `removeGhosts` function is called more than once
        // in which case it would result in an exception when attempting to remove
        // an element that no longer exists
      }
      document.removeEventListener("drag", updatePosition);
    };

    hideCustomGhostPreviewElement();

    if (!animateOut) {
      allGhosts.forEach(removeGhost);
      return;
    }

    allGhosts.forEach(({ ghost, targetEl }) => {
      const { x, y, width } = targetEl.getBoundingClientRect();
      if (badge) {
        // hide the badge first
        badge.style.opacity = "0";
      }

      const { x: left, y: top } = applyPositionOffsets({ x, y });
      animate(
        ghost,
        { left, top, width },
        {
          duration: 0.2,
          onComplete: () => {
            removeGhost({ ghost });
            document.removeEventListener("drag", updatePosition);
          },
        },
      );
    });
  };

  const replaceGhostPreview: CreateDragGhostsReturnType["replaceGhostPreview"] =
    ({ shouldUseCustomPreview, ghostPreviewEl, opts = {} }) => {
      customGhostPreviewElement = ghostPreviewEl;

      if (shouldUseCustomPreview) {
        document.removeEventListener("drag", updatePosition);

        showCustomGhostPreviewElement();

        document.addEventListener("drag", (event) => {
          if (!customGhostPreviewElement) {
            return;
          }

          customGhostPreviewElement.style.left = `${
            event.clientX - (opts.leftOffset || 0)
          }px`;
          customGhostPreviewElement.style.top = `${
            event.clientY - (opts.topOffset || 0)
          }px`;
        });

        allGhosts.forEach(setGhostDisplay("none"));
      } else {
        document.addEventListener("drag", updatePosition);

        hideCustomGhostPreviewElement();

        allGhosts.forEach(setGhostDisplay("flex"));
      }
    };

  return { ghosts: ghostElements, removeGhosts, replaceGhostPreview };
};
