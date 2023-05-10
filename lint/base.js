const maxLines = 500;

let parserOptions = {
    ecmaVersion: 2020,
    sourceType: 'module'
};

module.exports = {
    root: true,
    extends: ['eslint:recommended', 'prettier'],
    plugins: ['unused-imports'],
    parserOptions,
    env: {
        browser: false,
        es6: true
    },
    ignorePatterns: [
        'coverage/',
        'test-results/',
        'dist/',
        'target/',
        'webapps-common/',
        'knime-ui-extension-service/',
        'knime-js-pagebuilder/'
    ],
    rules: {
        'accessor-pairs': 'warn',
        'array-callback-return': 'error',
        'arrow-body-style': ['error', 'as-needed'],
        'block-scoped-var': 'error',
        camelcase: 'error',
        'class-methods-use-this': 'warn',
        complexity: 'warn',
        'consistent-return': 'warn',
        'consistent-this': ['warn', 'self'],
        curly: 'error',
        'dot-notation': ['warn'],
        eqeqeq: 'error',
        'func-name-matching': 'warn',
        'func-style': 'warn',
        'handle-callback-err': ['warn', '^err(or)?$'],
        'lines-between-class-members': [
            'warn',
            'always',
            { exceptAfterSingleLine: true }
        ],
        'max-depth': 'warn',
        'max-lines': ['warn', {
            max: maxLines,
            skipBlankLines: true,
            skipComments: true
        }],
        'max-nested-callbacks': ['warn', 4],
        'max-params': ['warn', 4],
        'max-statements-per-line': ['warn', { max: 2 }],
        'new-cap': 'warn',
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
        'no-undef-init': 'error',
        'no-undefined': 'error',
        'no-unmodified-loop-condition': 'warn',
        'no-unneeded-ternary': 'error',
        'no-unused-expressions': 'warn',
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
        'no-with': 'warn',
        'object-shorthand': 'warn',
        'one-var': ['error', {
            initialized: 'never',
            uninitialized: 'consecutive'
        }],
        'operator-assignment': 'warn',
        'prefer-arrow-callback': 'warn',
        'prefer-promise-reject-errors': 'warn',
        'prefer-rest-params': 'warn',
        'prefer-spread': 'warn',
        'prefer-template': 'error',
        quotes: ['warn', 'double', {
            avoidEscape: true,
            allowTemplateLiterals: false // see https://github.com/prettier/eslint-config-prettier/#quotes
        }],
        radix: 'error',
        'require-atomic-updates': 'off',
        'require-await': 'error',
        'spaced-comment': ['warn', 'always', {
            block: {
                markers: ['/', '*', '!'],
                balanced: true
            }
        }],
        yoda: ['error', 'never', { exceptRange: true }],

        'no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'error',
            {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'after-used',
                argsIgnorePattern: '^_',
                ignoreRestSiblings: true
            }
        ]
    },
    overrides: [{
        files: ['.eslintrc*.{js,cjs}'],
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
        files: ['config.{js,ts,mjs,cjs}', '*.config.{js,ts,mjs,cjs}', 'config/**'],
        rules: {
            camelcase: 'off',
            'no-magic-numbers': 'off',
            'no-process-env': 'off'
        },
        env: {
            node: true
        }
    }]
};
