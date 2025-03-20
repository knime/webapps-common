export default [
  {
    name: "@knime/eslint-config/custom-todo",
    rules: {
      "custom/ticket-todo": "warn",
    },
  },
  {
    plugins: {
      custom: {
        rules: {
          "ticket-todo": {
            meta: {
              type: "problem",
              docs: {
                description: "Ensure TODO comments contain a ticket ID",
                recommended: false,
              },
              schema: [],
              messages: {
                invalidComment:
                  "TODO comment must include a ticket ID in the format TODO PROJECT-123: \n\t'{{comment}}'",
              },
            },
            create(context) {
              const sourceCode = context.getSourceCode();
              const todoPattern = /\bTODO\b/i;
              const allowedPattern = /\bTODO\b:? \w+-\d+/i;

              return {
                Program() {
                  const comments = sourceCode.getAllComments();
                  comments.forEach((comment) => {
                    const trimmedComment = comment.value.trim();
                    if (!todoPattern.test(trimmedComment)) {
                      return;
                    }
                    if (!allowedPattern.test(trimmedComment)) {
                      context.report({
                        node: comment,
                        loc: comment.loc,
                        messageId: "invalidComment",
                        data: {
                          comment: trimmedComment,
                        },
                      });
                    }
                  });
                },
              };
            },
          },
        },
      },
    },
  },
];
