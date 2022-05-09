import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { css } from '@emotion/react';
import { Button } from 'antd';
import axios from 'axios';
import useInput from '@hooks/useInput';
import postAPI from '@api/post';
import { usePostState, usePostDispatch } from '@context/PostContext';
import {
  EDIT_POST,
  EDIT_POST_FAILURE,
  EDIT_POST_SUCCESS,
  WRITE_POST,
  WRITE_POST_FAILURE,
  WRITE_POST_SUCCESS,
} from '@reducers/actions';
import FileUploader from '@components/FileUploader';
import AttachedFiles from '@components/AttachedFiles';
import { FailureResponse } from '@typings/db';

const WritePost = (): React.ReactElement => {
  const params = useParams<'id'>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    state: { post, newPost, isError },
  } = usePostState();
  const { dispatch } = usePostDispatch();
  const initialPostInput: { title: string; contents: string } =
    location.pathname === '/board/write'
      ? { title: '', contents: '' }
      : { title: post ? post.title : '', contents: post ? post.contents : '' };
  const [postInput, onChangePostInput] = useInput(initialPostInput);
  const [postFiles, setPostFiles] = useState<File[]>([]);

  const postTitleInputRef = useRef<HTMLInputElement | null>(null);
  const setPostTitleInputRef: React.RefCallback<HTMLInputElement> = useCallback(
    (element: HTMLInputElement) => {
      postTitleInputRef.current = element;
    },
    []
  );

  function onClickGoBack() {
    navigate(-1);
  }

  function writePost(data: FormData) {
    dispatch({ type: WRITE_POST });
    postAPI
      .writePost(data)
      .then(({ data }) => {
        if (data.success) {
          dispatch({ type: WRITE_POST_SUCCESS, post: data.post });
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response) {
          console.error(error);
          dispatch({
            type: WRITE_POST_FAILURE,
            error: error.response.data as FailureResponse,
          });
        } else {
          console.error('unexpected error: ', error);
        }
      });
  }

  function editPost(data: FormData) {
    if (!params.id) return;

    dispatch({ type: EDIT_POST });
    postAPI
      .editPost(params.id, data)
      .then(({ data }) => {
        if (data.success) {
          dispatch({ type: EDIT_POST_SUCCESS, post: data.post });
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response) {
          console.error(error);
          dispatch({
            type: EDIT_POST_FAILURE,
            error: error.response.data as FailureResponse,
          });
        } else {
          console.error('unexpected error: ', error);
        }
      });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!postInput.title) {
      alert('제목을 입력하세요');
      if (postTitleInputRef.current) {
        postTitleInputRef.current.focus();
      }
      return;
    }

    const formData = new FormData();
    formData.append('title', postInput.title);
    formData.append('contents', postInput.contents);
    if (postFiles) {
      postFiles.map(file => {
        formData.append('files', file);
      });
    }

    location.pathname === '/board/write'
      ? writePost(formData)
      : editPost(formData);
  }

  useEffect(() => {
    if (newPost) {
      navigate(`/board/post/${newPost.id}`);
    }
  }, [newPost]);

  useEffect(() => {
    if (isError) {
      alert(isError.message);
    }
  }, [isError]);

  return (
    <>
      <form onSubmit={onSubmit} encType="multipart/form-data">
        <h2>글쓰기</h2>
        <input
          ref={setPostTitleInputRef}
          type="text"
          name="title"
          css={css`
            width: 100%;
            border: 1px solid #eee;
            margin: 10px 0;
            padding: 10px;
          `}
          value={postInput.title}
          onChange={onChangePostInput}
          placeholder="제목"
        />
        <textarea
          name="contents"
          id="contents"
          css={css`
            min-height: 200px;
            width: 100%;
            resize: none;
            border: 1px solid #eee;
            padding: 10px;
          `}
          value={postInput.contents}
          onChange={onChangePostInput}
          placeholder="내용을 입력하세요"
        />
        <div
          css={css`
            display: flex;
            justify-content: space-between;
          `}
        >
          <Button onClick={onClickGoBack}>이전</Button>
          <Button htmlType="submit">작성</Button>
        </div>
        <FileUploader setFiles={setPostFiles} />
      </form>
      {params.id &&
        location.pathname === `/board/edit/${params.id}` &&
        post && <AttachedFiles files={post.Files} />}
    </>
  );
};

export default WritePost;
