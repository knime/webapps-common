import Form from "@/nodeDialog/layoutComponents/Form.vue";

export const getOptions = ({
  stubButtonsBySlot,
}: {
  stubButtonsBySlot?: true;
} = {}) => {
  return {
    global: {
      provide: {
        getKnimeService: () => ({}),
      },
      stubs: {
        Form,
        ...(stubButtonsBySlot && {
          Button: {
            inheritAttrs: false,
            template: "<slot/>",
          },
        }),
      },
    },
    props: {
      dialogSettings: {
        nodeId: "test",
      },
    },
  };
};
