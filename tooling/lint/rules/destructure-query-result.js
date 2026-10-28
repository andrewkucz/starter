const hookNames = new Set(["useQuery", "useMutation"]);

function getHookName(callee, context) {
  if (callee.type === "Identifier") {
    if (hookNames.has(callee.name)) return callee.name;

    // Follow renamed imports through scope so shadowed aliases are not mistaken for hooks.
    for (let scope = context.sourceCode.getScope(callee); scope; scope = scope.upper) {
      const variable = scope.set.get(callee.name);
      if (!variable) continue;
      const specifier = variable.defs[0]?.node;
      if (specifier?.type === "ImportSpecifier") {
        const name = specifier.imported.name ?? specifier.imported.value;
        if (hookNames.has(name)) return name;
      }
      break;
    }
  }
  if (callee.type === "MemberExpression") {
    const name = callee.computed ? callee.property.value : callee.property.name;
    if (hookNames.has(name)) return name;
  }
}

export default {
  meta: {
    type: "suggestion",
    docs: { description: "Require object destructuring for useQuery and useMutation results." },
    schema: [],
    messages: {
      destructure:
        "Destructure the {{hook}} result instead of storing it in a single variable. Rename properties when needed.",
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        const hook = getHookName(node.callee, context);
        if (!hook) return;
        let expression = node;
        while (
          [
            "TSAsExpression",
            "TSSatisfiesExpression",
            "TSNonNullExpression",
            "TSTypeAssertion",
          ].includes(expression.parent.type)
        ) {
          expression = expression.parent;
        }
        const parent = expression.parent;
        const target =
          parent.type === "VariableDeclarator" && parent.init === expression
            ? parent.id
            : parent.type === "AssignmentExpression" && parent.right === expression
              ? parent.left
              : null;
        if (target && target.type !== "ObjectPattern") {
          context.report({ node: target, messageId: "destructure", data: { hook } });
        }
      },
    };
  },
};
