import * as React from 'react';
import { useReducer } from 'react';
import { css } from '@emotion/react';
import axios from 'axios';
import CommentList from '@components/CommentList';
import CommentForm from '@components/CommentForm';
import replyReducer from '@reducers/reply';
import postAPI from '@api/post';
import {
  ADD_REPLY,
  ADD_REPLY_FAILURE,
  ADD_REPLY_SUCCESS,
  REMOVE_REPLY,
  REMOVE_REPLY_FAILURE,
  REMOVE_REPLY_SUCCESS,
} from '@reducers/actions';
import { CommentInfo, FailureResponse } from '@typings/db';

interface Props {
  deleted: boolean;
  commentId: number;
  replies: CommentInfo[];
  setReplyCount: React.Dispatch<React.SetStateAction<number>>;
}

const ReplyComments = ({
  deleted,
  commentId,
  replies,
  setReplyCount,
}: Props): React.ReactElement => {
  const [state, dispatch] = useReducer(replyReducer, {
    isLoading: false,
    isError: null,
    replies,
  });

  function addReplyComment(comment: string) {
    dispatch({ type: ADD_REPLY });
    postAPI
      .addReplyComment(commentId, comment)
      .then(({ data }) => {
        if (data.success) {
          dispatch({ type: ADD_REPLY_SUCCESS, reply: data.comment });
          setReplyCount(prevCount => prevCount + 1);
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response) {
          console.error(error);
          dispatch({
            type: ADD_REPLY_FAILURE,
            error: error.response.data as FailureResponse,
          });
        } else {
          console.error('unexpected error: ', error);
        }
      });
  }

  function removeReplyComment(id: number) {
    dispatch({ type: REMOVE_REPLY });
    postAPI
      .removeReplyComment(id)
      .then(({ data }) => {
        if (data.success) {
          dispatch({
            type: REMOVE_REPLY_SUCCESS,
            id,
            deletedAt: data.deletedAt,
          });
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response) {
          console.error(error);
          dispatch({
            type: REMOVE_REPLY_FAILURE,
            error: error.response.data as FailureResponse,
          });
        } else {
          console.error('unexpected error: ', error);
        }
      });
  }

  return (
    <div
      css={css`
        margin-left: 20px;
      `}
    >
      <CommentForm addComment={addReplyComment} deleted={deleted} />
      {state.replies.length > 0 && (
        <CommentList
          comments={state.replies}
          removeComment={removeReplyComment}
        />
      )}
    </div>
  );
};

export default ReplyComments;
