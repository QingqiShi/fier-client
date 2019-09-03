import { useState } from 'react';

function useFormInput(
  initialValue = ''
): [string, React.FormEventHandler, (val: string) => void] {
  const [value, setValue] = useState(initialValue);

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    setValue((e.target as HTMLInputElement).value);
  }

  return [value, handleChange, setValue];
}

export default useFormInput;
