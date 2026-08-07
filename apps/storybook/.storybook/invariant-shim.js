import invariantCJS from 'invariant';

export default function invariant(condition, format, ...args) {
  const fn = typeof invariantCJS === 'function' ? invariantCJS : invariantCJS?.default;
  if (typeof fn === 'function') {
    return fn(condition, format, ...args);
  }
  if (!condition) {
    let argIndex = 0;
    const message = format ? format.replace(/%s/g, () => args[argIndex++]) : 'Invariant Violation';
    const error = new Error(message);
    error.name = 'Invariant Violation';
    throw error;
  }
}
