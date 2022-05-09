import * as React from 'react';
import { css } from '@emotion/react';
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
} from '@ant-design/icons';

interface Props {
  onClickLike: () => void;
  onClickDislike: () => void;
  likeAction: 'liked' | null;
  dislikeAction: 'disliked' | null;
  likers: number;
  dislikers: number;
}

const buttonStyle = css`
  cursor: pointer;
  border: none;
  padding: 0;
  margin-right: 5px;
  background: none;
  span {
    margin-left: 5px;
  }
`;

const LikeAndDislikeButton = ({
  onClickLike,
  onClickDislike,
  likeAction,
  dislikeAction,
  likers,
  dislikers,
}: Props): React.ReactElement => {
  return (
    <>
      <button onClick={onClickLike} css={buttonStyle}>
        {likeAction === 'liked' ? <LikeFilled /> : <LikeOutlined />}
        <span>{likers}</span>
      </button>
      <button onClick={onClickDislike} css={buttonStyle}>
        {dislikeAction === 'disliked' ? <DislikeFilled /> : <DislikeOutlined />}
        <span>{dislikers}</span>
      </button>
    </>
  );
};

export default LikeAndDislikeButton;
