/// <reference types="react-scripts" />
import 'firebase/app';

declare module 'firebase/app' {
  export const mockAuthState = (user: any) => {};
  export const mockError = (e: any) => {};
}
