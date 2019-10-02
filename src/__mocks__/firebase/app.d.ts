import 'firebase/app';

declare module 'firebase/app' {
  export const mockAuthState = (user: any) => {};
  export const mockError = (e: any) => {};
  export const mockDocSnapshot = (snap: any) => {};
}
