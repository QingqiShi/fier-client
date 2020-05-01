import React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react';
import createMockRaf, { MockRaf } from '@react-spring/mock-raf';
import { FrameLoop, Globals } from '@react-spring/web';
import {
  DragUtil,
  getFirestore,
  mockAuthUser,
  mockFirestore,
  render,
} from 'testUtils';
import CreateTransaction from './CreateTransaction';

let mockRaf: MockRaf;
beforeEach(() => {
  mockRaf = createMockRaf();
  Globals.assign({
    now: mockRaf.now,
    requestAnimationFrame: mockRaf.raf,
    cancelAnimationFrame: mockRaf.cancel,
    frameLoop: new FrameLoop(),
  });
});

test('render form', () => {
  const { getByLabelText, getByText, getAllByText } = render(
    <CreateTransaction onClose={() => {}} />,
    { userAndSettings: true }
  );

  const userId = 'testid';
  act(() => void mockAuthUser({ uid: userId }));
  act(() =>
    mockFirestore(`users/${userId}/settings/app`, {
      locale: 'en',
      accounts: [
        { id: 1, name: 'Test Account' },
        { id: 2, name: 'Another Account' },
      ],
      categories: [{ id: 1, emoji: '💰' }],
    })
  );

  expect(getByLabelText(/Amount/)).toBeInTheDocument();
  expect(getByLabelText(/Account/)).toBeInTheDocument();
  expect(getByLabelText(/Date/)).toBeInTheDocument();
  expect(getByLabelText('Notes')).toBeInTheDocument();

  // Amount
  fireEvent.change(getByLabelText(/Amount/), { target: { value: '12.5' } });

  // Account
  fireEvent.mouseDown(getByLabelText('Account'));
  fireEvent.click(getByText('Another Account'));

  // Category
  fireEvent.click(getByText('💰'));

  // Date
  fireEvent.click(getByLabelText(/Date/));

  // Test date prevents event propagation
  const pickerText = getAllByText('28')[0];
  fireEvent.mouseDown(pickerText);
  fireEvent.mouseMove(pickerText);
  fireEvent.mouseUp(pickerText);
  fireEvent.touchStart(pickerText);
  fireEvent.touchMove(pickerText);
  fireEvent.touchEnd(pickerText);
  fireEvent.click(pickerText);
  fireEvent.click(getByText('OK'));

  // Notes
  fireEvent.change(getByLabelText('Notes'), {
    target: { value: 'Some notes' },
  });
});

test('show error for invalid amount', () => {
  const { getByLabelText, getByText } = render(
    <CreateTransaction onClose={() => {}} />
  );

  expect(getByText('You must enter an amount')).toBeInTheDocument();

  fireEvent.change(getByLabelText(/Amount/), { target: { value: 'invalid' } });
  expect(getByText("This doesn't look like a number")).toBeInTheDocument();
});

test('add manage category modal', async () => {
  const { getByTestId, getByText, queryByText } = render(
    <CreateTransaction onClose={() => {}} />,
    { userAndSettings: true }
  );

  const userId = 'testid';
  act(() => void mockAuthUser({ uid: userId }));
  act(() =>
    mockFirestore(`users/${userId}/settings/app`, {
      locale: 'en',
      categories: [{ id: 1, emoji: '💰' }],
    })
  );

  const drag = new DragUtil(() => getByText('Categories'), mockRaf);

  // Open
  fireEvent.click(getByTestId('add-create-category'));
  drag.wait();
  expect(getByText('Categories')).toBeInTheDocument();

  // Click 'Done' to close
  fireEvent.click(getByText('Done'));
  drag.wait();
  await waitFor(() =>
    expect(queryByText('Categories')).not.toBeInTheDocument()
  );

  // Open again
  fireEvent.click(getByTestId('add-create-category'));
  drag.wait();

  // Drag to close
  await drag.dragStart().later(50);
  drag.dragDown(50).dragEnd().wait();
  await waitFor(() =>
    expect(queryByText('Categories')).not.toBeInTheDocument()
  );
});

test('show add account button when user has no accounts', async () => {
  const { getByLabelText, getByText, queryByText, getByTestId } = render(
    <CreateTransaction onClose={() => {}} />,
    {
      userAndSettings: true,
    }
  );

  const userId = 'testid';
  act(() => void mockAuthUser({ uid: userId }));
  act(() =>
    mockFirestore(`users/${userId}/settings/app`, {
      locale: 'en',
      accounts: [],
    })
  );

  // Open accounts dropdown
  fireEvent.mouseDown(getByLabelText('Account'));

  const drag = new DragUtil(() => getByText(/Account type/), mockRaf);

  // Open
  fireEvent.click(getByText('Add Account'));
  drag.wait();
  expect(getByText(/Account type/)).toBeInTheDocument();

  // Fill form and close
  fireEvent.change(getByLabelText(/Name/), { target: { value: 'Test' } });
  fireEvent.click(getByTestId('add-account-btn'));
  drag.wait();
  await waitFor(() =>
    expect(queryByText(/Account type/)).not.toBeInTheDocument()
  );

  // Open again
  fireEvent.click(getByText('Add Account'));
  drag.wait();

  // Drag to close
  await drag.dragStart().later(50);
  drag.dragDown(50).dragEnd().wait();
  await waitFor(() =>
    expect(queryByText(/Account type/)).not.toBeInTheDocument()
  );
});

test('submits form and store data to db', async () => {
  const handleClose = jest.fn();
  const { getByLabelText, getByTestId } = render(
    <CreateTransaction onClose={handleClose} />,
    {
      userAndSettings: true,
    }
  );

  const userId = 'testid';
  act(() => void mockAuthUser({ uid: userId }));
  act(() =>
    mockFirestore(`users/${userId}/settings/app`, {
      locale: 'en',
      accounts: [{ id: 1 }],
      categories: [{ id: 1, name: 'Test', emoji: 'T', type: 'expenses' }],
    })
  );

  // Fill in amount and submit!
  fireEvent.change(getByLabelText(/Amount/), { target: { value: '12.5' } });
  fireEvent.click(getByTestId('add-transaction-btn'));

  await waitFor(() => {
    expect(handleClose).toHaveBeenCalled();
    expect(getFirestore(`users/${userId}/accounts/1`)).toEqual({
      balance: -12.5,
    });
    expect(getFirestore(`users/${userId}/transactions/1`)).toEqual({
      fromAccountId: 1,
      toAccountId: null,
      categoryId: 1,
      notes: '',
      value: -12.5,
      dateTime: expect.any(Number),
    });
  });

  // Update amount
  fireEvent.change(getByLabelText(/Amount/), { target: { value: '-10.00' } });
  fireEvent.click(getByTestId('add-transaction-btn'));

  await waitFor(() => {
    expect(getFirestore(`users/${userId}/accounts/1`)).toEqual({
      balance: -2.5,
    });
    expect(getFirestore(`users/${userId}/transactions/2`)).toEqual({
      fromAccountId: 1,
      toAccountId: null,
      categoryId: 1,
      notes: '',
      value: 10,
      dateTime: expect.any(Number),
    });
  });
});
