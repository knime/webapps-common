import stylelint from "stylelint";

const {
  createPlugin,
  utils: { report, validateOptions },
} = stylelint;

const ruleName = "knime/no-deep-nesting";

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected:
    "Unexpected nesting inside :deep() selector. " +
    "Inline the nested selector into :deep() instead " +
    "(see https://github.com/vuejs/core/issues/13159).",
});

const meta = {
  url: "https://github.com/vuejs/core/issues/13159",
};

/**
 * Check if a selector string contains a :deep() pseudo-class.
 */
const hasDeepSelector = (selector) => /:deep\(/.test(selector);

const ruleFunction = (primary) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    });

    if (!validOptions) {
      return;
    }

    root.walkRules((rule) => {
      // Check if this rule's selector contains :deep()
      if (!hasDeepSelector(rule.selector)) {
        return;
      }

      // Check if there are nested rules inside this :deep() rule
      rule.walkRules((nestedRule) => {
        report({
          message: messages.rejected,
          node: nestedRule,
          result,
          ruleName,
        });
      });
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default createPlugin(ruleName, ruleFunction);
