import { type Ref, ref, watch } from "vue";

/**
 * A simple composable that postpones setting values selected
 *  in the file browser side drawer until the user clicks apply.
 */
export default <V>({
  /**
   * The onChange method that actually sets the value in the dialogs data.
   */
  onChange,
  /**
   * The value from this ref will be taken as initial value for
   * the side drawer in the moment it is opened.
   */
  initialValue,
}: {
  onChange: (v: V) => void;
  initialValue: Ref<V>;
}) => {
  const sideDrawerValue = ref(initialValue.value);
  const updateSideDrawerValue = (newValue: V) => {
    (sideDrawerValue.value as V) = newValue;
  };
  const onApply = () => onChange(sideDrawerValue.value as V);
  watch(() => initialValue.value, updateSideDrawerValue);

  return {
    onApply,
    sideDrawerValue,
    updateSideDrawerValue,
  };
};
