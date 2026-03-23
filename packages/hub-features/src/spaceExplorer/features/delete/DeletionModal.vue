<script lang="ts" setup>
// import DeletionConfirmationModal from "~/components/modal/DeletionConfirmationModal.vue";

// import { useDeletionModal } from "./useDeletionModal";

// const {
//   internal: { items, showConfirmation, pendingDelete, onYes, close },
// } = useDeletionModal();
</script>

<template>
  <div v-show="false">TODO: FIXME!!</div>
  <!-- <DeletionConfirmationModal
    :active="showConfirmation"
    name="UNUSED_NO_TWO_FACTOR"
    :pending="pendingDelete"
    title="Delete"
    type="various"
    :two-factor="false"
    @yes="onYes"
    @no="close"
  >
    <p>
      Please read the following carefully! This action cannot be undone – it
      will permanently delete:
    </p>
    <ul>
      <li v-for="item of items" :key="item.name">
        {{ item.type }} “<strong>{{ item.name }}</strong
        >”.
      </li>
    </ul>
  </DeletionConfirmationModal> -->
</template>
