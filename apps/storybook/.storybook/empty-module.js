const mockModule = {
  Direction: { RIGHT: 1, LEFT: 2, UP: 4, DOWN: 8 },
  State: { UNDETERMINED: 0, FAILED: 1, BEGAN: 2, CANCELLED: 3, ACTIVE: 4, END: 5 },
  createGestureHandler: () => {},
  attachGestureHandler: () => {},
  updateGestureHandler: () => {},
  dropGestureHandler: () => {},
  install: () => {},
  flushOperations: () => {},
  ok: true,
};

export default function emptyFunction() {
  return { ok: true };
}
Object.assign(emptyFunction, mockModule);

export const customDirectEventTypes = {};
export const PressabilityDebugView = () => null;
export const validateWorkletsVersion = () => ({ ok: true });
export const createGestureHandler = () => {};
export const attachGestureHandler = () => {};
export const updateGestureHandler = () => {};
export const dropGestureHandler = () => {};
export const controlEdgeToEdgeValues = () => {};
export const isEdgeToEdge = () => false;

export const Direction = mockModule.Direction;
export const State = mockModule.State;
export const install = mockModule.install;
export const flushOperations = mockModule.flushOperations;

export const ImpactFeedbackStyle = {
  Light: 'light',
  Medium: 'medium',
  Heavy: 'heavy',
  Soft: 'soft',
  Rigid: 'rigid',
};
export const NotificationFeedbackType = {
  Success: 'success',
  Warning: 'warning',
  Error: 'error',
};

export const impactAsync = async () => {};
export const selectionAsync = async () => {};
export const notificationAsync = async () => {};
