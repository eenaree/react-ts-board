import { localServer } from '@api/default';
import { LoginInfo, RegisterInfo, SuccessResponse } from '@typings/db';

interface LoginResponse extends SuccessResponse {
  readonly user: {
    id: number;
    email: string;
    nickname: string;
  };
}

const userAPI = {
  register: (userInfo: RegisterInfo) =>
    localServer.post<SuccessResponse>('/users/register', userInfo),
  login: (userInfo: LoginInfo) =>
    localServer.post<LoginResponse>('/users/login', userInfo),
  logout: () => localServer.get<SuccessResponse>('/users/logout'),
};

export default userAPI;
