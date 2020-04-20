import React from 'react';
import { act, fireEvent } from '@testing-library/react';
import createMockRaf, { MockRaf } from '@react-spring/mock-raf';
import { FrameLoop, Globals } from '@react-spring/web';
import { mockAuthUser, mockFirestore, render } from 'testUtils';
import ManageCategories from './ManageCategories';

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

test('render title and add buttons', () => {
  const { getByText, getAllByText } = render(
    <ManageCategories onClose={() => {}} />,
    {
      userAndSettings: true,
    }
  );
  act(() => void mockAuthUser());
  expect(getByText('Categories')).toBeInTheDocument();
  expect(getAllByText('Add')).toHaveLength(2);
});

test('show done button when categories exist', () => {
  const handleClose = jest.fn();
  const { getByText } = render(<ManageCategories onClose={handleClose} />, {
    userAndSettings: true,
  });
  act(() => void mockAuthUser({ uid: 'testid' }));

  expect(getByText('Done').closest('button')).toBeDisabled();

  act(() =>
    mockFirestore('users/testid/settings/app', {
      locale: 'en',
      categories: [
        { id: 1, emoji: 'A', name: 'Test', type: 'expenses' },
        { id: 2, emoji: 'B', name: 'Test', type: 'income' },
      ],
    })
  );

  expect(getByText('Done').closest('button')).not.toBeDisabled();

  fireEvent.click(getByText('Done'));
  expect(handleClose).toHaveBeenCalled();
});

test('click add to show new form', () => {
  const { getByText, getAllByText } = render(
    <ManageCategories onClose={() => {}} />,
    {
      userAndSettings: true,
    }
  );
  act(() => void mockAuthUser());

  fireEvent.click(getAllByText('Add')[0]);
  act(() => mockRaf.flush());

  expect(getByText('Add Expenses Category')).toBeInTheDocument();
});

test('add categories and save then delete', () => {
  const handleClose = jest.fn();
  const { getByLabelText, getAllByText, getByText, queryByText } = render(
    <ManageCategories onClose={handleClose} />,
    {
      userAndSettings: true,
    }
  );
  act(() => void mockAuthUser());

  // Add a category with emoji
  fireEvent.click(getAllByText('Add')[0]);
  act(() => mockRaf.flush());
  fireEvent.change(getByLabelText('Emoji'), { target: { value: '😃' } });
  fireEvent.change(getByLabelText(/Name/), { target: { value: 'Test' } });
  fireEvent.click(getAllByText('Add')[2]);
  act(() => mockRaf.flush());

  expect(queryByText('Add Expenses Category')).toBeNull();
  expect(getByText('😃')).toBeInTheDocument();
  expect(getByText('Test')).toBeInTheDocument();

  // Add a category without emoji
  fireEvent.click(getAllByText('Add')[1]);
  act(() => mockRaf.flush());
  fireEvent.change(getByLabelText(/Name/), { target: { value: 'Blah' } });
  fireEvent.click(getAllByText('Add')[2]);
  act(() => mockRaf.flush());

  expect(getByText('B')).toBeInTheDocument();
  expect(getByText('Blah')).toBeInTheDocument();

  // Delete expenses category
  fireEvent.click(getByText('Test'));
  act(() => mockRaf.flush());
  fireEvent.click(getByText('Remove'));
  act(() => mockRaf.flush());

  expect(queryByText('😃')).toBeNull();
  expect(queryByText('Test')).toBeNull();

  // Delete income category
  fireEvent.click(getByText('Blah'));
  act(() => mockRaf.flush());
  fireEvent.click(getByText('Remove'));
  act(() => mockRaf.flush());

  expect(queryByText('B')).toBeNull();
  expect(queryByText('Blah')).toBeNull();
});

test('add category form can be closed', () => {
  const { queryByText, getAllByText } = render(
    <ManageCategories onClose={() => {}} />,
    {
      userAndSettings: true,
    }
  );
  act(() => void mockAuthUser());

  fireEvent.click(getAllByText('Add')[0]);
  act(() => mockRaf.flush());

  fireEvent.click(document.querySelector('.MuiBackdrop-root') as any);
  act(() => mockRaf.flush());

  expect(queryByText('Add Expenses Category')).toBeNull();
});
