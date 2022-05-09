import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { css } from '@emotion/react';
import { Button, Pagination } from 'antd';
import axios from 'axios';
import { usePostState, usePostDispatch } from '@context/PostContext';
import postAPI from '@api/post';
import {
  GET_POSTS,
  GET_POSTS_FAILURE,
  GET_POSTS_SUCCESS,
  SEARCH_POST,
  SEARCH_POST_FAILURE,
  SEARCH_POST_SUCCESS,
} from '@reducers/actions';
import PostsTable from '@components/PostsTable';
import { FailureResponse, Params } from '@typings/db';

const Posts = (): React.ReactElement => {
  const navigate = useNavigate();
  const {
    state: { isLoading, isError, count },
  } = usePostState();
  const { dispatch } = usePostDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState<number>(getPageNumber);

  function getPageNumber(): number {
    const page = searchParams.get('page');
    return page ? parseInt(page) : 1;
  }

  const onChangePage = (page: number) => {
    const currentParams: Params = Object.fromEntries([...searchParams]);
    setPage(page);
    setSearchParams({ ...currentParams, page: String(page) });
  };

  const onClickWrite = () => {
    navigate('/board/write');
  };

  const searchPost = useCallback((value: Params) => {
    dispatch({ type: SEARCH_POST });
    postAPI
      .searchPost(value)
      .then(({ data }) => {
        if (data.success) {
          dispatch({
            type: SEARCH_POST_SUCCESS,
            posts: data.posts,
            count: data.count,
          });
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response) {
          console.error(error);
          dispatch({
            type: SEARCH_POST_FAILURE,
            error: error.response.data as FailureResponse,
          });
        } else {
          console.error('unexpected error: ', error);
        }
      });
  }, []);

  const getPosts = useCallback((page: string) => {
    dispatch({ type: GET_POSTS });
    postAPI
      .getPosts(page)
      .then(({ data }) => {
        if (data.success) {
          dispatch({
            type: GET_POSTS_SUCCESS,
            posts: data.posts,
            count: data.count,
          });
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response) {
          console.error(error);
          dispatch({
            type: GET_POSTS_FAILURE,
            error: error.response.data as FailureResponse,
          });
        } else {
          console.error('unexpected error: ', error);
        }
      });
  }, []);

  useEffect(() => {
    const currentParams: Params = Object.fromEntries([...searchParams]);
    if (currentParams.page) {
      if (!currentParams.keyword) {
        getPosts(currentParams.page);
      } else {
        currentParams.page === '1' && setPage(1);
        searchPost(currentParams);
      }
    }
  }, [searchParams, getPosts, searchPost]);

  if (isLoading) return <div>로딩 중....</div>;
  if (isError) return <div>에러가 발생했습니다.</div>;
  return (
    <>
      <PostsTable />
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
        `}
      >
        <Pagination total={count} current={page} onChange={onChangePage} />
        <Button onClick={onClickWrite}>글쓰기</Button>
      </div>
    </>
  );
};

export default Posts;
