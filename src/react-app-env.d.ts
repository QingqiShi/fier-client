/// <reference types="react-scripts" />

type Parameters<T> = T extends (...args: infer T) => any ? T : never;

interface Category {
  id: number;
  name: string;
  emoji: string;
  type: 'income' | 'expenses';
}

declare module 'raf-stub' {
  const createStub: () => RafStub;
  export default createStub;
}
