import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from 'testUtils';
import CategoryAddForm from './CategoryAddForm';

test('Renders expenses title', () => {
  const { getByText } = render(
    <CategoryAddForm
      value={{ id: 0, emoji: '', name: '', type: 'expenses' }}
      onChange={() => {}}
      onDelete={() => {}}
      onSave={() => {}}
    />
  );
  expect(getByText('Add Expenses Category'));
});

test('Renders income title', () => {
  const { getByText } = render(
    <CategoryAddForm
      value={{ id: 0, emoji: '', name: '', type: 'income' }}
      onChange={() => {}}
      onDelete={() => {}}
      onSave={() => {}}
    />
  );
  expect(getByText('Add Income Category'));
});

test('Renders form values', () => {
  const { getByLabelText } = render(
    <CategoryAddForm
      value={{ id: 0, emoji: 'A', name: 'Test', type: 'expenses' }}
      onChange={() => {}}
      onDelete={() => {}}
      onSave={() => {}}
    />
  );
  expect(getByLabelText('Emoji')).toHaveValue('A');
  expect(getByLabelText(/Name/)).toHaveValue('Test');
});

test('change handler', () => {
  const handleChange = jest.fn();
  const { getByLabelText } = render(
    <CategoryAddForm
      value={{ id: 0, emoji: '', name: '', type: 'expenses' }}
      onChange={handleChange}
      onDelete={() => {}}
      onSave={() => {}}
    />
  );

  fireEvent.change(getByLabelText('Emoji'), { target: { value: 'A' } });
  expect(handleChange).toHaveBeenCalledWith({
    id: 0,
    emoji: 'A',
    name: '',
    type: 'expenses'
  });

  fireEvent.change(getByLabelText(/Name/), { target: { value: 'Test' } });
  expect(handleChange).toHaveBeenCalledWith({
    id: 0,
    emoji: '',
    name: 'Test',
    type: 'expenses'
  });
});

test('fires save handler', () => {
  const handleSave = jest.fn();
  const { getByText } = render(
    <CategoryAddForm
      value={{ id: 0, emoji: '', name: '', type: 'expenses' }}
      onChange={() => {}}
      onDelete={() => {}}
      onSave={handleSave}
    />
  );

  fireEvent.click(getByText('Add'));
  expect(handleSave).toHaveBeenCalled();
});

test('show edit button', () => {
  const handleSave = jest.fn();
  const { getByText } = render(
    <CategoryAddForm
      value={{ id: 1, emoji: '', name: '', type: 'expenses' }}
      onChange={() => {}}
      onDelete={() => {}}
      onSave={handleSave}
    />
  );

  fireEvent.click(getByText('Edit'));
  expect(handleSave).toHaveBeenCalled();
});

test('fires delete handler', () => {
  const handleDelete = jest.fn();
  const { getByText } = render(
    <CategoryAddForm
      value={{ id: 1, emoji: '', name: '', type: 'expenses' }}
      onChange={() => {}}
      onDelete={handleDelete}
      onSave={() => {}}
    />
  );

  fireEvent.click(getByText('Remove'));
  expect(handleDelete).toHaveBeenCalled();
});

test('hide delete button when no id is provided', () => {
  const handleDelete = jest.fn();
  const { queryByText } = render(
    <CategoryAddForm
      value={{ id: 0, emoji: '', name: '', type: 'expenses' }}
      onChange={() => {}}
      onDelete={handleDelete}
      onSave={() => {}}
    />
  );

  expect(queryByText('Remove')).toBeNull();
});
