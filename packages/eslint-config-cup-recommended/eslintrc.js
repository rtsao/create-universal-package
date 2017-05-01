module.exports = {
  rules: {
    //////////////////////////////////////////////////////////////////
    // Possible errors
    // http://eslint.org/docs/rules/#possible-errors
    // Exhaustive list of rules as of Feb 13, 2017
    //////////////////////////////////////////////////////////////////
    /**
     * TODO: decide if this rule should be on
     */
    'no-await-in-loop': 'off',
    /**
     * TODO: decide if this rule should be on
     */
    'no-cond-assign': 'off',
    /**
     * Prevent accidental console.log
     */
    'no-console': 'error',
    /**
     * TODO: decide if this rule should be on
     */
    'no-constant-condition': 'off',
    /**
     * TODO: decide if this rule should be on
     */
    'no-control-regex': 'off',
    /**
     * Prevent accidental debugger
     */
    'no-debugger': 'error',
    /**
     * There should never be duplicate parameters in function declaration/expressions
     */
    'no-dupe-args': 'error',
    /**
     * There should never be duplicate keys in object literals
     */
    'no-dupe-keys': 'error',
    /**
     * There should never be duplicate case labels
     */
    'no-duplicate-case': 'error',
    /**
     * There should never be empty regex character classes
     */
    'no-empty-character-class': 'error',
    /**
     * Disallow empty blocks except for catch clauses
     */
    'no-empty': ['error', {allowEmptyCatch: true}],
    /**
     * There should never be exception re-assignment in catch clauses
     */
    'no-ex-assign': 'error',
    /**
     * There should never be redundant boolean casting
     */
    'no-extra-boolean-cast': 'error',
    /**
     * Extra parens can make things more clear.
     * Furthermore, prettier will dictate this.
     */
    'no-extra-parens': 'off',
    /**
     * Prettier dictates this
     */
    'no-extra-semi': 'off',
    /**
     * Function declarations should never be re-assigned
     */
    'no-func-assign': 'error',
    /**
     * TODO: some discussion on this may be needed.
     * But this rule is obsolete in ES6, as block-scoped function declarations are ok
     */
    'no-inner-declarations': 'off',
    /**
     * There should never be invalid strings in RegExp constructors
     */
    'no-invalid-regexp': 'error',
    /**
     * There should never be irregular whitespace
     */
    'no-irregular-whitespace': 'error',
    /*
     * TODO: this is redundant in flow
     * Global object properties should never be called as functions
     */
    'no-obj-calls': 'error',
    /**
     * This rule is off because it can be annoying.
     * Calling built-in prototype methods is convenient.
     * We usually work with object literals so it's fine
     * to assume prototype methods exist
     */
    'no-prototype-builtins': 'off',
    /**
     * There should never be multiple spaces in regular expressions
     */
    'no-regex-spaces': 'error',
    /**
     * There should never be sparse arrays
     */
    'no-sparse-arrays': 'error',
    /**
     * This rule off because isn't very useful
     */
    'no-template-curly-in-string': 'off',
    /**
     * TODO: is this rule affected by semis and/or prettier?
     */
    'no-unexpected-multiline': 'error',
    /**
     * TODO: this rule is made reduntant by Flow
     */
    'no-unreachable': 'off',
    /**
     * There should never be flow control in finally blocks
     */
    'no-unsafe-finally': 'error',
    /**
     * TODO: decide on this rule
     */
    'no-unsafe-negation': 'off',
    /**
     * The isNaN function should always be used when checking for NaN
     */
    'use-isnan': 'error',
    /**
     * This rule is off because it's not useful. We don't use JSDoc.
     */
    'valid-jsdoc': 'off',
    /**
     * This protects against typos in string literals in conjuction with typeof
     */
    'valid-typeof': 'error',

    ////////////////////////////////////////////////////////////////
    // Best Practices
    // http://eslint.org/docs/rules/#best-practices
    // Note: this list is NOT exhaustive
    //////////////////////////////////////////////////////////////////
    /**
     * Never allow empty destructuring
     */
    'no-empty-pattern': 'error',
    /**
     * Variables should never be re-declared
     */
    'no-redeclare': 'error',
    /**
     * There should never be redundant variable self-assignment
     */
    'no-self-assign': 'error',

    //////////////////////////////////////////////////////////////////
    // Variables
    // http://eslint.org/docs/rules/#variables
    // Exhaustive list of rules as of Feb 15, 2017
    //////////////////////////////////////////////////////////////////
    /**
     * Use 'env/no-undef-env' instead. 'no-undef' is also turned off by `eslint-config-cup`
     */
    'no-undef': 'off',
    /**
     * Variable shadowing should never be allowed
     */
    'no-shadow': 'error',
    /**
     * TODO: is this needed if no-shadow is on?
     * disallow identifiers from shadowing restricted names. For example, var undefined = 'foo';
     * This can cause unexpected behavior, and makes code very difficult to read.
     */
    'no-shadow-restricted-names': 'error',
    /**
     * This is partially taken care of by let vs const, and it does not really matter.
     */
    'init-declarations': 'off',
    /**
    * disallow catch clause parameters from shadowing variables in the outer scope
    */
    'no-catch-shadow': 'error',
    /**
    * delete should only be used to delete properties from objects
    */
    'no-delete-var': 'error',
    /**
     * disallow labels that share a name with a variable. While this does not cause an error,
     * it leads to confusion as the take identifier refers to different things in different contexts
    */
    'no-label-var': 'error',
    /**
     * TODO: We may want to use this to dissallow certain globals in browser code.
     * For the base, we will turn it off as we don't have enough context as to what globals to turn on and off
    */
    'no-restricted-globals': 'off',
    /**
    * disallow initializing variables to undefined. Variables should be initialized with null instead.
    */
    'no-undef-init': 'error',
    /**
    * Use typeof "undefined" instead of === undefined, and never initialize something to undefined.
    */
    'no-undefined': 'error',
    /**
     * Unused variables can lead to unnecessary code execution or bundling.
     * In library code, unused function parameters is confusing for readers and may indicate incomplete
     * refactoring.
     */
    'no-unused-vars': ['error', {vars: 'all', args: 'after-used'}],
    /**
    * TODO: Do we want this turned on? Hoisting can be nice for organizing functions in a file.
    */
    'no-use-before-define': 'off',

    //////////////////////////////////////////////////////////////////
    // ECMAScript 6
    // http://eslint.org/docs/rules/#ecmascript-6
    // Note: this list is NOT exhaustive
    //////////////////////////////////////////////////////////////////
    /**
     * Never allow `const` declarations to be re-assigned
     */
    'no-const-assign': 'error',
    /**
     * Class declarations should never be re-assigned
     */
    'no-class-assign': 'error',
    /**
     * We should use const everywhere when possible
     */
    'prefer-const': 'error',
    /**
     * There should never be duplicate class members
     */
    'no-dupe-class-members': 'error',
  },
};
