<script setup lang="ts">
import { computed } from "vue";

import ShieldIcon from "@knime/styles/img/icons/shield.svg";

import { resolveNuxtLinkComponent } from "../nuxtComponentResolver";

import AvatarImagePlaceholder from "./AvatarImagePlaceholder.vue";

/**
 * Displays an avatar image as well as complementary text.
 * The text can be either shown below or to the right.
 *
 * The size can be configured via the CSS variable --avatar-size-px
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
   * Display "trusted" badge or not.
   */
  showTrusted?: boolean;
  /**
   * Display as link if linkUrl is provided.
   */
  linkUrl?: string | null;
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

const title = computed(() => {
  return props.tooltip || props.name;
});

const rootComponent = computed(() => {
  return props.linkUrl ? resolveNuxtLinkComponent() : "div";
});
</script>

<template>
  <Component
    :is="rootComponent"
    :to="linkUrl"
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
      <div v-if="showText === 'placeholder'" class="text-placeholder" />
      <template v-else>
        <div>
          <div class="display-name" :class="{ trusted: showTrusted }">
            {{ name }}
          </div>
          <ShieldIcon v-if="showTrusted" class="trusted" />
        </div>
        <div v-if="descriptor" class="descriptor">{{ descriptor }}</div>
      </template>
    </div>
  </Component>
</template>

<style lang="postcss" scoped>
.base-avatar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 2px; /* make room for box-shadow */

  & .avatar-frame {
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    width: var(--avatar-size-px, 30px);
    aspect-ratio: 1/1;
    background-color: var(--knime-porcelain);
    flex-shrink: 0;

    /* use box-shadow instead of border to prevent zoom issues */
    box-shadow: 0 0 0 2px var(--box-shadow-color, var(--knime-porcelain));

    & .image-placeholder {
      --placeholder-size: var(--avatar-size-px, 30px);
    }

    & img.avatar-image {
      background-color: var(--knime-porcelain);
      color: transparent; /* hide alt text while loading in Firefox */
      width: 100%;
      height: 100%;
    }

    & .overlay {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
    }
  }

  & .avatar-label {
    display: block;
    font-weight: 300;
    font-size: 13px;
    max-width: 100%;
    padding-top: 3px; /* center it visually a bit better */
    overflow: hidden;
    line-height: 1.2;
    text-align: left;

    &.with-descriptor {
      font-weight: 500;
      font-size: 13px;
      color: var(--knime-dove-gray);
      padding-top: 2px;
      padding-bottom: 2px;
      padding-right: 4px;
    }

    & .display-name {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: inline-block;
      max-width: 100%;

      &.trusted {
        max-width: calc(100% - 11px); /* make room for icon */
      }
    }

    & .descriptor {
      font-weight: 400;
      font-size: 11px;
      color: var(--knime-dove-grey);
    }

    & svg.trusted {
      display: inline-block;
      position: relative;
      top: -6px;
      border-radius: 100%;
      width: 11px;
      height: 11px;
      stroke: var(--knime-masala);
      stroke-width: 2px;
    }

    & .text-placeholder {
      display: inline-block;
      width: 80px;
      height: 12px;
      background: linear-gradient(
        to right,
        var(--knime-porcelain) 0%,
        var(--knime-silver-sand-semi) 25%,
        var(--knime-porcelain) 50%
      );
      background-size: 200px 20px;
      background-position: -50px 0;
      animation: knightRider 2s linear infinite;
    }
  }

  &.vertical {
    justify-content: center;
    flex-direction: column;

    & .avatar-label {
      padding-top: 0;
      padding-left: 10px;
      padding-right: 10px;
    }
  }
}

.base-avatar.link {
  pointer-events: all;
  max-width: 100%;
  text-decoration: none;

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
