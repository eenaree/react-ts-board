import * as React from 'react';
import { createContext, useContext, useReducer, useRef } from 'react';
import postReducer from '@reducers/post';
import { PostAction, PostState } from '@typings/db';

interface PostStateType {
  state: PostState;
  viewsRef: React.MutableRefObject<string[][]>;
}

interface PostDispatchType {
  dispatch: React.Dispatch<PostAction>;
}

const PostStateContext = createContext<PostStateType | undefined>(undefined);

const PostDispatchContext = createContext<PostDispatchType | undefined>(
  undefined
);

export const usePostState = () => {
  const state = useContext(PostStateContext);
  if (!state) {
    throw new Error('PostProvider can not found');
  }
  return state;
};

export const usePostDispatch = () => {
  const dispatch = useContext(PostDispatchContext);
  if (!dispatch) {
    throw new Error('PostProvider can not found');
  }
  return dispatch;
};

export const PostProvider = ({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement => {
  const [state, dispatch] = useReducer(postReducer, {
    isLoading: false,
    isError: null,
    count: 0,
    posts: [],
    post: null,
    newPost: null,
  });
  const viewsRef = useRef<string[][]>([]);

  return (
    <PostDispatchContext.Provider value={{ dispatch }}>
      <PostStateContext.Provider value={{ state, viewsRef }}>
        {children}
      </PostStateContext.Provider>
    </PostDispatchContext.Provider>
  );
};
