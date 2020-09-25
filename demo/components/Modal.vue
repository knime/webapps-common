<script>
import Modal from '../../ui/components/Modal';
import Button from '../../ui/components/Button';
import InputField from '../../ui/components/forms/InputField';
import CodeExample from './demo/CodeExample';

import code from '!!raw-loader!../../ui/components/Modal';

const codeExample = `<script>
import Modal from '~/webapps-common/ui/components/Modal';
import InputField from '~/webapps-common/ui/components/InputField';
import Button from '~/webapps-common/ui/components/Button';

export default {
    components: {
        Modal,
        InputField,
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
      @cancel="modalActive = false"
    >
      <h2>This is the modal content</h2>
      <InputField></InputField>
      <p>Can be anything you put in the default slot</p>
      <Button primary @click="modalActive = false">Close</Button>
    </Modal>
  </div>
</template>
`;

export default {
    components: {
        Modal,
        Button,
        InputField,
        CodeExample
    },
    data() {
        return {
            codeExample,
            code,
            modalActive: false
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
            A <a href="https://en.wikipedia.org/wiki/Modal_window">modal dialog</a>.
            The default slot is used to display content.
          </p>
          <p>The modal offers a cancel event which is triggered by clicking the overlay or by the ESC key.</p>
          <p>Also on tab, the focus is trapped inside the modal.</p>
          <p>
            <a href="https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html">
              See w3c best practices for modal dialogs
            </a>
          </p>
          <Button
            primary
            @click="modalActive = true"
          >
            Trigger modal
          </Button>
          <Modal
            :active="modalActive"
            @cancel="modalActive = false"
          >
            <h2>This is the modal content</h2>
            <InputField />
            <p>Can be anything you put in the default slot</p>
            <Button
              primary
              @click="modalActive = false"
            >
              Close
            </Button>
          </Modal>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show Modal.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>

>>> .inner {
  padding: 20px;
}
</style>
