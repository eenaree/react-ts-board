import {
  ADD_COMMENT,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_SUCCESS,
  REMOVE_COMMENT,
  REMOVE_COMMENT_FAILURE,
  REMOVE_COMMENT_SUCCESS,
} from '@reducers/actions';
import { CommentInfo, FailureResponse } from '@typings/db';

interface CommentState {
  isLoading: boolean;
  isError: FailureResponse | null;
  comments: CommentInfo[];
}

type CommentAction =
  | { type: 'ADD_COMMENT' }
  | { type: 'ADD_COMMENT_SUCCESS'; comment: CommentInfo }
  | { type: 'ADD_COMMENT_FAILURE'; error: FailureResponse }
  | { type: 'REMOVE_COMMENT' }
  | { type: 'REMOVE_COMMENT_SUCCESS'; id: number; deletedAt: string }
  | { type: 'REMOVE_COMMENT_FAILURE'; error: FailureResponse };

export default function commentReducer(
  state: CommentState,
  action: CommentAction
): CommentState {
  switch (action.type) {
    case ADD_COMMENT:
    case REMOVE_COMMENT:
      return {
        ...state,
        isLoading: false,
        isError: null,
      };
    case ADD_COMMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        comments: [...state.comments, action.comment],
      };
    case REMOVE_COMMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        comments: state.comments.map(comment =>
          comment.id === action.id
            ? { ...comment, deletedAt: action.deletedAt }
            : comment
        ),
      };
    case ADD_COMMENT_FAILURE:
    case REMOVE_COMMENT_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: action.error,
      };
  }
}
