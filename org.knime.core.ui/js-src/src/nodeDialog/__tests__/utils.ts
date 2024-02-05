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
      ...(stubButtonsBySlot && {
        stubs: {
          Button: {
            inheritAttrs: false,
            template: "<slot/>",
          },
        },
      }),
    },
    props: {
      dialogSettings: {
        nodeId: "test",
      },
    },
  };
};
