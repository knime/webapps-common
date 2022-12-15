<script>
import { defineComponent } from '@vue/composition-api';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue2';
import { optionsMapper, getFlowVariablesMap, isModelSettingAndHasNodeView } from '@/utils/nodeDialogUtils';
import Twinlist from '~/webapps-common/ui/components/forms/Twinlist.vue';
import LabeledInput from './LabeledInput.vue';
import advancedSettingsMixin from '../mixins/advancedSettingsMixin';

const defaultTwinlistSize = 7;
const defaultTwinlistLeftLabel = 'Excluded Values';
const defaultTwinlistRightLabel = 'Included Values';

const TwinlistInput = defineComponent({
    name: 'TwinListInput',
    components: {
        Twinlist,
        LabeledInput
    },
    mixins: [advancedSettingsMixin],
    props: {
        ...rendererProps(),
        twinlistSize: {
            type: Number,
            required: false,
            default: defaultTwinlistSize
        },
        twinlistLeftLabel: {
            type: String,
            required: false,
            default: defaultTwinlistLeftLabel
        },
        twinlistRightLabel: {
            type: String,
            required: false,
            default: defaultTwinlistRightLabel
        }
    },
    setup(props) {
        return useJsonFormsControl(props);
    },
    data() {
        return {
            possibleValues: null
        };
    },
    computed: {
        isModelSettingAndHasNodeView() {
            return isModelSettingAndHasNodeView(this.control);
        },
        flowSettings() {
            return getFlowVariablesMap(this.control);
        },
        disabled() {
            return !this.control.enabled || this.flowSettings?.controllingFlowVariableAvailable;
        }
    },
    created() {
        this.possibleValues = this.control.schema.anyOf.map(optionsMapper);
    },
    methods: {
        onChange(event) {
            this.handleChange(this.control.path, event);
            if (this.isModelSettingAndHasNodeView) {
                this.$store.dispatch('pagebuilder/dialog/dirtySettings', true);
            }
        }
    }
});
export default TwinlistInput;
</script>

<template>
  <LabeledInput
    v-if="isVisible"
    :text="control.label"
    :show-reexecution-icon="isModelSettingAndHasNodeView"
    :scope="control.uischema.scope"
    :flow-settings="flowSettings"
    :description="control.description"
    :class="{fadeContainer: isAdvanced}"
  >
    <Twinlist
      v-if="possibleValues"
      :disabled="disabled"
      :value="control.data"
      :possible-values="possibleValues"
      :size="twinlistSize"
      :left-label="twinlistLeftLabel"
      :right-label="twinlistRightLabel"
      @input="onChange"
    />
  </LabeledInput>
</template>

<style lang="postcss" scoped>
@import "../../utils/animation.css";
.twinlist >>> .lists >>> .multiselect-list-box >>> [role="listbox"] {
  font-size: 13px;
}

.twinlist >>> .header >>> .title {
  font-size: 13px;
  font-weight: 500;
  color: var(--knime-dove-gray);
}

</style>
