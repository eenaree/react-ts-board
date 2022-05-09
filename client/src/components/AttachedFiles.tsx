import * as React from 'react';
import { useReducer } from 'react';
import { css } from '@emotion/react';
import postAPI from '@api/post';
import axios from 'axios';
import fileReducer from '@reducers/file';
import {
  REMOVE_FILE,
  REMOVE_FILE_FAILURE,
  REMOVE_FILE_SUCCESS,
} from '@reducers/actions';
import { FailureResponse, FileInfo } from '@typings/db';

const AttachedFiles = ({
  files,
}: {
  files: FileInfo[];
}): React.ReactElement => {
  const [state, dispatch] = useReducer(fileReducer, {
    isLoading: false,
    isError: null,
    files,
  });

  const onClickDelete = (id: number) => {
    if (window.confirm('첨부된 파일을 삭제하시겠습니까?')) {
      removeFile(id);
    }
  };

  const removeFile = (id: number) => {
    dispatch({ type: REMOVE_FILE });
    postAPI
      .removeFile(id)
      .then(({ data }) => {
        if (data.success) {
          dispatch({ type: REMOVE_FILE_SUCCESS, id });
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response) {
          console.error(error);
          dispatch({
            type: REMOVE_FILE_FAILURE,
            error: error.response.data as FailureResponse,
          });
        } else {
          console.error('unexpected error: ', error);
        }
      });
  };

  return (
    <div>
      <p>
        <strong>첨부된 파일 {state.files.length}</strong>
      </p>
      {state.files.map(file => (
        <div
          key={file.id}
          css={css`
            display: flex;
            justify-content: space-between;
            border-top: 1px solid #eee;
            height: 50px;
            &:hover {
              background-color: #eee;
            }
          `}
        >
          <div>
            <img
              src={`http://localhost:8080/${file.fileUrl}`}
              alt="attached file preivew"
              css={css`
                margin-right: 10px;
                width: 100px;
                height: 100%;
              `}
            />
            <span>{file.fileUrl.slice(8)}</span>
          </div>
          <button
            onClick={() => onClickDelete(file.id)}
            css={css`
              cursor: pointer;
              border: none;
            `}
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
};

export default AttachedFiles;
