import { useState } from 'react';

interface InputValues {
  [index: string]: string;
}

const useInput = (
  initialValue = {}
): [
  InputValues,
  React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
] => {
  const [value, setValue] = useState<InputValues>(initialValue);
  const onChangeValue = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  return [value, onChangeValue];
};

export default useInput;
