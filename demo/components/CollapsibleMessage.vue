<script>
import CollapsibleMessage from '../../ui/components/CollapsibleMessage';
import CodeExample from './demo/CodeExample';
import code from '!!raw-loader!../../ui/components/CollapsibleMessage';

const codeExample = `<script>
import CollapsibleMessage from 'webapps-common/ui/components/CollapsibleMessage';

export default {
    components: {
        CollapsibleMessage
    }
};
<\/script>

<template>
  <CollapsibleMessage details="This is a detail text">
    This is a simple collapsible Message
  </CollapsibleMessage>
</template>`;

export default {
    components: {
        CollapsibleMessage,
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
          <h2>CollapsibleMessage</h2>
          <p>
            A message can also contain <code>details</code> which are hidden and only displayed when the
            collapser button '^' (pointing down) is clicked. It is then possible to click the copy button which will
            copy the detail text and fire the <code>copied</code> event.
          </p>
        </div>
      </div>
    </section>
    <CollapsibleMessage
      type="error"
      details="These are details about the error"
    >
      This is an error collapsible message with details
    </CollapsibleMessage>
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
