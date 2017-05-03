const globals = require('globals');

const IS_BROWSER = '__BROWSER__';
const IS_NODEJS = '__NODE__';

module.exports = {
  meta: {
    schema: [
      {
        type: 'object',
        properties: {
          typeof: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0];
    const considerTypeOf = (options && options.typeof === true) || false;

    return {
      'Program:exit'(node) {
        const globalScope = context.getScope();

        globalScope.through.forEach(ref => {
          const identifier = ref.identifier;
          if (!considerTypeOf && hasTypeOfOperator(identifier)) {
            return;
          }

          const env = lookupEnv(identifier);
          if (env === IS_BROWSER) {
            if (globals.browser.hasOwnProperty(identifier.name)) {
              return;
            }
          } else if (env === IS_NODEJS) {
            if (globals.node.hasOwnProperty(identifier.name)) {
              return;
            }
          }

          context.report({
            node: identifier,
            message: "'{{name}}' is not defined.",
            data: identifier,
          });
        });
      },
    };
  },
};

function matchesEnv(id) {
  return id === IS_BROWSER || id === IS_NODEJS;
}

function inverseEnv(env) {
  return env === IS_BROWSER ? IS_NODEJS : IS_BROWSER;
}

// TODO: memoize
function lookupEnv(node) {
  let parent = node.parent;
  while (parent) {
    if (parent.type === 'IfStatement' && parent.test.type === 'Identifier') {
      if (matchesEnv(parent.test.name)) {
        return parent.test.name;
      }
    } else if (
      parent.type === 'ConditionalExpression' &&
      parent.test.type === 'Identifier'
    ) {
      if (matchesEnv(parent.test.name)) {
        return node === parent.consequent
          ? parent.test.name
          : inverseEnv(parent.test.name);
      }
    }
    node = parent;
    parent = parent.parent;
  }
}

function hasTypeOfOperator(node) {
  const parent = node.parent;
  return parent.type === 'UnaryExpression' && parent.operator === 'typeof';
}
