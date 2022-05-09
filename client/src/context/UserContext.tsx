import * as React from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  nickname: string;
}

interface UserStateContext {
  user: User | null;
  clientRef: React.MutableRefObject<string>;
}

interface UserUpdaterContext {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserStateContext = createContext<UserStateContext>({
  user: null,
  clientRef: { current: '' },
});

const UserUpdaterContext = createContext<UserUpdaterContext>({
  setUser: () => null,
});

export const useUserState = () => {
  const state = useContext(UserStateContext);
  if (!state) {
    throw new Error('UserProvider can not found');
  }
  return state;
};

export const useUserUpdater = () => {
  const updater = useContext(UserUpdaterContext);
  if (!updater) {
    throw new Error('UserProvider can not found');
  }
  return updater;
};

const checkUser = (user: any): user is User => {
  return 'id' in user && 'email' in user && 'nickname' in user;
};

const getStoragedUser = (): User | null => {
  const storagedUser = sessionStorage.getItem('user');
  if (typeof storagedUser === 'string') {
    const parsedUser = JSON.parse(storagedUser);
    checkUser(parsedUser) ? parsedUser : null;
  }
  return null;
};

export const UserProvider = ({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement => {
  const [user, setUser] = useState<User | null>(getStoragedUser);
  const clientRef = useRef<string>('');

  const getClientIp = () => {
    axios
      .get('https://api.ipify.org?format=json')
      .then(({ data }) => {
        clientRef.current = data.ip;
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!user) {
      getClientIp();
    }
  }, [user]);

  return (
    <UserUpdaterContext.Provider value={{ setUser }}>
      <UserStateContext.Provider value={{ user, clientRef }}>
        {children}
      </UserStateContext.Provider>
    </UserUpdaterContext.Provider>
  );
};
