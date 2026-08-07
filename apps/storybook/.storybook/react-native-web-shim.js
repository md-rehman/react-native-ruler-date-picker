import * as RNWeb from 'react-native-web';

export * from 'react-native-web';

export const findNodeHandle = (component) => {
  if (!component) return null;
  try {
    if (typeof RNWeb.findNodeHandle === 'function') {
      return RNWeb.findNodeHandle(component);
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
