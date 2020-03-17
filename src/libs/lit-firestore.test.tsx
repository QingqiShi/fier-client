import React from 'react';
import { act, fireEvent } from '@testing-library/react';
import { render } from 'testUtils';
import { mockDocSnapshot, firestore as mockFirestore } from 'firebase/app';
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
  const { container, getByRole } = render(<Component />, { stores: [store] });

  // Get state
  expect(processState).toHaveBeenCalledWith({ counter: 0 });

  // Renders component
  expect(container).toContainHTML('<button>0</button>');

  // Updates state when action called
  fireEvent.click(getByRole('button'));
  expect(processState).toHaveBeenCalledWith({ counter: 1 });
});

test('aquire doc using path', () => {
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
  render(<Component />, { stores: [store] });

  // Aquire doc and subscribe to snapshot changes
  expect(mockFirestore().doc).toHaveBeenCalledWith('/fake/path');
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
  const { getByRole } = render(<Component />, { stores: [store] });

  // Update snapshot through handler
  act(() => mockDocSnapshot('/fake/path', { counter: 5 }));

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
  const { getByRole } = render(<Component />, { stores: [store] });
  act(() => mockDocSnapshot('/fake/path', { counter: 5 }));

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
  const { getByRole } = render(<Component />, { stores: [store] });
  act(() => mockDocSnapshot('/fake/path', null));

  expect(getByRole('button')).toHaveTextContent('0');
});

test('create missing states', () => {
  const store = createStore(
    { counter: 0, message: 'hi', total: 0 },
    { increment: state => ({ counter: state.counter + 1 }) },
    () => '/fake/path'
  );

  // Prepare component
  const Component = () => {
    const [state] = store.useStore();
    return (
      <div>
        <span>{state.message}</span>
        <span>{state.total}</span>
      </div>
    );
  };
  const { getByText } = render(<Component />, { stores: [store] });
  act(() => mockDocSnapshot('/fake/path', { counter: 0 }));

  expect(getByText('0')).toBeInTheDocument();
  expect(getByText('hi')).toBeInTheDocument();
});
