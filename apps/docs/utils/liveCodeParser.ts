import { parse } from '@babel/parser';

export interface ParseResult {
  success: boolean;
  props: Record<string, any> | null;
  detectedComponent?: string;
  error: {
    message: string;
    line?: number;
    column?: number;
  } | null;
}

function getRulerComponentName(nameNode: any): string | null {
  if (!nameNode) return null;
  if (nameNode.type === 'JSXIdentifier') {
    if ([
      'RulerDatePicker',
      'RulerDateRangePicker',
      'RulerRoot',
      'RulerRangeRoot',
    ].includes(nameNode.name)) {
      return nameNode.name;
    }
  }
  if (nameNode.type === 'JSXMemberExpression') {
    const obj = nameNode.object?.name;
    const prop = nameNode.property?.name;
    if (obj === 'Ruler' && prop === 'Root') return 'RulerRoot';
    if (obj === 'RulerRange' && prop === 'Root') return 'RulerRangeRoot';
  }
  return null;
}

function findRulerElement(node: any): { element: any; componentName: string } | null {
  if (!node) return null;
  if (node.type === 'JSXElement') {
    const componentName = getRulerComponentName(node.openingElement?.name);
    if (componentName) {
      return { element: node, componentName };
    }
  }

  for (const key of Object.keys(node)) {
    if (typeof node[key] === 'object' && node[key] !== null) {
      if (Array.isArray(node[key])) {
        for (const item of node[key]) {
          const found = findRulerElement(item);
          if (found) return found;
        }
      } else {
        const found = findRulerElement(node[key]);
        if (found) return found;
      }
    }
  }
  return null;
}

/**
 * Safely evaluate an AST expression or literal.
 */
function evaluateExpression(expr: any, sourceCode: string): any {
  if (!expr) return undefined;
  if (expr.type === 'StringLiteral') return expr.value;
  if (expr.type === 'NumericLiteral') return expr.value;
  if (expr.type === 'BooleanLiteral') return expr.value;
  if (expr.type === 'NullLiteral') return null;

  if (expr.type === 'Identifier') {
    if (expr.name === 'undefined') return undefined;
    if (expr.name === 'true') return true;
    if (expr.name === 'false') return false;
    if (expr.name === 'DEFAULT_CALENDAR_TICKS') return 'calendar';
    if (expr.name === 'DEFAULT_METRIC_TICKS') return 'metric';
    if (expr.name === 'DEFAULT_MINIMAL_TICKS') return 'minimal';
    return expr.name;
  }

  // ObjectExpression, ArrayExpression, or complex expressions
  if (expr.start !== undefined && expr.end !== undefined) {
    const raw = sourceCode.slice(expr.start, expr.end);
    try {
      const scope = {
        DEFAULT_CALENDAR_TICKS: 'calendar',
        DEFAULT_METRIC_TICKS: 'metric',
        DEFAULT_MINIMAL_TICKS: 'minimal',
      };
      const fn = new Function(...Object.keys(scope), `return (${raw});`);
      return fn(...Object.values(scope));
    } catch {
      return undefined;
    }
  }

  return undefined;
}

/**
 * Parses user-edited JSX or full component code string and extracts component props.
 */
export function parseCodeToProps(codeString: string): ParseResult {
  if (!codeString || !codeString.trim()) {
    return {
      success: false,
      props: null,
      error: { message: 'Code is empty' },
    };
  }

  try {
    const ast = parse(codeString, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    const found = findRulerElement(ast);
    if (!found) {
      return {
        success: false,
        props: null,
        error: { message: 'Ruler component element not found in code' },
      };
    }

    const { element: rulerElement, componentName } = found;
    const extractedProps: Record<string, any> = {};

    for (const attr of rulerElement.openingElement.attributes) {
      if (attr.type === 'JSXAttribute' && attr.name?.name) {
        const propName = attr.name.name;

        // Skip onChange or synthetic event handlers
        if (propName === 'onChange') continue;

        // Boolean shorthand prop: e.g. <RulerDatePicker lensEffect />
        if (attr.value === null) {
          extractedProps[propName] = true;
        } else if (attr.value.type === 'StringLiteral') {
          extractedProps[propName] = attr.value.value;
        } else if (attr.value.type === 'JSXExpressionContainer') {
          const val = evaluateExpression(attr.value.expression, codeString);
          if (val !== undefined) {
            extractedProps[propName] = val;
          }
        }
      }
    }

    return {
      success: true,
      props: extractedProps,
      detectedComponent: componentName,
      error: null,
    };
  } catch (err: any) {
    const message = err.message ? err.message.replace(/\s\(\d+:\d+\)$/, '') : 'Syntax error';
    return {
      success: false,
      props: null,
      error: {
        message,
        line: err.loc?.line,
        column: err.loc?.column,
      },
    };
  }
}
