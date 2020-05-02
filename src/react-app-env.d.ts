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

declare namespace Data {
  interface Transaction {
    id: string;
    dateTime: import('dayjs').Dayjs;
    toAccountId: number | null;
    fromAccountId: number | null;
    categoryId: number;
    value: number;
    notes?: string;
  }
}

declare module 'raf-stub' {
  const createStub: () => RafStub;
  export default createStub;
}

declare module '@material-ui/pickers/adapter/dayjs.cjs' {
  export * from '@material-ui/pickers/adapter/dayjs';
  export { default } from '@material-ui/pickers/adapter/dayjs';
}
