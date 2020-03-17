import 'firebase/app';

declare module 'firebase/app' {
  export const mockAuthState: (user: any) => void;
  export const mockError: (e: any) => void;
  export const mockDocSnapshot: (path: string, data: any) => void;
  export const clearFirestoreStates: () => void;
}
