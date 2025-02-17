<script setup lang="ts">
import { Avatar } from "@knime/components";
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <p>A circular avatar, optionally alongside an associated name text.</p>
      </div>
    </div>

    <div
      class="grid-container flex-container"
      style="--avatar-size: 42px; gap: 50px"
    >
      <div>
        <p>Image avatar:</p>
        <Avatar :image="{ url: 'favicon.png' }" />
      </div>
      <div>
        <p>Initials placeholder:</p>
        <Avatar name="KNIME Name" />
      </div>
      <div>
        <p>With multiple text options:</p>
        <div class="flex-container">
          <Avatar
            :image="{ url: 'https://www.knime.com/images/knime-logo.svg' }"
            name="KNIME Avatar"
            show-text="name"
          />
          <Avatar
            :image="{ url: 'https://www.knime.com/images/knime-logo.svg' }"
            name="KNIME Avatar"
            show-text="placeholder"
          />
          <Avatar
            :image="{ url: 'https://www.knime.com/images/knime-logo.svg' }"
            name="Trusted KNIME Avatar"
            layout="horizontal"
            descriptor="With optional descriptor"
            show-trusted
            show-text="name"
          />
        </div>
      </div>
      <div>
        <p>With clickable link:</p>
        <Avatar
          :image="{ url: 'favicon.png' }"
          name="KNIME Homepage"
          show-text="name"
          :link-url="{ url: 'https://www.knime.com/', external: true }"
        />
      </div>
      <div>
        <p>With different sizes:</p>
        <div class="flex-container">
          <Avatar
            style="--avatar-size: initial"
            :image="{ url: 'https://www.knime.com/images/knime-logo.svg' }"
            name="Default"
            show-text="name"
          />
          <Avatar
            style="--avatar-size: 42px"
            :image="{ url: 'https://www.knime.com/images/knime-logo.svg' }"
            name="42 pixels"
            show-text="name"
          />
          <Avatar
            style="--avatar-size: 64px"
            :image="{ url: 'https://www.knime.com/images/knime-logo.svg' }"
            name="64 pixels"
            show-text="name"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.flex-container {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  width: 100%;
  gap: 10px;

  /* Fix missing contrast caused by transparent demo avatar image */
  & :deep(.avatar-frame) {
    background-color: var(--knime-white);
  }
}
</style>
