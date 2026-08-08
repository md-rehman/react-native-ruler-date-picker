import * as RNWeb from 'react-native-web';

export * from 'react-native-web';

export const findNodeHandle = (component) => {
  if (!component) return null;
  if (typeof HTMLElement !== 'undefined' && component instanceof HTMLElement) {
    return component;
  }
  if (component._touchableNode) return component._touchableNode;
  if (component._node) return component._node;
  if (typeof component.getAnimatableRef === 'function') {
    const animatable = component.getAnimatableRef();
    if (animatable) return findNodeHandle(animatable);
  }
  if (component._component) {
    return findNodeHandle(component._component);
  }
  try {
    if (typeof RNWeb.findNodeHandle === 'function') {
      const node = RNWeb.findNodeHandle(component);
      if (node) return node;
    }
  } catch {
    // Fallback for web gesture handlers
  }
  return component;
};

export const DrawerLayoutAndroid = RNWeb.View || (() => null);
export const TurboModuleRegistry = {
  get: () => null,
  getEnforcing: () => ({}),
};

const mockGestureModule = {
  Direction: { RIGHT: 1, LEFT: 2, UP: 4, DOWN: 8 },
  State: { UNDETERMINED: 0, FAILED: 1, BEGAN: 2, CANCELLED: 3, ACTIVE: 4, END: 5 },
  createGestureHandler: () => {},
  attachGestureHandler: () => {},
  updateGestureHandler: () => {},
  dropGestureHandler: () => {},
  install: () => {},
  flushOperations: () => {},
};

export const RNGestureHandlerModule = {
  ...mockGestureModule,
  default: mockGestureModule,
};

export const NativeModules = {
  ...(RNWeb.NativeModules || {}),
  RNGestureHandlerModule,
};

export const EventEmitter = class {
  addListener() { return { remove() {} }; }
  removeAllListeners() {}
  emit() {}
};
export const NativeModule = class {};
export const SharedObject = class {};

const defaultExport = {
  ...RNWeb,
  findNodeHandle,
  NativeModules,
};

export default defaultExport;
