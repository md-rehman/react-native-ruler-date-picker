import * as RNWeb from 'react-native-web';

export * from 'react-native-web';

export const DrawerLayoutAndroid = RNWeb.View || (() => null);
export const TurboModuleRegistry = {
  get: () => null,
  getEnforcing: () => ({}),
};
export const NativeModules = RNWeb.NativeModules || {};

export const EventEmitter = class {
  addListener() { return { remove() {} }; }
  removeAllListeners() {}
  emit() {}
};
export const NativeModule = class {};
export const SharedObject = class {};

export default RNWeb.default || RNWeb;
