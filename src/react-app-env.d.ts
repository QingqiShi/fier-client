/// <reference types="react-scripts" />

type Parameters<T> = T extends (...args: infer T) => any ? T : never;

declare module 'raf-stub' {
  const createStub: () => {
    add: (cb: FrameRequestCallback) => number;
    flush: () => void;
  };
  export default createStub;
}
