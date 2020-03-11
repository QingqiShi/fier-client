import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import CategoriesList from './CategoriesList';

test('renders categories list', () => {
  const handleAdd = jest.fn();
  const handleClick = jest.fn();
  const mockCategories = [
    { id: 1, emoji: 'A', name: 'Test 1', type: 'expenses' as const },
    { id: 2, emoji: '😃', name: 'Test 2', type: 'expenses' as const }
  ];
  const { getByText } = render(
    <CategoriesList
      addLabel="Add Test Label"
      categories={mockCategories}
      header="Test Header"
      onAdd={handleAdd}
      onClick={handleClick}
    />
  );

  // Render
  expect(getByText('Test Header')).toBeInTheDocument();
  expect(getByText('A')).toBeInTheDocument();
  expect(getByText('Test 1')).toBeInTheDocument();
  expect(getByText('😃')).toBeInTheDocument();
  expect(getByText('Test 2')).toBeInTheDocument();
  expect(getByText('Add Test Label')).toBeInTheDocument();

  // Fire click events
  fireEvent.click(getByText('Test 1'));
  expect(handleClick).toHaveBeenCalledWith(mockCategories[0]);
  fireEvent.click(getByText('Test 2'));
  expect(handleClick).toHaveBeenCalledWith(mockCategories[1]);

  // Fire add events
  fireEvent.click(getByText('Add Test Label'));
  expect(handleAdd).toHaveBeenCalled();
});

test('hide add button if handler not provided', () => {
  const { queryByText } = render(
    <CategoriesList categories={[]} header="Test Header" />
  );
  expect(queryByText('Add Test Label')).toBeNull();
});

test('render list items without click handler', () => {
  const mockCategories = [
    { id: 1, emoji: 'A', name: 'Test 1', type: 'expenses' as const }
  ];
  const { queryByRole, getByText } = render(
    <CategoriesList categories={mockCategories} header="Test Header" />
  );

  // click should do nothing
  expect(queryByRole('button')).toBeNull();
  fireEvent.click(getByText('Test 1'));
});
