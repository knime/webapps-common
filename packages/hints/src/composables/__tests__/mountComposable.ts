import { type PropType, defineComponent, ref } from "vue";
import { mount } from "@vue/test-utils";

const mountComposable = <T extends (...args: any) => any>({
  composable,
  composableProps,
}: {
  composable: T;
  composableProps: Parameters<T>[0];
}) => {
  const TestComponent = defineComponent({
    props: {
      composableProps: {
        type: Object as PropType<typeof composableProps>,
        required: true,
      },
    },
    setup(props) {
      const count = ref(1);

      const increment = () => {
        const newValue = (count.value += 1);
        return newValue;
      };

      const composableResults = composable(props.composableProps);

      return {
        composableResult:
          typeof composableResults === "object"
            ? { ...composableResults }
            : composableResults,
        count,
        increment,
      };
    },
    template: "<div>{{this.count}}</div>",
  });

  const wrapper = mount(TestComponent, {
    props: { composableProps },
  });

  const lifeCycle = {
    unmount: () => wrapper.unmount(),
    triggerUpdate: () => {
      wrapper.vm.increment();
      return wrapper.vm.$nextTick();
    },
  };

  const getComposableResult = () => wrapper.vm.composableResult;

  return {
    getComposableResult,
    lifeCycle,
  };
};

export default mountComposable;
