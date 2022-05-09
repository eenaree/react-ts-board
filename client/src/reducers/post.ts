import {
  EDIT_POST,
  EDIT_POST_FAILURE,
  EDIT_POST_SUCCESS,
  GET_POST,
  GET_POSTS,
  GET_POSTS_FAILURE,
  GET_POSTS_SUCCESS,
  GET_POST_FAILURE,
  GET_POST_SUCCESS,
  REMOVE_POST,
  REMOVE_POST_FAILURE,
  REMOVE_POST_SUCCESS,
  SEARCH_POST,
  SEARCH_POST_FAILURE,
  SEARCH_POST_SUCCESS,
  WRITE_POST,
  WRITE_POST_FAILURE,
  WRITE_POST_SUCCESS,
} from '@reducers/actions';
import { PostAction, PostState } from '@typings/db';

export default function postReducer(
  state: PostState,
  action: PostAction
): PostState {
  switch (action.type) {
    case WRITE_POST:
      return {
        ...state,
        isLoading: true,
        isError: null,
      };
    case WRITE_POST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        newPost: action.post,
      };
    case GET_POSTS:
      return {
        ...state,
        isLoading: true,
        isError: null,
        post: null,
      };
    case GET_POSTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        count: action.count,
        posts: action.posts,
      };
    case GET_POST:
      return {
        ...state,
        isLoading: true,
        isError: null,
        newPost: null,
      };
    case GET_POST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        post: action.post,
      };
    case EDIT_POST:
      return {
        ...state,
        isLoading: true,
        isError: null,
      };
    case EDIT_POST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        newPost: action.post,
      };
    case REMOVE_POST:
      return {
        ...state,
        isLoading: true,
        isError: null,
      };
    case REMOVE_POST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        post: null,
      };
    case SEARCH_POST:
      return {
        ...state,
        isLoading: true,
        isError: null,
      };
    case SEARCH_POST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        posts: action.posts,
        count: action.count,
      };
    case WRITE_POST_FAILURE:
    case GET_POSTS_FAILURE:
    case GET_POST_FAILURE:
    case EDIT_POST_FAILURE:
    case REMOVE_POST_FAILURE:
    case SEARCH_POST_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: action.error,
      };
  }
}
