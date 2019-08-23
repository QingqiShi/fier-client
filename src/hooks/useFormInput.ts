import { useState } from 'react';

function useFormInput(initialValue = ''): [string, React.FormEventHandler] {
  const [value, setValue] = useState(initialValue);

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    setValue((e.target as HTMLInputElement).value);
  }

  return [value, handleChange];
}

export default useFormInput;
