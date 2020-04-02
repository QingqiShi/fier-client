import { act } from '@testing-library/react-hooks';
import { renderHook } from 'testUtils';
import user from './user';

describe('user', () => {
  describe('state', () => {
    it.each`
      property
      ${'isLoggedIn'}
      ${'uid'}
      ${'name'}
      ${'email'}
      ${'emailVerified'}
    `('has property $property', ({ property }) => {
      const { result } = renderHook(() => user.useStore(), { stores: [user] });
      expect(result.current[0]).toHaveProperty(property);
    });
  });

  describe('actions', () => {
    it('setUser', () => {
      const { result } = renderHook(() => user.useStore(), { stores: [user] });
      act(() => {
        result.current[1].setUser({
          uid: 'testUserId',
          email: 'testEmail',
          name: 'testName',
          emailVerified: true,
        });
      });
      expect(result.current[0].isLoggedIn).toBe(true);
      expect(result.current[0].uid).toEqual('testUserId');
      expect(result.current[0].email).toEqual('testEmail');
      expect(result.current[0].name).toEqual('testName');
      expect(result.current[0].emailVerified).toBe(true);
    });

    it('signOut', () => {
      const { result } = renderHook(() => user.useStore(), { stores: [user] });
      act(() => {
        result.current[1].setUser({
          uid: '',
          email: '',
          name: '',
          emailVerified: true,
        });
      });
      act(() => {
        result.current[1].signOut();
      });
      expect(result.current[0].isLoggedIn).toBe(false);
    });

    it('updateUser', () => {
      const { result } = renderHook(() => user.useStore(), { stores: [user] });
      act(() => {
        result.current[1].updateUser('testName');
      });
      expect(result.current[0].name).toEqual('testName');
    });
  });
});
