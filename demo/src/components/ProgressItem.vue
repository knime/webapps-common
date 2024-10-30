<script setup lang="ts">
import {
  FunctionButton,
  ProgressItem,
  type ProgressItemProps,
  ProgressList,
} from "@knime/components";
import ActivityIcon from "@knime/styles/img/icons/activity.svg";

const getId = (function* () {
  let start = 0;
  while (true) {
    yield (start++).toString();
  }
})();

const items: Array<ProgressItemProps & { actions?: boolean }> = [
  {
    id: getId.next().value,
    title: "Basic",
  },
  {
    id: getId.next().value,
    title: "With subtitle",
    subtitle: "Subtitle",
  },
  {
    id: getId.next().value,
    title: "With progress",
    progress: 40,
  },
  {
    id: getId.next().value,
    title: "With pill",
    statusPill: {
      icon: ActivityIcon,
      text: "some text",
      variant: "info",
    },
  },
  {
    id: getId.next().value,
    title: "With action",
    actions: true,
  },
  {
    id: getId.next().value,
    title: "With everything",
    subtitle: "subtitle",
    progress: 87,
    statusPill: {
      icon: ActivityIcon,
      text: "some text",
      variant: "success",
    },
    actions: true,
  },
];
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <div class="wrapper">
          Some container with a list of ProgressItem
          <ProgressList>
            <ProgressItem v-for="item in items" :key="item.id" v-bind="item">
              <template v-if="item.actions" #actions>
                <FunctionButton>
                  <ActivityIcon />
                </FunctionButton>
              </template>
            </ProgressItem>
          </ProgressList>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.wrapper {
  border: 1px solid var(--knime-black);
  border-radius: 4px;
  padding: var(--space-12);
}
</style>
