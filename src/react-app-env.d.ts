/// <reference types="react-scripts" />

type Parameters<T> = T extends (...args: infer T) => any ? T : never;

type RafStub = {
  add: (cb: FrameRequestCallback) => number;
  remove: (id: number) => number;
  flush: () => void;
  step: (steps?: number, duration?: number) => void;
  reset: () => void;
};

declare module 'raf-stub' {
  const createStub: () => RafStub;
  export default createStub;
}
