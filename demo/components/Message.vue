<script>
import Message from '../../ui/components/Message';
import BulbIcon from '../../ui/assets/img/icons/bulb.svg?inline';
import CheckIcon from '../../ui/assets/img/icons/circle-check.svg?inline';
import CodeExample from './demo/CodeExample';
import code from '!!raw-loader!../../ui/components/Message';

const codeExample = `<script>
import Message from 'webapps-common/ui/components/Message';
import BulbIcon from '~/webapps-common/ui/assets/img/icons/bulb.svg?inline';
import CheckIcon from '~/webapps-common/ui/assets/img/icons/circle-check.svg?inline';

export default {
    components: {
        Message,
        BulbIcon,
        CheckIcon
    }
};
<\/script>

<template>
  <Message>
    This is a simple message
  </Message>
  <Message>
    <BulbIcon slot="icon" />
    This is a simple message with an icon.<br>
    <a href="#" @click.prevent>It contains markup</a>
  </Message>
  <Message
    type="error"
    button="Okily Dokily!"
  >
    This is an error message with a button
  </Message>
  <Message type="success">
    <CheckIcon slot="icon" />
    This is a success message with an icon
  </Message>
  <Message type="transparent">
    <CheckIcon slot="icon" />
    This is a transparent message with an icon
  </Message>
</template>`;

export default {
    components: {
        Message,
        BulbIcon,
        CheckIcon,
        CodeExample
    },
    data() {
        return {
            codeExample,
            code
        };
    }
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h2>Message</h2>
          <p>
            There are several types of messages: <code>info</code> (default),
            <code>success</code> and <code>error</code>.
            You can select them with the <code>type</code> property.
          </p>
          <p>
            Each message can have an icon in the <code>icon</code> slot, and optionally a button. The button text is set
            with the <code>button</code> property. If left out, the widget will show an 'x' icon. Pressing the button or
            the 'x' closes the widget and fires the <code>dismiss</code> event.
          </p>
          <p>
            In addition a message can also contain <code>details</code> which are hidden and only displayed when the
            collapser button '^' (pointing down) is clicked. It is then possible to click the copy button which will
            copy the detail text and fire the <code>copied</code> event.
          </p>
        </div>
      </div>
    </section>
    <Message>
      This is a simple message
    </Message>
    <Message>
      <BulbIcon slot="icon" />
      This is a simple message with an icon.<br>
      <!-- eslint-disable-next-line vue/max-attributes-per-line -->
      <a href="#" @click.prevent>It contains markup</a>
    </Message>
    <Message
      type="error"
      button="Okily Dokily!"
    >
      This is an error message with a button
    </Message>
    <Message type="success">
      <CheckIcon slot="icon" />
      This is a success message with an icon
    </Message>
    <Message
      type="error"
      details="Some example detail text"
    >
      This is a message with further details
    </Message>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show Message.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
