export default {
    computed: {
        isVisible() {
            return this.control.visible &&
                (this.control.rootSchema?.showAdvancedSettings || !this.isAdvanced);
        },
        isAdvanced() {
            return this.control.uischema.options?.isAdvanced;
        }
    }
};
