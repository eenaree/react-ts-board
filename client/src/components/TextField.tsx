import * as React from 'react';
import { css } from '@emotion/react';
import { useField } from 'formik';

interface Props {
  [index: string]: string;
  label: string;
  name: string;
}

const TextField = ({ label, ...props }: Props): React.ReactElement => {
  const [field, meta] = useField(props);
  return (
    <div
      css={css`
        margin: 10px 0;
      `}
    >
      <label
        htmlFor={props.name}
        css={css`
          font-weight: 700;
        `}
      >
        {label}
      </label>
      <input
        {...field}
        {...props}
        css={css`
          display: block;
          width: 100%;
          padding: 10px 0;
          margin: 10px 0 5px;
          border: 1px solid #ddd;
          border-radius: 10px;
          text-indent: 10px;
        `}
      />
      {meta.touched && meta.error && (
        <div
          css={css`
            color: #ff0000;
            font-size: 12px;
            margin-left: 10px;
          `}
        >
          {meta.error}
        </div>
      )}
    </div>
  );
};

export default TextField;
