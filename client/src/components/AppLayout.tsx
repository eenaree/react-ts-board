import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { PostProvider } from '@context/PostContext';
import Header from '@components/Header';

const wrapperStyle = {
  minWidth: '1200px',
  margin: '0 auto',
};

const containerStyle = {
  width: '1000px',
  margin: '0 auto',
};

const AppLayout = (): React.ReactElement => {
  return (
    <div css={wrapperStyle}>
      <Header />
      <div css={containerStyle}>
        <PostProvider>
          <Outlet />
        </PostProvider>
      </div>
    </div>
  );
};

export default AppLayout;
