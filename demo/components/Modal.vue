<script>
import Modal from '../../ui/components/Modal';
import PlayIcon from '../../ui/assets/img/icons/circle-play.svg?inline';
import Button from '../../ui/components/Button';
import CodeExample from './demo/CodeExample';

import code from '!!raw-loader!../../ui/components/Modal';
import baseModalCode from '!!raw-loader!../../ui/components/BaseModal';

const codeExample = `<script>
import Modal from '~/webapps-common/ui/components/Modal';
import PlayIcon from '~/webapps-common/ui/assets/img/icons/circle-play.svg?inline';
import Button from '~/webapps-common/ui/components/Button';

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
@import "webapps-common/ui/css/variables";

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
        CodeExample
    },
    data() {
        return {
            codeExample,
            code,
            baseModalCode,
            modalActive: false,
            modalStyleType: 'info'
        };
    }
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h2>Modal</h2>
          <p>
            Offers multiple optional slots for content to show inside a
            <a href="https://en.wikipedia.org/wiki/Modal_window">modal dialog</a>.
            Multiple styles are supported by the <code>styleType</code> prop.
            The modal emits a <code>cancel</code> event which is triggered by clicking
            the overlay, the ESC key or the close button. Also on tab, the focus is trapped inside the modal.
          </p>
          <p>
            For the rare cases where more design freedom is needed, please use the <code>BaseModal</code> component
            which comes without a header and styled slots. But please be aware of
            <a href="https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html">W3C best practices
              for modal dialogs</a>.
          </p>
          <Button
            primary
            @click="modalActive = true"
          >
            Trigger modal
          </Button>

          <Modal
            :active="modalActive"
            title="Modal title"
            class="modal"
            :style-type="modalStyleType"
            @cancel="modalActive = false"
          >
            <template v-slot:icon><PlayIcon /></template>
            <template v-slot:notice>This is the notice slot.</template>
            <template v-slot:confirmation>And this is content in the confirmation slot.</template>
            <template v-slot:controls>
              <Button
                primary
                @click="modalActive = false"
              >
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
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show Modal.vue source code">{{ code }}</CodeExample>
          <CodeExample summary="Show BaseModal.vue source code">{{ baseModalCode }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.modal {
  --modal-width: 500px; /* optional, only needed in case you want to adjust the width. Default: 550px */
}
</style>
