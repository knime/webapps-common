export default ({ view, model }: { view?: object; model?: object }) => ({
  ...view,
  ...model,
});
