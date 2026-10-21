import type {
  TickContext,
  TickCondition,
  TickRule,
  ResolvedTick,
  ResolvedRulerTheme,
} from './types';
import { formatDateString } from './utils';

/**
 * Checks whether a given TickCondition matches the provided TickContext.
 */
export function matchesCondition(
  condition: TickCondition | undefined,
  ctx: TickContext
): boolean {
  if (condition === undefined || condition === 'daily') {
    return true;
  }

  if (condition === 'weekly') {
    return ctx.offset % 7 === 0;
  }

  if (condition === 'monthly') {
    return ctx.date.getDate() === 1;
  }

  if (condition === 'yearly') {
    return ctx.date.getDate() === 1 && ctx.date.getMonth() === 0;
  }

  if (typeof condition === 'object') {
    if ('interval' in condition && typeof condition.interval === 'number') {
      return condition.interval !== 0 && ctx.offset % condition.interval === 0;
    }
    if ('dayOfWeek' in condition && Array.isArray(condition.dayOfWeek)) {
      return condition.dayOfWeek.includes(ctx.date.getDay());
    }
  }

  if (typeof condition === 'function') {
    return condition(ctx);
  }

  return false;
}

/**
 * Resolves visual attributes for a tick by evaluating the rule array in order (first match wins).
 */
export function resolveTick(
  ctx: TickContext,
  rules: TickRule[],
  theme: ResolvedRulerTheme,
  defaultWidth: number = 3
): ResolvedTick {
  // Find the first matching rule, or fall back to the last rule in the list
  const matchedRule =
    rules.find((rule) => matchesCondition(rule.condition, ctx)) ??
    rules[rules.length - 1];

  const height = matchedRule?.height ?? 12;
  const width = matchedRule?.width ?? defaultWidth;
  const color = matchedRule?.color ?? theme.defaultTickColor;

  // Resolve label
  let labelText: string | undefined;
  let labelColor = theme.labelColor;
  let labelFontSize = 10;
  let labelFontWeight: ResolvedTick['labelFontWeight'] = 'normal';

  if (matchedRule?.label) {
    if (typeof matchedRule.label === 'object') {
      labelText = matchedRule.label.format
        ? matchedRule.label.format(ctx.date, ctx)
        : String(ctx.date.getDate());
      if (matchedRule.label.color) labelColor = matchedRule.label.color;
      if (matchedRule.label.fontSize) labelFontSize = matchedRule.label.fontSize;
      if (matchedRule.label.fontWeight) labelFontWeight = matchedRule.label.fontWeight;
    } else if (matchedRule.label === true) {
      labelText = String(ctx.date.getDate());
    }
  }

  // Resolve dot indicator
  let hasDot = false;
  let dotSize = 6;
  let dotColor = theme.accentColor;

  if (matchedRule?.dot !== undefined) {
    if (typeof matchedRule.dot === 'object') {
      hasDot = true;
      if (matchedRule.dot.size) dotSize = matchedRule.dot.size;
      if (matchedRule.dot.color) dotColor = matchedRule.dot.color;
    } else if (matchedRule.dot === true) {
      hasDot = true;
    }
  } else if (ctx.isToday) {
    // Default: show today dot if rule didn't explicitly disable it
    hasDot = true;
  }

  return {
    offset: ctx.offset,
    date: ctx.date,
    dateStr: formatDateString(ctx.date),
    height,
    width,
    color,
    labelText,
    labelColor,
    labelFontSize,
    labelFontWeight,
    hasDot,
    dotSize,
    dotColor,
    customRender: matchedRule?.render,
    isToday: ctx.isToday,
    isSelected: ctx.isSelected,
    isInRange: ctx.isInRange ?? false,
  };
}
