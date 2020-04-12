/// <reference types="react-scripts" />

type Parameters<T> = T extends (...args: infer T) => any ? T : never;

declare namespace Settings {
  interface Category {
    id: number;
    name: string;
    emoji: string;
    type: 'income' | 'expenses';
  }

  interface Account {
    id: number;
    name: string;
    type: 'normal' | 'debt';
    currency: 'gbp' | 'cny' | 'usd';
  }
}

declare module 'raf-stub' {
  const createStub: () => RafStub;
  export default createStub;
}
