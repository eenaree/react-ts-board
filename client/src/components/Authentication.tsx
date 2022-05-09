import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserState } from '@context/UserContext';

const Authentication = ({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement => {
  const { user } = useUserState();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace={true}
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return children;
};

export default Authentication;
