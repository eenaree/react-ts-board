import * as React from 'react';
import { useState } from 'react';
import { Comment } from 'antd';
import { css } from '@emotion/react';
import { useUserState } from '@context/UserContext';
import { CommentInfo } from '@typings/db';
import ReplyComments from '@components/ReplyComments';
import CommentLikeAndDislikeButton from '@components/CommentLikeAndDislikeButton';

interface Props {
  comment: CommentInfo;
  removeComment: (id: number) => void;
}

const CommentBox = ({ comment, removeComment }: Props): React.ReactElement => {
  const { user } = useUserState();
  const [openReply, setOpenReply] = useState<boolean>(false);
  const [replyCount, setReplyCount] = useState<number>(
    comment.replies ? comment.replies.length : 0
  );

  function toggleReply() {
    setOpenReply(prevState => !prevState);
  }

  function deleteComment(id: number) {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      removeComment(id);
    }
  }

  return (
    <>
      <Comment
        author={comment.User.nickname}
        content={
          comment.deletedAt
            ? '작성자에 의해 삭제된 메세지입니다.'
            : comment.comment
        }
        datetime={comment.createdAt}
        actions={[
          comment.replies && (
            <button
              onClick={toggleReply}
              css={css`
                cursor: pointer;
                background: none;
                border: none;
                color: #1890ff;
              `}
            >
              답글 {replyCount > 0 && <strong>{replyCount}</strong>}
            </button>
          ),
          <CommentLikeAndDislikeButton
            key="comment-like-status"
            comment={comment}
            deleted={!!comment.deletedAt}
          />,
        ]}
        css={css`
          position: relative;
        `}
      >
        {!comment.deletedAt && user && user.id === comment.User.id && (
          <button
            onClick={() => deleteComment(comment.id)}
            css={css`
              position: absolute;
              top: 16px;
              right: 0;
              cursor: pointer;
              border: none;
            `}
          >
            삭제
          </button>
        )}
      </Comment>
      {comment.replies && openReply && (
        <ReplyComments
          deleted={!!comment.deletedAt}
          commentId={comment.id}
          replies={comment.replies}
          setReplyCount={setReplyCount}
        />
      )}
    </>
  );
};

export default CommentBox;
