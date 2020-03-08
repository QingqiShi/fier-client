import { useState } from 'react';

function useFormInput<T>(
  initialValue = ''
): [string, React.ChangeEventHandler<T>, (val: string) => void] {
  const [value, setValue] = useState(initialValue);

  function handleChange(e: React.SyntheticEvent<T>) {
    setValue((e.target as any).value);
  }

  return [value, handleChange, setValue];
}

export default useFormInput;
