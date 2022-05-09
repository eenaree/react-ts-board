import * as React from 'react';
import { Link } from 'react-router-dom';
import { css } from '@emotion/react';
import { usePostState } from '@context/PostContext';

const tableStyle = css`
  width: 100%;
  th {
    border-bottom: 2px solid #333;
  }
  tr {
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
  th,
  td {
    height: 50px;
  }
  td {
    text-align: center;
  }
`;

const PostsTable = (): React.ReactElement => {
  const {
    state: { posts },
  } = usePostState();

  return (
    <table css={tableStyle}>
      <tbody>
        <tr>
          <th style={{ width: '8%' }}>번호</th>
          <th style={{ width: '60%' }}>제목</th>
          <th>작성자</th>
          <th>등록일</th>
          <th>조회수</th>
        </tr>
        {posts.length > 0 ? (
          posts.map(post => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>
                <Link
                  to={`/board/post/${post.id}`}
                  state={{ from: location.pathname + location.search }}
                >
                  {post.title}
                </Link>
              </td>
              <td>{post.User.nickname}</td>
              <td>{post.createdAt}</td>
              <td>{post.views}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td></td>
            <td rowSpan={5}>게시글이 존재하지 않습니다.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default PostsTable;
