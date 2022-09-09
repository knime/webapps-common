<script>
import Message from 'webapps-common/ui/components/Message.vue';
import BulbIcon from 'webapps-common/ui/assets/img/icons/bulb.svg';
import CheckIcon from 'webapps-common/ui/assets/img/icons/circle-check.svg';
import InfoIcon from 'webapps-common/ui/assets/img/icons/circle-info.svg';
import CodeExample from './demo/CodeExample.vue';
import code from 'webapps-common/ui/components/Message.vue?raw';

const codeExample = `<script>
import Message from 'webapps-common/ui/components/Message';
import BulbIcon from '~/webapps-common/ui/assets/img/icons/bulb.svg';
import CheckIcon from '~/webapps-common/ui/assets/img/icons/circle-check.svg';

export default {
    components: {
        Message,
        BulbIcon,
        CheckIcon
    }
};
<\/script>

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
<Message :show-close-button="false">
  This is a message without close button
</Message>
<Message
  type="error"
  details="Some example detail text"
>
  This is a message with further details
</Message>
<Message
  type="info"
  :details="({
    text: 'Some details.',
    link: {
      text: 'Some docs.',
      href: 'https://docs.knime.com'
    }
  })"
>
  This is a message with a detail link
</Message>
<Message
  type="success"
  details="Some details"
  :show-collapser="false"
>
  This is a message with a details in the main banner
</Message>
<Message
  type="error"
  :details="({
    text: 'Some details.',
    link: {
      text: 'Some docs.',
      href: 'https://docs.knime.com'
    }
  })"
  :show-collapser="false"
>
  This is a message with a details and a link in the main banner
</Message>
<Message
  type="info"
  :details="({
    text: '<-- spacing must be styled from parent component, as the icon is provided via slot and can be' +
      ' of arbitrary size or composition.',
    link: {
      text: '(read more)',
      href: 'https://www.telerik.com/blogs/understanding-vue-deep-css-selector'
    }
  })"
  :show-collapser="false"
>
  <InfoIcon slot="icon" />
  This is a message with an icon, details and a link in the main banner
</Message>`;

export default {
    components: {
        Message,
        BulbIcon,
        CheckIcon,
        InfoIcon,
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
            Each message can have an icon in the <code>icon</code> slot. Note: for spacing of text when using an icon
            via <code>icon</code> slot, please use the parent component to style the text accordingly.
          </p>
          <p>
            A message can have an 'x' button (default), or a close button with text, controlled by the
            <code>button</code> property, or neither, which can be achieved by setting the <code>showCloseButton</code>
            property to <code>false</code>. In this case the <code>button</code> property has no effect, no controls
            will be displayed, and you must programmatically dismiss the message.
          </p>
          <p>
            Pressing the button or the 'x' closes the widget and fires the <code>dismiss</code> event.
          </p>
          <p>
            In addition a message can also contain <code>details</code> which are hidden and only displayed when the
            collapser button '^' (pointing down) is clicked. It is then possible to click the copy button which will
            copy the detail text and fire the <code>copied</code> event.
          </p>
          <p>
            Alternatively, <code>details</code> can be displayed in the main banner section  by setting the
            <code>showCollapser</code> property to <code>false</code>.
          </p>
          <p>
            Any <code>details</code> can also contain links. These are configured by providing details as an
            <code>Object</code> (instead of a <code>String</code>) with the <code>link</code> property set. This can be
            used in combination with any of the other <code>details</code> configuration options.
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
    <Message :show-close-button="false">
      This is a message without close button
    </Message>
    <Message
      type="error"
      details="Some example detail text"
    >
      This is a message with further details
    </Message>
    <Message
      type="info"
      :details="({
        text: 'Some details.',
        link: {
          text: 'Some docs.',
          href: 'https://docs.knime.com'
        }
      })"
    >
      This is a message with a detail link
    </Message>
    <Message
      type="success"
      details="Some details"
      :show-collapser="false"
    >
      This is a message with a details in the main banner
    </Message>
    <Message
      type="error"
      :details="({
        text: 'Some details.',
        link: {
          text: 'Some docs.',
          href: 'https://docs.knime.com'
        }
      })"
      :show-collapser="false"
    >
      This is a message with a details and a link in the main banner
    </Message>
    <Message
      type="info"
      :details="({
        text: '<-- spacing must be styled from parent component, as the icon is provided via slot and can be' +
          ' of arbitrary size or composition.',
        link: {
          text: '(read more)',
          href: 'https://www.telerik.com/blogs/understanding-vue-deep-css-selector'
        }
      })"
      :show-collapser="false"
    >
      <InfoIcon slot="icon" />
      This is a message with an icon, details and a link in the main banner
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
