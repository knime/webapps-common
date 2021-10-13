const eslint = require('eslint');

const indentationSpaces = 4;
const jsonIndentationSpaces = 2;
const lineLength = 120;

let eslintVersion = eslint.Linter.version.split('.')[0];
let ecmaVersion = eslintVersion <= 5 ? 2019 : 2020;
let parser = eslintVersion < 7 ? 'babel-eslint' : null;

let parserOptions = {
    ecmaVersion,
    sourceType: 'module',
    parser
};

module.exports = {
    root: true,
    extends: ['eslint:recommended', 'plugin:jsonc/recommended-with-json'],
    parserOptions,
    env: {
        browser: false,
        es6: true
    },
    plugins: ['jest-formatting'],
    rules: {
        'accessor-pairs': 'warn',
        'array-bracket-newline': ['error', 'consistent'],
        'array-bracket-spacing': 'error',
        'array-callback-return': 'error',
        'arrow-body-style': ['error', 'as-needed'],
        'arrow-spacing': 'error',
        'block-scoped-var': 'error',
        'block-spacing': 'error',
        'brace-style': ['error', '1tbs', { allowSingleLine: true }],
        camelcase: 'error',
        'class-methods-use-this': 'warn',
        'comma-dangle': 'warn',
        'comma-spacing': 'error',
        'comma-style': 'error',
        complexity: 'warn',
        'computed-property-spacing': 'error',
        'consistent-return': 'warn',
        'consistent-this': ['warn', 'self'],
        curly: 'error',
        'dot-notation': ['warn'],
        'eol-last': 'error',
        eqeqeq: 'error',
        'func-call-spacing': 'error',
        'func-name-matching': 'warn',
        'func-style': 'warn',
        'function-paren-newline': ['warn', 'consistent'],
        'generator-star-spacing': 'warn',
        'handle-callback-err': ['warn', '^err(or)?$'],
        'implicit-arrow-linebreak': 'error',
        indent: ['error', indentationSpaces, {
            SwitchCase: 0
        }],
        'key-spacing': 'error',
        'keyword-spacing': 'error',
        'linebreak-style': ['error', 'unix'],
        'lines-between-class-members': 'warn',
        'max-depth': 'warn',
        'max-len': ['warn', {
            code: lineLength,
            ignoreComments: true,
            ignoreRegExpLiterals: true,
            ignoreStrings: false,
            ignoreTemplateLiterals: false,
            ignoreTrailingComments: true,
            ignoreUrls: true
        }],
        'max-lines': ['warn', {
            skipBlankLines: true,
            skipComments: true
        }],
        'max-nested-callbacks': ['warn', 4],
        'max-params': ['warn', 4],
        'max-statements-per-line': ['warn', { max: 2 }],
        'multiline-ternary': ['error', 'always-multiline'],
        'new-cap': 'warn',
        'new-parens': 'error',
        'no-array-constructor': 'warn',
        'no-async-promise-executor': 'off',
        'no-bitwise': 'warn',
        'no-buffer-constructor': 'error',
        'no-console': 'error',
        'no-duplicate-imports': 'error',
        'no-empty-function': ['error', { allow: ['arrowFunctions'] }],
        'no-extend-native': 'warn',
        'no-extra-boolean-cast': 'warn',
        'no-extra-label': 'error',
        'no-extra-parens': ['warn', 'all', { nestedBinaryExpressions: false }],
        'no-implicit-coercion': 'warn',
        'no-implied-eval': 'error',
        'no-invalid-this': 'warn',
        'no-iterator': 'error',
        'no-lone-blocks': 'warn',
        'no-lonely-if': 'warn',
        'no-magic-numbers': ['warn', {
            ignore: [-1, 0, 1, 2, 100, 1000],
            ignoreArrayIndexes: true,
            enforceConst: true
        }],
        'no-misleading-character-class': 'off',
        'no-mixed-operators': ['warn', { groups: [['&', '|', '^', '~', '<<', '>>', '>>>'], ['&&', '||']] }],
        'no-multiple-empty-lines': ['error', {
            max: 2,
            maxBOF: 0,
            maxEOF: 1
        }],
        'no-multi-spaces': 'error',
        'no-negated-condition': 'error',
        'no-nested-ternary': 'warn',
        'no-new-func': 'warn',
        'no-new-object': 'error',
        'no-new-require': 'error',
        'no-new-wrappers': 'error',
        'no-path-concat': 'warn',
        'no-process-env': 'error',
        'no-process-exit': 'warn',
        'no-proto': 'error',
        'no-prototype-builtins': 'off',
        'no-restricted-globals': ['error', 'event', 'fdescribe'],
        'no-restricted-syntax': ['warn', 'WithStatement', 'SequenceExpression'],
        'no-return-assign': 'error',
        'no-return-await': 'error',
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-shadow-restricted-names': 'error',
        'no-tabs': 'error',
        'no-template-curly-in-string': 'warn',
        'no-throw-literal': 'warn',
        'no-trailing-spaces': ['error', { skipBlankLines: true }],
        'no-undef-init': 'error',
        'no-undefined': 'error',
        'no-unmodified-loop-condition': 'warn',
        'no-unneeded-ternary': 'error',
        'no-unused-expressions': 'warn',
        'no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: false }],
        'no-use-before-define': 'error',
        'no-useless-call': 'warn',
        'no-useless-catch': 'off',
        'no-useless-computed-key': 'error',
        'no-useless-concat': 'warn',
        'no-useless-constructor': 'error',
        'no-useless-rename': 'error',
        'no-useless-return': 'warn',
        'no-var': 'error',
        'no-void': 'warn',
        'no-warning-comments': 'warn',
        'no-whitespace-before-property': 'error',
        'no-with': 'warn',
        'object-curly-newline': ['error', {
            ObjectExpression: { consistent: true },
            ObjectPattern: { consistent: true },
            ImportDeclaration: 'never',
            ExportDeclaration: { consistent: true }
        }],
        'object-curly-spacing': ['error', 'always'],
        'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
        'object-shorthand': 'warn',
        'one-var': ['error', {
            initialized: 'never',
            uninitialized: 'consecutive'
        }],
        'operator-assignment': 'warn',
        'operator-linebreak': 'error',
        'padded-blocks': ['error', 'never'],
        'prefer-arrow-callback': 'warn',
        'prefer-promise-reject-errors': 'warn',
        'prefer-rest-params': 'warn',
        'prefer-spread': 'warn',
        'prefer-template': 'error',
        'quote-props': ['error', 'as-needed', { numbers: true }],
        quotes: ['warn', 'single', {
            avoidEscape: true,
            allowTemplateLiterals: true
        }],
        radix: 'error',
        'require-atomic-updates': 'off',
        'require-await': 'error',
        'rest-spread-spacing': 'error',
        semi: ['error', 'always'],
        'semi-spacing': 'error',
        'semi-style': 'error',
        'space-before-blocks': 'error',
        'space-before-function-paren': ['error', {
            anonymous: 'always',
            named: 'never',
            asyncArrow: 'always'
        }],
        'space-in-parens': 'error',
        'space-infix-ops': 'error',
        'space-unary-ops': 'error',
        'spaced-comment': ['warn', 'always', {
            block: {
                markers: ['/', '*', '!'],
                balanced: true
            }
        }],
        'switch-colon-spacing': 'error',
        'template-curly-spacing': 'warn',
        'template-tag-spacing': 'error',
        'unicode-bom': 'error',
        'valid-jsdoc': ['warn', {
            requireReturnDescription: false,
            requireParamDescription: false
        }],
        'wrap-iife': ['error', 'inside', { functionPrototypeMethods: true }],
        yoda: ['error', 'never', { exceptRange: true }]
    },
    overrides: [{
        files: ['.eslintrc*.js'],
        // this is required for .eslintrc-legacy, which overrides parserOptions in root
        parserOptions: { ...parserOptions },
        env: {
            browser: false,
            node: true
        },
        rules: {
            'no-magic-numbers': 'off'
        }
    }, {
        files: ['*.test.js'],
        rules: {
            'jest-formatting/padding-around-after-all-blocks': 'error',
            'jest-formatting/padding-around-after-each-blocks': 'error',
            'jest-formatting/padding-around-before-all-blocks': 'error',
            'jest-formatting/padding-around-before-each-blocks': 'error',
            'jest-formatting/padding-around-describe-blocks': 'error',
            'jest-formatting/padding-around-test-blocks': 'error',
            'no-undefined': 'off'
        }
    }, {
        files: ['*.json'],
        parser: 'jsonc-eslint-parser',
        rules: {
            'jsonc/auto': 'off',
            'max-len': 'off',
            'max-depth': 'off',
            'max-lines': 'off',
            semi: 'off',
            'jsonc/indent': ['error', jsonIndentationSpaces],
            'jsonc/object-curly-newline': ['error', 'always'],
            'jsonc/array-bracket-spacing': ['error', 'never'],
            'jsonc/array-bracket-newline': ['error', 'always'],
            'jsonc/array-element-newline': ['error', 'always'],
            'jsonc/object-property-newline': ['error'],
            'jsonc/key-spacing': ['error', {
                beforeColon: false,
                afterColon: true,
                mode: 'strict'
            }]
        }
    }]
};
