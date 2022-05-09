import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import LikeAndDislikeButton from '@components/LikeAndDislikeButton';
import { useUserState } from '@context/UserContext';
import { CommentInfo } from '@typings/db';
import postAPI from '@api/post';

interface Props {
  comment: CommentInfo;
  deleted: boolean;
}

const CommentLikeAndDislikeButton = ({
  comment,
  deleted,
}: Props): React.ReactElement => {
  const { user } = useUserState();
  const [likeAction, setLikeAction] = useState<'liked' | null>(
    getInitialLikeStatus
  );
  const [dislikeAction, setDislikeAction] = useState<'disliked' | null>(
    getInitialDislikeStatus
  );
  const [likers, setLikers] = useState<number>(() => comment.likers.length);
  const [dislikers, setDislikers] = useState<number>(
    () => comment.dislikers.length
  );

  function getInitialLikeStatus() {
    if (!user) return null;

    const isLiked = !!comment.likers.find(liker => liker.id === user.id);
    return isLiked ? 'liked' : null;
  }

  function getInitialDislikeStatus() {
    if (!user) return null;

    const isDisliked = !!comment.dislikers.find(
      disliker => disliker.id === user.id
    );
    return isDisliked ? 'disliked' : null;
  }

  const onClickLike = () => {
    if (deleted) {
      alert('삭제된 댓글에는 좋아요 표시가 불가능합니다.');
      return;
    }
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (likeAction === 'liked') {
      removeLikeComment(comment.id);
    } else {
      dislikeAction === 'disliked' && removeDislikeComment(comment.id);
      addLikeComment(comment.id);
    }
  };

  const onClickDislike = () => {
    if (deleted) {
      alert('삭제된 댓글에는 좋아요 표시가 불가능합니다.');
      return;
    }
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (dislikeAction === 'disliked') {
      removeDislikeComment(comment.id);
    } else {
      likeAction === 'liked' && removeLikeComment(comment.id);
      addDislikeComment(comment.id);
    }
  };

  const addLikeComment = (id: number) => {
    postAPI
      .addLikeComment(id)
      .then(({ data }) => {
        if (data.success) {
          setLikeAction('liked');
          setLikers(prev => prev + 1);
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response) {
          console.error(error);
        } else {
          console.error('unexpected error: ', error);
        }
      });
  };

  const addDislikeComment = (id: number) => {
    postAPI
      .addDislikeComment(id)
      .then(({ data }) => {
        if (data.success) {
          setDislikeAction('disliked');
          setDislikers(prev => prev + 1);
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response) {
          console.error(error);
        } else {
          console.error('unexpected error: ', error);
        }
      });
  };

  const removeLikeComment = (id: number) => {
    postAPI
      .removeLikeComment(id)
      .then(({ data }) => {
        if (data.success) {
          setLikeAction(null);
          setLikers(prev => prev - 1);
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response) {
          console.error(error);
        } else {
          console.error('unexpected error: ', error);
        }
      });
  };

  const removeDislikeComment = (id: number) => {
    postAPI
      .removeDislikeComment(id)
      .then(({ data }) => {
        if (data.success) {
          setDislikeAction(null);
          setDislikers(prev => prev - 1);
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response) {
          console.error(error);
        } else {
          console.error('unexpected error: ', error);
        }
      });
  };

  return (
    <LikeAndDislikeButton
      onClickLike={onClickLike}
      onClickDislike={onClickDislike}
      likeAction={likeAction}
      dislikeAction={dislikeAction}
      likers={likers}
      dislikers={dislikers}
    />
  );
};

export default CommentLikeAndDislikeButton;
