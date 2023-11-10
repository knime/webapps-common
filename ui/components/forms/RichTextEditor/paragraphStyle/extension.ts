import Paragraph from "@tiptap/extension-paragraph";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      /**
       * Sets a custom class on the paragraph which is used to set a small font size
       */
      setSmallText: () => ReturnType;
      /**
       * Reverts setSmallText
       */
      unsetSmallText: () => ReturnType;
    };
  }
}

const SmallFontSize = Paragraph.extend({
  addAttributes() {
    const smallTextClass = "small-text";
    return {
      ...this.parent?.(),
      smallText: {
        default: false,
        parseHTML: (element) => element.className === smallTextClass,
        renderHTML: (attributes) => {
          return attributes.smallText
            ? {
                class: smallTextClass,
              }
            : {};
        },
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setSmallText:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, "paragraph", {
            smallText: true,
          });
        },
      unsetSmallText:
        () =>
        ({ chain }) => {
          return chain()
            .updateAttributes(this.name, { smallText: false })
            .run();
        },
    };
  },
});

export { SmallFontSize };
