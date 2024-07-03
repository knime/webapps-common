<script>
import { Modal, Button, Checkbox } from "@knime/components";
import PlayIcon from "@knime/styles/img/icons/circle-play.svg";
import CodeExample from "./demo/CodeExample.vue";

// import code from "webapps-common/ui/components/Modal.vue?raw";
const code = "";
// import baseModalCode from "webapps-common/ui/components/BaseModal.vue?raw";
const baseModalCode = "";

const codeExample = `<script>
import Modal from '~/webapps-common/ui/components/Modal.vue';
import PlayIcon from '~/@knime/styles/img/icons/circle-play.svg';
import Button from '~/webapps-common/ui/components/Button.vue';

export default {
    components: {
        Modal,
        PlayIcon,
        Button
    },
    data() {
        return {
            modalActive: false
        };
    }
};
<\/script>

<template>
  <div>
    <Button
      @click="modalActive = true"
      primary
    >
      Trigger modal
    </Button>
    <Modal
      :active="modalActive"
      title="Modal title"
      class="modal"
      style-type="info"
      @cancel="modalActive = false"
    >
      <template v-slot:icon><PlayIcon /></template>
      <template v-slot:notice>This is the notice slot.</template>
      <template v-slot:confirmation>And this is content in the confirmation slot.</template>
      <template v-slot:controls>
        <Button @click="modalActive = false">Accept and close</Button>
      </template>
    </Modal>
  </div>
</template>

<style lang="postcss" scoped>
.modal {
  --modal-width: 500px; /* optional, only needed in case you want to adjust the width. Default: 550px */
}
</style>
`;

export default {
  components: {
    Modal,
    PlayIcon,
    Button,
    CodeExample,
    Checkbox,
  },
  data() {
    return {
      codeExample,
      code,
      baseModalCode,
      modalActive: false,
      modalStyleType: "info",
      animate: true,
      implicitDismiss: true,
    };
  },
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>
            Offers multiple optional slots for content to show inside a
            <a href="https://en.wikipedia.org/wiki/Modal_window">modal dialog</a
            >. Multiple styles are supported by the <code>styleType</code> prop.
            See source code for possible values. The modal emits a
            <code>cancel</code> event which is triggered by clicking the
            overlay, the ESC key or the close button. Also on tab, the focus is
            trapped inside the modal.
          </p>
          <p>
            For the rare cases where more design freedom is needed, please use
            the <code>BaseModal</code> component which comes without a header
            and styled slots. But please be aware of
            <a
              href="https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html"
              >W3C best practices for modal dialogs</a
            >.
          </p>
          <div class="options">
            <Button primary @click="modalActive = true"> Trigger modal </Button>
            <Checkbox v-model="animate"> Animate on enter </Checkbox>
            <Checkbox v-model="implicitDismiss">
              Autodismiss via "Esc" or clicking on backdrop
            </Checkbox>
          </div>

          <Modal
            :active="modalActive"
            title="Modal title"
            class="modal"
            :style-type="modalStyleType"
            :animate="animate"
            :implicit-dismiss="implicitDismiss"
            @cancel="modalActive = false"
          >
            <template #icon><PlayIcon /></template>
            <template #notice>This is the notice slot.</template>
            <template #confirmation
              >And this is content in the confirmation slot.</template
            >
            <template #controls>
              <Button primary @click="modalActive = false">
                Accept and close
              </Button>
            </template>
          </Modal>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show Modal.vue source code">{{
            code
          }}</CodeExample>
          <CodeExample summary="Show BaseModal.vue source code">{{
            baseModalCode
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
.modal {
  --modal-width: 500px; /* optional, only needed in case you want to adjust the width. Default: 550px */
}

.options {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
