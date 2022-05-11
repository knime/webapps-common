<script>
import Messages from '../../ui/components/Messages';
import BulbIcon from '../../ui/assets/img/icons/bulb.svg?inline';
import CodeExample from './demo/CodeExample';
import code from '!!raw-loader!../../ui/components/Messages';

const codeExample = `<script>
import Messages from 'webapps-common/ui/components/Messages';
import BulbIcon from '~/webapps-common/ui/assets/img/icons/bulb.svg?inline';

export default {
    components: {
        Messages
    },
    data() {
        return {
            messages: [{
                id: 1,
                type: 'info',
                message: 'Info message'
            }, {
                id: 2,
                type: 'warn',
                message: 'Warning message'
            }, {
                id: 3,
                type: 'success',
                message: 'Success message',
                icon: BulbIcon
            }, {
                id: 4,
                type: 'error',
                message: 'Error message',
                icon: BulbIcon,
                button: 'Okily Dokily!'
            }, {
                id: 5,
                type: 'error',
                message: 'Error message.',
                icon: BulbIcon,
                details: 'These are details',
                link: {
                    text: 'With appended link and details.',
                    href: 'https://www.knime.com/'
                }
            }]
        };
    },
    methods: {
        removeMessage(id) {
            this.messages = this.messages.filter(message => message.id !== id);
        }
    }
};
<\/script>

<template>
  <Messages
    :messages="messages"
    @dismiss="removeMessage"
  />
</template>`;

export default {
    components: {
        Messages,
        CodeExample
    },
    data() {
        return {
            codeExample,
            code,
            messages: [{
                id: 1,
                type: 'info',
                message: 'Info message'
            }, {
                id: 2,
                type: 'warn',
                message: 'Warning message'
            }, {
                id: 3,
                type: 'success',
                message: 'Success message',
                icon: BulbIcon
            }, {
                id: 4,
                type: 'error',
                message: 'Error message',
                icon: BulbIcon,
                button: 'Okily Dokily!'
            }, {
                id: 5,
                type: 'error',
                message: 'Error message.',
                icon: BulbIcon,
                details: 'These are details',
                link: {
                    text: 'With appended link and details.',
                    href: 'https://www.knime.com/'
                }
            }]
        };
    },
    methods: {
        removeMessage(id) {
            this.messages = this.messages.filter(message => message.id !== id);
        }
    }
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h2>Messages</h2>
          <p>
            Displays multiple stacked messages and animates if a message is added or removed (e.g. dismissed).
          </p>
        </div>
      </div>
    </section>
    <Messages
      :messages="messages"
      @dismiss="removeMessage"
    />
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show Messages.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
