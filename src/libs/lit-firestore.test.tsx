import React from 'react';
import { act, fireEvent } from '@testing-library/react';
import { render } from 'testUtils';
import { firestore as mockFirestore } from 'firebase/app';
import { createStore } from './lit-firestore';

beforeEach(jest.clearAllMocks);

test('works like normal react-lit-store without path', () => {
  // Returns Provider and useStore
  const store = createStore(
    { counter: 0 },
    { increment: state => ({ counter: state.counter + 1 }) },
    () => ''
  );
  expect(store).toHaveProperty('Provider');
  expect(store).toHaveProperty('useStore');

  // Prepare component
  const processState = jest.fn();
  const Component = () => {
    const [state, actions] = store.useStore();
    processState(state);
    return <button onClick={actions.increment}>{state.counter}</button>;
  };
  const { container, getByRole } = render(<Component />, [store]);

  // Get state
  expect(processState).toHaveBeenCalledWith({ counter: 0 });

  // Renders component
  expect(container).toContainHTML('<button>0</button>');

  // Updates state when action called
  fireEvent.click(getByRole('button'));
  expect(processState).toHaveBeenCalledWith({ counter: 1 });
});

test('aquire doc using path and subscribe to change', () => {
  const store = createStore(
    { counter: 0 },
    { increment: state => ({ counter: state.counter + 1 }) },
    () => '/fake/path'
  );

  // Prepare component
  const Component = () => {
    const [state, actions] = store.useStore();
    return <button onClick={actions.increment}>{state.counter}</button>;
  };
  render(<Component />, [store]);

  // Aquire doc and subscribe to snapshot changes
  expect(mockFirestore().doc).toHaveBeenCalledWith('/fake/path');
  expect(mockFirestore().doc('').onSnapshot).toHaveBeenCalledWith(
    expect.any(Function)
  );
});

test('update state on firestore change', () => {
  const store = createStore(
    { counter: 0 },
    { increment: state => ({ counter: state.counter + 1 }) },
    () => '/fake/path'
  );

  // Prepare component
  const Component = () => {
    const [state, actions] = store.useStore();
    return <button onClick={actions.increment}>{state.counter}</button>;
  };
  const { getByRole } = render(<Component />, [store]);

  // Update snapshot through handler
  const setSnapshot = (mockFirestore().doc('').onSnapshot as jest.Mock).mock
    .calls[0][0];
  act(() => setSnapshot({ data: () => ({ counter: 5 }), exists: true }));

  expect(getByRole('button')).toHaveTextContent('5');
});

test('set firestore when actions called', () => {
  const store = createStore(
    { counter: 0 },
    { increment: state => ({ counter: state.counter + 1 }) },
    () => '/fake/path'
  );

  // Prepare component
  const Component = () => {
    const [state, actions] = store.useStore();
    return <button onClick={actions.increment}>{state.counter}</button>;
  };
  const { getByRole } = render(<Component />, [store]);
  act(() =>
    (mockFirestore().doc('').onSnapshot as jest.Mock).mock.calls[0][0]({
      data: () => ({ counter: 5 }),
      exists: true
    })
  );

  // Fire action to update counter
  fireEvent.click(getByRole('button'));

  expect(getByRole('button')).toHaveTextContent('6');
});

test('set firestore for non-existing state', () => {
  const store = createStore(
    { counter: 0 },
    { increment: state => ({ counter: state.counter + 1 }) },
    () => '/fake/path'
  );

  // Prepare component
  const Component = () => {
    const [state, actions] = store.useStore();
    return <button onClick={actions.increment}>{state.counter}</button>;
  };
  const { getByRole } = render(<Component />, [store]);
  const doc = mockFirestore().doc('');
  act(() =>
    (doc.onSnapshot as jest.Mock).mock.calls[0][0]({
      data: () => null,
      exists: false
    })
  );

  expect(getByRole('button')).toHaveTextContent('0');
  expect(doc.set).toHaveBeenCalledWith({ counter: 0 });
});

test('create missing states', () => {
  const store = createStore(
    { counter: 0, message: 'hi', total: 0 },
    { increment: state => ({ counter: state.counter + 1 }) },
    () => '/fake/path'
  );

  // Prepare component
  const Component = () => {
    const [state, actions] = store.useStore();
    return <button onClick={actions.increment}>{state.counter}</button>;
  };
  render(<Component />, [store]);
  const doc = mockFirestore().doc('');
  act(() =>
    (doc.onSnapshot as jest.Mock).mock.calls[0][0]({
      data: () => ({ counter: 0 }),
      exists: true
    })
  );

  expect(doc.set).toHaveBeenCalledTimes(1);
  expect(doc.set).toHaveBeenCalledWith(
    { message: 'hi', total: 0 },
    { merge: true }
  );
});
