<script setup lang="ts">
import { computed } from "vue";

import ShieldIcon from "@knime/styles/img/icons/shield.svg";

import SkeletonItem from "../SkeletonItem/SkeletonItem.vue";
import { resolveNuxtLinkComponent } from "../nuxtComponentResolver";

import AvatarImagePlaceholder from "./AvatarImagePlaceholder.vue";

/**
 * Displays an avatar image as well as complementary text.
 * The text can be either shown below or to the right.
 *
 * The size can be configured via the CSS variable --avatar-size
 */

type AvatarProps = {
  /**
   * The image to show as the avatar. If omitted, a placeholder is used.
   */
  image?: { url?: string | null; altText?: string };
  /**
   * Name that belongs to avatar.
   */
  name?: string;
  /**
   * Additional descriptor that is shown below name.
   */
  descriptor?: string;
  /**
   * Custom tooltip to show on the displayed avatar. By default the name is used.
   */
  tooltip?: string | null;
  /**
   * Show text alongside the avatar.
   */
  showText?: "name" | "placeholder" | "none";
  /**
   * Display avatar and name either vertically or horizontally next to each other.
   */
  layout?: "vertical" | "horizontal";
  /**
   * If a name is shown, controls displaying the "trusted" badge.
   */
  showTrusted?: boolean;
  /**
   * Displays as link if linkUrl is provided.
   * For external link targets pass a config object with `external: true`.
   */
  linkUrl?: string | { url: string; external: boolean } | null;
};

const props = withDefaults(defineProps<AvatarProps>(), {
  name: "",
  descriptor: "",
  tooltip: null,
  showText: "none",
  layout: "vertical",
  image: () => ({}),
  linkUrl: null,
  rootComponent: null,
});

const title = computed(() => props.tooltip || props.name);

const linkUrlConfig = computed(() =>
  typeof props.linkUrl === "string"
    ? {
        url: props.linkUrl,
        external: false,
      }
    : props.linkUrl,
);

const rootComponent = computed(() => {
  if (!linkUrlConfig.value) {
    return "div";
  }

  return linkUrlConfig.value.external ? "a" : resolveNuxtLinkComponent();
});

const rootComponentProps = computed(() => {
  if (!linkUrlConfig.value) {
    return {};
  }

  return {
    [linkUrlConfig.value.external ? "href" : "to"]: linkUrlConfig.value.url,
  };
});
</script>

<template>
  <Component
    :is="rootComponent"
    v-bind="rootComponentProps"
    :class="['base-avatar', layout, { link: Boolean(linkUrl) }]"
    :title="title"
  >
    <div class="avatar-frame">
      <slot>
        <img
          v-if="image?.url"
          class="avatar-image"
          :src="image?.url"
          :alt="image?.altText"
        />
        <AvatarImagePlaceholder v-else class="image-placeholder" :name="name" />
      </slot>
      <div v-if="$slots.overlay" class="overlay">
        <slot name="overlay" />
      </div>
    </div>

    <div
      v-if="showText !== 'none'"
      class="avatar-label"
      :class="{ 'with-descriptor': descriptor }"
    >
      <SkeletonItem
        :loading="showText === 'placeholder'"
        width="80px"
        height="12px"
      >
        <div>
          <div class="display-name" :class="{ trusted: showTrusted }">
            {{ name }}
          </div>
          <ShieldIcon v-if="showTrusted" class="trusted" />
        </div>
        <div v-if="descriptor" class="descriptor">{{ descriptor }}</div>
      </SkeletonItem>
    </div>
  </Component>
</template>

<style lang="postcss" scoped>
.base-avatar {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: var(--avatar-frame-border-width);
  --avatar-frame-border-width: 2px;
  --avatar-name-trusted-icon-size: 11px;

  & .avatar-frame {
    position: relative;
    flex-shrink: 0;
    width: var(--avatar-size, 30px);
    aspect-ratio: 1/1;
    overflow: hidden;
    background-color: var(--knime-porcelain);
    border-radius: 50%;

    /* use box-shadow instead of border to prevent zoom issues */
    box-shadow: 0 0 0 var(--avatar-frame-border-width)
      var(--box-shadow-color, var(--knime-porcelain));

    & .image-placeholder {
      --placeholder-size: var(--avatar-size, 30px);
    }

    & img.avatar-image {
      width: 100%;
      height: 100%;

      /* background-color: var(--knime-porcelain); */
      color: transparent; /* hide alt text while loading in Firefox */
    }

    & .overlay {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }

  & .avatar-label {
    display: block;
    max-width: 100%;
    padding-top: 3px; /* center it visually a bit better */
    overflow: hidden;
    font-size: 13px;
    font-weight: 300;
    line-height: 1.2;
    text-align: left;

    &.with-descriptor {
      padding: 2px 4px 2px 0;
      font-size: 13px;
      font-weight: 500;
      color: var(--knime-dove-gray);
    }

    & .display-name {
      display: inline-block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &.trusted {
        max-width: calc(100% - var(--avatar-name-trusted-icon-size));
      }
    }

    & .descriptor {
      font-size: 11px;
      font-weight: 400;
      color: var(--knime-dove-grey);
    }

    & svg.trusted {
      position: relative;
      top: -6px;
      display: inline-block;
      width: var(--avatar-name-trusted-icon-size);
      height: var(--avatar-name-trusted-icon-size);
      border-radius: 100%;
      stroke: var(--knime-masala);
      stroke-width: 2px;
    }
  }

  &.vertical {
    flex-direction: column;
    justify-content: center;

    & .avatar-label {
      padding: 0 10px;
    }
  }
}

.base-avatar.link {
  max-width: 100%;
  text-decoration: none;
  pointer-events: all;

  &:focus {
    outline: none;
  }

  & .avatar-frame {
    transition: transform 0.15s ease-in-out;
  }

  &:hover,
  &:focus {
    & .avatar-frame {
      --box-shadow-color: var(--knime-masala);

      transform: scale(1.15);
    }
  }
}
</style>
