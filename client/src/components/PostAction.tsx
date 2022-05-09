import * as React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'antd';
import { css } from '@emotion/react';
import axios from 'axios';
import { useUserState } from '@context/UserContext';
import { usePostState, usePostDispatch } from '@context/PostContext';
import postAPI from '@api/post';
import {
  REMOVE_POST,
  REMOVE_POST_FAILURE,
  REMOVE_POST_SUCCESS,
} from '@reducers/actions';
import { FailureResponse } from '@typings/db';

interface CustomLocationState {
  from: string;
}

const PostAction = (): React.ReactElement => {
  const { user } = useUserState();
  const {
    state: { post },
  } = usePostState();
  const { dispatch } = usePostDispatch();
  const navigate = useNavigate();
  const params = useParams<'id'>();
  const location = useLocation();

  function onClickList() {
    const state = location.state as CustomLocationState;
    const from = (state && state.from) || '/board/posts?page=1';
    navigate(from);
  }

  function onClickEdit() {
    navigate(`/board/edit/${params.id}`);
  }

  function onClickDelete() {
    if (!params.id) return;
    if (window.confirm('포스트를 삭제하시겠습니까?')) {
      removePost(params.id);
    }
  }

  function removePost(id: string) {
    dispatch({ type: REMOVE_POST });
    postAPI
      .removePost(id)
      .then(({ data }) => {
        if (data.success) {
          dispatch({ type: REMOVE_POST_SUCCESS });
          navigate('/board/posts?page=1');
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response) {
          console.error(error);
          dispatch({
            type: REMOVE_POST_FAILURE,
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
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
      `}
    >
      <Button onClick={onClickList}>목록</Button>
      {user && user.id === (post && post.User.id) && (
        <div>
          <Button onClick={onClickEdit}>수정</Button>
          <Button onClick={onClickDelete}>삭제</Button>
        </div>
      )}
    </div>
  );
};

export default PostAction;
