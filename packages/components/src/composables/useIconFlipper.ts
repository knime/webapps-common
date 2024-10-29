/* eslint-disable no-undefined */
import { type Ref, computed } from "vue";

type UseIconFlipperOptions = {
  active: Ref<boolean>;
  initialRotation?: `${string}deg`;
};

export const useIconFlipper = (options: UseIconFlipperOptions) => {
  const iconFlipStyles = computed(() => {
    const declaration: Partial<CSSStyleDeclaration> = {
      transition: "transform 0.2s linear",
      transform: "scaleY(1)",
    };

    if (options.initialRotation) {
      declaration.rotate = `${options.initialRotation}`;
    }

    const transform = options.active.value ? "scaleY(-1)" : undefined;

    return { ...declaration, transform };
  });

  return { iconFlipStyles };
};
