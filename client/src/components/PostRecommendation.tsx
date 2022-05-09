import * as React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { css } from '@emotion/react';
import { Button } from 'antd';
import axios from 'axios';
import { useUserState } from '@context/UserContext';
import postAPI from '@api/post';

const PostRecommendation = ({
  recommenders,
}: {
  recommenders: { readonly id: number }[];
}): React.ReactElement => {
  const params = useParams<'id'>();
  const { user } = useUserState();
  const [isRecommended, setIsRecommended] =
    useState<boolean>(getRecommendedStatus);
  const [recommendationCount, setRecommendationCount] = useState<number>(
    recommenders.length
  );

  function getRecommendedStatus(): boolean {
    return user
      ? !!recommenders.find(recommender => recommender.id === user.id)
      : false;
  }

  function recommendPost(id: string) {
    postAPI
      .recommendPost(id)
      .then(({ data }) => {
        if (data.success) {
          setIsRecommended(prevState => !prevState);
          setRecommendationCount(prevCount => prevCount + 1);
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response) {
          console.error(error);
        } else {
          console.error('unexpected error: ', error);
        }
      });
  }

  function unrecommendPost(id: string) {
    postAPI
      .unrecommendPost(id)
      .then(({ data }) => {
        if (data.success) {
          setIsRecommended(prevState => !prevState);
          setRecommendationCount(prevCount => prevCount - 1);
        }
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response) {
          console.error(error);
        } else {
          console.error('unexpected error: ', error);
        }
      });
  }

  function toggleRecommendation() {
    if (!user) {
      return alert('로그인이 필요합니다.');
    }
    if (!params.id) return;
    isRecommended ? unrecommendPost(params.id) : recommendPost(params.id);
  }

  return (
    <Button
      onClick={toggleRecommendation}
      css={
        isRecommended &&
        css`
          border-color: #1890ff;
          color: #1890ff;
        `
      }
    >
      추천 {recommendationCount}
    </Button>
  );
};

export default PostRecommendation;
