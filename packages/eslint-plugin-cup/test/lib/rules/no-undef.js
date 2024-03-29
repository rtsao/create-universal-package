const rule = require('../../../lib/rules/no-undef');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

ruleTester.run('no-undef', rule, {
  valid: [
    // env stuff
    {
      code: 'function a(){}if (__BROWSER__) {a(window)}',
      globals: {__BROWSER__: false},
    },
    {
      code: 'function a(){}if (__NODE__) {a(__dirname)}',
      globals: {__NODE__: false},
    },
    {
      code: 'function a(){}if (__BROWSER__) {a(window)} else {a(process)}',
      globals: {__BROWSER__: false},
    },
    {code: 'var foo = __NODE__ ? process : window', globals: {__NODE__: false}},

    'var a = 1, b = 2; a;',
    '/*global b*/ function f() { b; }',
    {code: 'function f() { b; }', globals: {b: false}},
    {code: 'function f() { b; }', globals: {b: false}},
    '/*global b a:false*/  a;  function f() { b; a; }',
    'function a(){}  a();',
    'function f(b) { b; }',
    'var a; a = 1; a++;',
    'var a; function f() { a = 1; }',
    '/*global b:true*/ b++;',
    '/*eslint-env browser*/ window;',
    '/*eslint-env browser*/ window;',
    '/*eslint-env node*/ require("a");',
    'Object; isNaN();',
    'toString()',
    'hasOwnProperty()',
    'function evilEval(stuffToEval) { var ultimateAnswer; ultimateAnswer = 42; eval(stuffToEval); }',
    'typeof a',
    'typeof (a)',
    'var b = typeof a',
    "typeof a === 'undefined'",
    "if (typeof a === 'undefined') {}",
    {
      code: 'function foo() { var [a, b=4] = [1, 2]; return {a, b}; }',
      parserOptions: {ecmaVersion: 6},
    },
    {code: 'var toString = 1;', parserOptions: {ecmaVersion: 6}},
    {
      code: 'function myFunc(...foo) {  return foo;}',
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: 'var React, App, a=1; React.render(<App attr={a} />);',
      parserOptions: {ecmaVersion: 6, ecmaFeatures: {jsx: true}},
    },
    {
      code: 'var console; [1,2,3].forEach(obj => {\n  console.log(obj);\n});',
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: 'var Foo; class Bar extends Foo { constructor() { super();  }}',
      parserOptions: {ecmaVersion: 6},
    },
    {
      code:
        "import Warning from '../lib/warning'; var warn = new Warning('text');",
      parserOptions: {ecmaVersion: 2015, sourceType: 'module'},
    },
    {
      code:
        "import * as Warning from '../lib/warning'; var warn = new Warning('text');",
      parserOptions: {ecmaVersion: 2015, sourceType: 'module'},
    },
    {code: 'var a; [a] = [0];', parserOptions: {ecmaVersion: 6}},
    {code: 'var a; ({a} = {});', parserOptions: {ecmaVersion: 6}},
    {code: 'var a; ({b: a} = {});', parserOptions: {ecmaVersion: 6}},
    {
      code: 'var obj; [obj.a, obj.b] = [0, 1];',
      parserOptions: {ecmaVersion: 6},
    },
    {code: 'URLSearchParams;', env: {browser: true}},
    {code: 'Intl;', env: {browser: true}},
    {code: 'IntersectionObserver;', env: {browser: true}},
    {code: 'Credential;', env: {browser: true}},
    {code: 'requestIdleCallback;', env: {browser: true}},
    {code: 'customElements;', env: {browser: true}},
    {code: 'PromiseRejectionEvent;', env: {browser: true}},

    // Notifications of readonly are removed: https://github.com/eslint/eslint/issues/4504
    {code: '/*global b:false*/ function f() { b = 1; }'},
    {code: 'function f() { b = 1; }', globals: {b: false}},
    {code: '/*global b:false*/ function f() { b++; }'},
    {code: '/*global b*/ b = 1;'},
    {code: '/*global b:false*/ var b = 1;'},
    {code: 'Array = 1;'},

    // new.target: https://github.com/eslint/eslint/issues/5420
    {
      code: 'class A { constructor() { new.target; } }',
      parserOptions: {ecmaVersion: 6},
    },

    // sourceType: 'module'
    {
      code: 'function a(){}if (__BROWSER__) {a(window)}',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
      globals: {
        __BROWSER__: false,
      },
    },

    // Experimental,
    {
      code: 'var {bacon, ...others} = stuff; foo(others)',
      parserOptions: {
        ecmaVersion: 2018,
      },
      globals: {stuff: false, foo: false},
    },
  ],
  invalid: [
    {
      code: 'a = 1;',
      errors: [{message: "'a' is not defined.", type: 'Identifier'}],
    },
    {
      code: "if (typeof anUndefinedVar === 'string') {}",
      options: [{typeof: true}],
      errors: [
        {message: "'anUndefinedVar' is not defined.", type: 'Identifier'},
      ],
    },
    {
      code: 'var a = b;',
      errors: [{message: "'b' is not defined.", type: 'Identifier'}],
    },
    {
      code: 'function f() { b; }',
      errors: [{message: "'b' is not defined.", type: 'Identifier'}],
    },
    {
      code: 'window;',
      errors: [{message: "'window' is not defined.", type: 'Identifier'}],
    },
    {
      code: 'require("a");',
      errors: [{message: "'require' is not defined.", type: 'Identifier'}],
    },
    {
      code: 'var React; React.render(<img attr={a} />);',
      errors: [{message: "'a' is not defined."}],
      parserOptions: {ecmaVersion: 6, ecmaFeatures: {jsx: true}},
    },
    {
      code: 'var React, App; React.render(<App attr={a} />);',
      errors: [{message: "'a' is not defined."}],
      parserOptions: {ecmaVersion: 6, ecmaFeatures: {jsx: true}},
    },
    {
      code: '[a] = [0];',
      parserOptions: {ecmaVersion: 6},
      errors: [{message: "'a' is not defined."}],
    },
    {
      code: '({a} = {});',
      parserOptions: {ecmaVersion: 6},
      errors: [{message: "'a' is not defined."}],
    },
    {
      code: '({b: a} = {});',
      parserOptions: {ecmaVersion: 6},
      errors: [{message: "'a' is not defined."}],
    },
    {
      code: '[obj.a, obj.b] = [0, 1];',
      parserOptions: {ecmaVersion: 6},
      errors: [
        {message: "'obj' is not defined."},
        {message: "'obj' is not defined."},
      ],
    },

    // Experimental
    {
      code: 'const c = 0; const a = {...b, c};',
      parserOptions: {
        ecmaVersion: 2018,
      },
      errors: [{message: "'b' is not defined."}],
    },
  ],
});
