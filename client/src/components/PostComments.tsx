import * as React from 'react';
import { useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/react';
import axios from 'axios';
import CommentForm from '@components/CommentForm';
import CommentList from '@components/CommentList';
import commentReducer from '@reducers/comment';
import {
  ADD_COMMENT,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_SUCCESS,
  REMOVE_COMMENT,
  REMOVE_COMMENT_FAILURE,
  REMOVE_COMMENT_SUCCESS,
} from '@reducers/actions';
import postAPI from '@api/post';
import { CommentInfo, FailureResponse } from '@typings/db';

const PostComments = ({
  comments,
}: {
  comments: CommentInfo[];
}): React.ReactElement => {
  const params = useParams<'id'>();
  const [state, dispatch] = useReducer(commentReducer, {
    isLoading: false,
    isError: null,
    comments,
  });

  function addComment(comment: string) {
    if (!params.id) return;

    dispatch({ type: ADD_COMMENT });
    postAPI
      .addComment(params.id, comment)
      .then(({ data }) => {
        if (data.success) {
          dispatch({ type: ADD_COMMENT_SUCCESS, comment: data.comment });
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response) {
          console.error(error);
          dispatch({
            type: ADD_COMMENT_FAILURE,
            error: error.response.data as FailureResponse,
          });
        } else {
          console.error('unexpected error: ', error);
        }
      });
  }

  function removeComment(id: number) {
    dispatch({ type: REMOVE_COMMENT });
    postAPI
      .removeComment(id)
      .then(({ data }) => {
        if (data.success) {
          dispatch({
            type: REMOVE_COMMENT_SUCCESS,
            id,
            deletedAt: data.deletedAt,
          });
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response) {
          console.error(error);
          dispatch({
            type: REMOVE_COMMENT_FAILURE,
            error: error.response.data as FailureResponse,
          });
        } else {
          console.error('unexpected error: ', error);
        }
      });
  }

  return (
    <div>
      <p
        css={css`
          margin: 20px 0 10px;
        `}
      >
        댓글 <strong>{state.comments.length}</strong>
      </p>
      <CommentForm addComment={addComment} />
      {state.comments.length > 0 && (
        <CommentList comments={state.comments} removeComment={removeComment} />
      )}
    </div>
  );
};

export default PostComments;
