import { Ref, ref } from "vue";
import SettingsSubPanel from "./SettingsSubPanel.vue";
/**
 * Use this composable whenever a SettingsSubPanel is used to bind its output as props to the sub panel element.
 */
export default (
  /**
   * Triggered whenever the apply button is pressed. When the returned promise resolves, the sub panel is closed.
   */
  onApply: () => Promise<void>,
) => {
  const subPanel: Ref<typeof SettingsSubPanel | null> = ref(null);
  const closeSubPanel = () => subPanel.value?.close();
  const subPanelProps = {
    ref: subPanel,
    onApply: () =>
      onApply()
        .then(closeSubPanel)
        .catch(() => {}),
  };
  return subPanelProps;
};
