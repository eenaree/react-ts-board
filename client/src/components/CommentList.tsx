import * as React from 'react';
import { css } from '@emotion/react';
import CommentBox from '@components/CommentBox';
import { CommentInfo } from '@typings/db';

interface Props {
  comments: CommentInfo[];
  removeComment: (id: number) => void;
}

const CommentList = ({
  comments,
  removeComment,
}: Props): React.ReactElement => {
  return (
    <div>
      {comments.map(comment => (
        <div
          key={comment.id}
          css={css`
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
          `}
        >
          <CommentBox comment={comment} removeComment={removeComment} />
        </div>
      ))}
    </div>
  );
};

export default CommentList;
