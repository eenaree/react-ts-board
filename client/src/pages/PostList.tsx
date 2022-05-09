import * as React from 'react';
import Posts from '@components/Posts';
import PostSearch from '@components/PostSearch';

const PostList = (): React.ReactElement => {
  return (
    <div>
      <h2>자유게시판</h2>
      <Posts />
      <PostSearch />
    </div>
  );
};

export default PostList;
