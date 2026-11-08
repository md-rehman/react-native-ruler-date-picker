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

function getTagName(node: any): string | null {
  if (!node || node.type !== 'JSXElement') return null;
  const nameNode = node.openingElement?.name;
  if (!nameNode) return null;
  if (nameNode.type === 'JSXIdentifier') return nameNode.name;
  if (nameNode.type === 'JSXMemberExpression') {
    const obj = nameNode.object?.name;
    const prop = nameNode.property?.name;
    return `${obj}.${prop}`;
  }
  return null;
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

function findHookCall(node: any): { call: any; hookName: string } | null {
  if (!node) return null;
  if (node.type === 'CallExpression') {
    const callee = node.callee;
    if (
      callee?.type === 'Identifier' &&
      [
        'useRulerDatePicker',
        'useRulerDateRangePicker',
        'useRulerContext',
        'useRulerRangeContext',
      ].includes(callee.name)
    ) {
      return { call: node, hookName: callee.name };
    }
  }

  for (const key of Object.keys(node)) {
    if (typeof node[key] === 'object' && node[key] !== null) {
      if (Array.isArray(node[key])) {
        for (const item of node[key]) {
          const found = findHookCall(item);
          if (found) return found;
        }
      } else {
        const found = findHookCall(node[key]);
        if (found) return found;
      }
    }
  }
  return null;
}

function extractTextContent(node: any): string | null {
  if (!node) return null;
  if (node.type === 'JSXText') {
    const t = node.value.trim();
    return t || null;
  }
  if (node.type === 'StringLiteral') {
    return node.value;
  }
  if (node.type === 'JSXExpressionContainer') {
    return extractTextContent(node.expression);
  }
  if (node.children && Array.isArray(node.children)) {
    const parts: string[] = [];
    for (const child of node.children) {
      const res = extractTextContent(child);
      if (res) parts.push(res);
    }
    return parts.length > 0 ? parts.join(' ') : null;
  }
  return null;
}

function getAttributes(elem: any, sourceCode: string): Record<string, any> {
  const attrs: Record<string, any> = {};
  if (!elem.openingElement?.attributes) return attrs;

  for (const attr of elem.openingElement.attributes) {
    if (attr.type === 'JSXAttribute' && attr.name?.name) {
      const propName = attr.name.name;
      if (propName === 'onChange') continue;

      if (attr.value === null) {
        attrs[propName] = true;
      } else if (attr.value.type === 'StringLiteral') {
        attrs[propName] = attr.value.value;
      } else if (attr.value.type === 'JSXExpressionContainer') {
        const val = evaluateExpression(attr.value.expression, sourceCode);
        if (val !== undefined) {
          attrs[propName] = val;
        }
      }
    }
  }
  return attrs;
}

function extractSubcomponents(ast: any, sourceCode: string): Record<string, any> {
  const result: Record<string, any> = {};

  function traverse(node: any) {
    if (!node) return;
    if (node.type === 'JSXElement') {
      const tagName = getTagName(node);
      const attrs = getAttributes(node, sourceCode);

      // ── Reset Button ──
      if (tagName === 'Ruler.ResetButton' || tagName === 'RulerResetButton') {
        if (attrs.label) {
          result.resetButtonLabel = attrs.label;
          result.buttonLabel = attrs.label;
        }
        const text = extractTextContent(node);
        if (text && !result.resetButtonLabel) {
          result.resetButtonLabel = text;
          result.buttonLabel = text;
        }
        if (attrs.style) result.resetButtonStyle = attrs.style;
        if (attrs.textStyle) result.resetButtonTextStyle = attrs.textStyle;
      }

      // ── Header ──
      if (
        tagName === 'Ruler.Header' ||
        tagName === 'RulerHeader' ||
        tagName === 'RulerRange.Header' ||
        tagName === 'RulerRangeHeader'
      ) {
        if ('showResetToToday' in attrs) {
          result.headerShowReset = attrs.showResetToToday;
        }
        if (attrs.resetLabel) {
          result.headerResetLabel = attrs.resetLabel;
          if (!result.buttonLabel) result.buttonLabel = attrs.resetLabel;
        }
      }

      // ── Track ──
      if (
        tagName === 'Ruler.Track' ||
        tagName === 'RulerTrack' ||
        tagName === 'Ruler.LensTrack' ||
        tagName === 'RulerLensTrack' ||
        tagName === 'RulerRange.Track' ||
        tagName === 'RulerRangeTrack'
      ) {
        if (attrs.height !== undefined) {
          result.rulerHeight = attrs.height;
        }
      }

      // ── Indicator ──
      if (
        tagName === 'Ruler.Indicator' ||
        tagName === 'RulerIndicator' ||
        tagName === 'RulerRange.Indicator' ||
        tagName === 'RulerRangeIndicator'
      ) {
        if (attrs.style) {
          result.indicatorStyle = attrs.style;
        }
        // Inspect children for custom needle View
        for (const child of node.children || []) {
          if (child.type === 'JSXElement' && child.openingElement?.name?.name === 'View') {
            const childAttrs = getAttributes(child, sourceCode);
            if (childAttrs.style) {
              result.customStyle = childAttrs.style;
              if (childAttrs.style.backgroundColor) {
                result.customColor = childAttrs.style.backgroundColor;
              }
              if (childAttrs.style.borderTopColor) {
                result.customColor = childAttrs.style.borderTopColor;
              }
              if (childAttrs.style.transform && Array.isArray(childAttrs.style.transform)) {
                for (const t of childAttrs.style.transform) {
                  if (t.rotate) result.customRotate = t.rotate;
                }
              }
            }
          }
        }
      }

      // ── Standalone TouchableOpacity / Pressable / Button ──
      if (tagName === 'TouchableOpacity' || tagName === 'Pressable' || tagName === 'Button') {
        const text = extractTextContent(node);
        if (text && !result.buttonLabel) {
          result.buttonLabel = text;
        }
      }
    }

    for (const key of Object.keys(node)) {
      if (typeof node[key] === 'object' && node[key] !== null) {
        if (Array.isArray(node[key])) {
          for (const item of node[key]) traverse(item);
        } else {
          traverse(node[key]);
        }
      }
    }
  }

  traverse(ast);
  return result;
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

    const foundRuler = findRulerElement(ast);
    const foundHook = findHookCall(ast);
    const subcomponents = extractSubcomponents(ast, codeString);

    if (!foundRuler && !foundHook && Object.keys(subcomponents).length === 0) {
      return {
        success: false,
        props: null,
        error: { message: 'Ruler component or hook not found in code' },
      };
    }

    const extractedProps: Record<string, any> = { ...subcomponents };

    if (foundRuler) {
      const { element: rulerElement } = foundRuler;
      const rootAttrs = getAttributes(rulerElement, codeString);
      Object.assign(extractedProps, rootAttrs);
    }

    if (foundHook) {
      const { call } = foundHook;
      const arg = call.arguments?.[0];
      if (arg && arg.type === 'ObjectExpression') {
        for (const prop of arg.properties) {
          if (prop.type === 'ObjectProperty' && (prop.key?.name || prop.key?.value)) {
            const propName = prop.key.name || prop.key.value;
            if (propName === 'onChange' || propName === 'value') continue;
            const val = evaluateExpression(prop.value, codeString);
            if (val !== undefined) {
              extractedProps[propName] = val;
            }
          }
        }
      }
    }

    return {
      success: true,
      props: extractedProps,
      detectedComponent: foundRuler?.componentName ?? foundHook?.hookName,
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
