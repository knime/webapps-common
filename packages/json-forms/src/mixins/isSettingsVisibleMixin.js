import { injectShowAdvancedSettings } from "../composables/components/useAdvancedSettings";

export default {
  data() {
    return {
      showAdvancedSettings: false,
    };
  },
  created() {
    this.showAdvancedSettings = injectShowAdvancedSettings();
  },
  computed: {
    isVisible() {
      return (
        this.control?.visible && (this.showAdvancedSettings || !this.isAdvanced)
      );
    },
    isAdvanced() {
      return this.control?.uischema.options?.isAdvanced;
    },
  },
};
