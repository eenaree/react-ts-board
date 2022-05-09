import {
  ADD_REPLY,
  ADD_REPLY_SUCCESS,
  ADD_REPLY_FAILURE,
  REMOVE_REPLY,
  REMOVE_REPLY_SUCCESS,
  REMOVE_REPLY_FAILURE,
} from '@reducers/actions';
import { CommentInfo, FailureResponse } from '@typings/db';

interface ReplyState {
  isLoading: boolean;
  isError: FailureResponse | null;
  replies: CommentInfo[];
}

type ReplyAction =
  | { type: 'ADD_REPLY' }
  | { type: 'ADD_REPLY_SUCCESS'; reply: CommentInfo }
  | { type: 'ADD_REPLY_FAILURE'; error: FailureResponse }
  | { type: 'REMOVE_REPLY' }
  | { type: 'REMOVE_REPLY_SUCCESS'; id: number; deletedAt: string }
  | { type: 'REMOVE_REPLY_FAILURE'; error: FailureResponse };

export default function replyReducer(
  state: ReplyState,
  action: ReplyAction
): ReplyState {
  switch (action.type) {
    case ADD_REPLY:
    case REMOVE_REPLY:
      return {
        ...state,
        isLoading: true,
        isError: null,
      };
    case ADD_REPLY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        replies: [...state.replies, action.reply],
      };
    case REMOVE_REPLY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        replies: state.replies.map(reply =>
          reply.id === action.id
            ? { ...reply, deletedAt: action.deletedAt }
            : reply
        ),
      };
    case ADD_REPLY_FAILURE:
    case REMOVE_REPLY_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: action.error,
      };
  }
}
