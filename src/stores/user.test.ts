import { act } from '@testing-library/react-hooks';
import { renderHook } from 'testUtils';
import user from './user';

describe('user', () => {
  describe('state', () => {
    it.each`
      property
      ${'receivedInitialState'}
      ${'isLoggedIn'}
      ${'name'}
      ${'email'}
      ${'emailVerified'}
    `('has property $property', ({ property }) => {
      const { result } = renderHook(() => user.useStore(), [user]);
      expect(result.current[0]).toHaveProperty(property);
    });
  });

  describe('actions', () => {
    it('setInitialState', () => {
      const { result } = renderHook(() => user.useStore(), [user]);
      act(() => {
        result.current[1].setInitialState();
      });
      expect(result.current[0].receivedInitialState).toBe(true);
    });

    it('setUser', () => {
      const { result } = renderHook(() => user.useStore(), [user]);
      act(() => {
        result.current[1].setUser({
          email: 'testEmail',
          name: 'testName',
          emailVerified: true
        });
      });
      expect(result.current[0].isLoggedIn).toBe(true);
      expect(result.current[0].email).toEqual('testEmail');
      expect(result.current[0].name).toEqual('testName');
      expect(result.current[0].emailVerified).toBe(true);
    });

    it('signOut', () => {
      const { result } = renderHook(() => user.useStore(), [user]);
      act(() => {
        result.current[1].setUser({
          email: '',
          name: '',
          emailVerified: true
        });
      });
      act(() => {
        result.current[1].signOut();
      });
      expect(result.current[0].isLoggedIn).toBe(false);
    });

    it('updateUser', () => {
      const { result } = renderHook(() => user.useStore(), [user]);
      act(() => {
        result.current[1].updateUser('testName');
      });
      expect(result.current[0].name).toEqual('testName');
    });
  });
});
