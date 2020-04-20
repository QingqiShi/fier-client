import React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react';
import createMockRaf, { MockRaf } from '@react-spring/mock-raf';
import { FrameLoop, Globals } from '@react-spring/web';
import { DragUtil, mockAuthUser, mockFirestore, render } from 'testUtils';
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
  const { getByLabelText, getByText } = render(
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
  fireEvent.mouseDown(getByText('28'));
  fireEvent.mouseMove(getByText('28'));
  fireEvent.mouseUp(getByText('28'));
  fireEvent.touchStart(getByText('28'));
  fireEvent.touchMove(getByText('28'));
  fireEvent.touchEnd(getByText('28'));
  fireEvent.click(getByText('28'));
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
    {
      userAndSettings: true,
    }
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
