<script>
import CodeExample from './demo/CodeExample';
import NodeFeatureList from '../../ui/components/node/NodeFeatureList';
import code from '!!raw-loader!../../ui/components/node/NodeFeatureList';

const codeExample = `<NodeFeatureList
  :in-ports="[{
    dataType: 'table',
    typeName: 'Table',
    optional: false,
    name: 'Corpus of Documents',
    description: 'An input table containing the original corpus with the related document vectors.'
  }]"
  :dyn-in-ports="[{
    groupName: 'Captured workflow inputs',
    groupDescription: 'The dynamic inputs of the workflow fragment starting with this node.',
    types: [
      { dataType: 'table', typeName: 'Table' },
      { dataType: 'flowVariable', typeName: 'Flow Variable' },
      { color: '#41be78', dataType: 'other', typeName: 'Image' },
      { color: '#9b9b9b', dataType: 'other', typeName: 'Distance Measure' },
      { color: '#1469af', dataType: 'other', typeName: 'PMML' },
      { color: '#1eb9dc', dataType: 'other', typeName: 'Naive Bayes' },
    ]
  }]"
  :out-ports="[{
    dataType: 'table',
    typeName: 'Table',
    optional: false,
    name: 'Corpus of Documents',
    description: 'An input table containing the original corpus with the related document vectors.'
  }]"
  :dyn-out-ports="[{
    groupName: 'Captured workflow inputs',
    groupDescription: 'The dynamic inputs of the workflow fragment starting with this node.',
    types: [
      { dataType: 'table', typeName: 'Table' },
      { dataType: 'flowVariable', typeName: 'Flow Variable' },
      { color: '#41be78', dataType: 'other', typeName: 'Image' },
      { color: '#9b9b9b', dataType: 'other', typeName: 'Distance Measure' },
      { color: '#1469af', dataType: 'other', typeName: 'PMML' },
      { color: '#1eb9dc', dataType: 'other', typeName: 'Naive Bayes' },
    ]
  }]"
  :views="[{
    name: '3D View',
    description: 'Select any structure in the table view at the top',
    interactive: true
  }]"
  :options="[{
    fields: [{
      name: 'Neighbor Count',
      description: 'Selects the number of similar neighboring documents you would like to output.',
      optional: false
    }]
  }]"
/>`;

const nodeFeatures = {
    inPorts: [{
        dataType: 'table',
        typeName: 'Table',
        optional: false,
        name: 'Corpus of Documents',
        description: 'An input table containing the original corpus with the related document vectors.'
    }, {
        dataType: 'other',
        color: '#9b9b9b',
        typeName: 'DocumentVectorPortObject',
        optional: true,
        name: 'Document Vector Model',
        description: 'A model containing node settings as well as column names of the term feature space.'
    }],
    dynInPorts: [{
        groupName: 'Captured workflow inputs',
        groupDescription: 'The dynamic inputs of the workflow fragment starting with this node.',
        types: [
            { dataType: 'table', typeName: 'Table' },
            { dataType: 'flowVariable', typeName: 'Flow Variable' },
            { color: '#41be78', dataType: 'other', typeName: 'Image' },
            { color: '#9b9b9b', dataType: 'other', typeName: 'Distance Measure' },
            { color: '#1469af', dataType: 'other', typeName: 'PMML' },
            { color: '#1eb9dc', dataType: 'other', typeName: 'Naive Bayes' }
        ]
    }],
    outPorts: [{
        dataType: 'flowVariable',
        typeName: 'Flow Variable',
        optional: true,
        name: 'Count of Most Similar Documents per Input Document',
        description: 'A single variable set to the count of matching documents per input document'
    }],
    dynOutPorts: [{
        groupName: 'Captured Workflow',
        groupDescription: 'The dynamic outputs of the workflow fragment starting with this node.',
        types: [
            { color: '#2e992e', typeName: 'Workflow', dataType: 'other' },
            { color: '#9b9b9b', typeName: 'Distance Measure', dataType: 'other' }
        ]
    }, {
        groupName: 'Second DynOutPortGroup',
        groupDescription: 'The dynamic outputs of the workflow fragment starting with this node.',
        types: [
            { color: '#1eb9dc', typeName: 'Sota', dataType: 'other' }
        ]
    }],
    views: [{
        name: '3D View',
        description: 'Select any structure in the table view at the top and see the 3D representation at the ' +
            'bottom. The bottom view may be empty if the structure being selected does not carry 3D coordinate ' +
            'information.',
        interactive: true
    }, {
        name: '3D View',
        description: 'Select any structure in the table view at the top and see the 3D representation at the ' +
            'bottom. The bottom view may be empty if the structure being selected does not carry 3D coordinate ' +
            'information.',
        interactive: true
    }],
    options: [{
        fields: [{
            name: 'Neighbor Count',
            description: 'Selects the number of similar neighboring documents you would like to output.',
            optional: false
        }, {
            name: 'Min Similarity',
            description: 'Selects the minimum similarity values you would like to output.',
            optional: false
        }]
    }]
};


export default {
    components: {
        NodeFeatureList,
        CodeExample
    },
    computed: {
        code() {
            return code;
        },
        codeExample() {
            return codeExample;
        },
        nodeFeatures() {
            return nodeFeatures;
        }
    }
};
</script>

<template>
  <div>
    <section class="demo">
      <div class="grid-container">
        <div class="grid-item-12">
          <h2>NodeFeatureList</h2>
          <p>
            A container component that summarizes properties of nodes or components.
            In particular their ports, dialog options and views.
          </p>
          <p>
            This component works best on gray background.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-12">
          <NodeFeatureList v-bind="nodeFeatures" />
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show NodeFeatureList.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.demo {
  background-color: var(--knime-gray-ultra-light);

  & >>> .shadow-wrapper::before {
    background-image: linear-gradient(270deg, hsla(0, 0%, 100%, 0) 0%, var(--knime-gray-ultra-light) 100%);
  }

  & >>> .shadow-wrapper::after {
    background-image: linear-gradient(90deg, hsla(0, 0%, 100%, 0) 0%, var(--knime-gray-ultra-light) 100%);
  }
}

</style>
