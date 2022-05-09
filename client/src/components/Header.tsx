import * as React from 'react';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { Button, Col, Menu, Row } from 'antd';
import axios from 'axios';
import { useUserState, useUserUpdater } from '@context/UserContext';
import userAPI from '@api/user';
import { FailureResponse } from '@typings/db';

const Header = (): React.ReactElement => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserState();
  const { setUser } = useUserUpdater();

  async function logoutUser() {
    try {
      const { data } = await userAPI.logout();
      if (data.success) {
        setUser(null);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        alert((error.response.data as FailureResponse).message);
      } else {
        console.error('unexpected error: ', error);
      }
    }
  }

  function onClickLogout() {
    logoutUser();
  }

  useEffect(() => {
    if (!user) {
      sessionStorage.removeItem('user');
      navigate('/');
    }
  }, [user]);

  return (
    <header>
      <Row>
        <Col span={6}>
          <h1
            css={css`
              text-align: center;
            `}
          >
            <Link
              to="/"
              css={css`
                color: #333;
                font-size: 20px;
              `}
            >
              React Board
            </Link>
          </h1>
        </Col>
        <Col span={12}>
          <Menu mode="horizontal">
            <Menu.Item key="all">
              <Link to="/board/posts?page=1">자유게시판</Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col span={6}>
          {user ? (
            <div
              css={css`
                margin-top: 10px;
              `}
            >
              <span
                css={css`
                  margin-right: 10px;
                `}
              >
                {user.nickname}님
              </span>
              <Button onClick={onClickLogout}>로그아웃</Button>
            </div>
          ) : (
            <Menu mode="horizontal">
              <Menu.Item key="login">
                <Link
                  to="/login"
                  state={{ from: location.pathname + location.search }}
                >
                  로그인
                </Link>
              </Menu.Item>
              <Menu.Item key="register">
                <Link to="/register">회원가입</Link>
              </Menu.Item>
            </Menu>
          )}
        </Col>
      </Row>
    </header>
  );
};

export default Header;
