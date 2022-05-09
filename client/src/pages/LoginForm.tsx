import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { Alert } from 'antd';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import TextField from '@components/TextField';
import { useUserState, useUserUpdater } from '@context/UserContext';
import userAPI from '@api/user';
import { FailureResponse, LoginInfo } from '@typings/db';

interface CustomLocationState {
  readonly from: string;
}

const userFormSchema = Yup.object({
  email: Yup.string()
    .email('이메일 주소가 유효하지 않습니다.')
    .required('필수 입력 항목입니다.'),
  password: Yup.string()
    .min(8, '최소 8자 이상이어야 합니다.')
    .required('필수 입력 항목입니다.'),
});

const LoginForm = (): React.ReactElement => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { user } = useUserState();
  const { setUser } = useUserUpdater();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CustomLocationState;
  const fromRef = useRef<string>((state && state.from) || '/');

  async function loginUser(userInfo: LoginInfo) {
    try {
      const { data } = await userAPI.login(userInfo);
      if (data.success) {
        setUser(data.user);
      }
    } catch (error: unknown) {
      let message: string;
      if (axios.isAxiosError(error) && error.response) {
        console.error(error);
        message = (error.response.data as FailureResponse).message;
      } else {
        console.error('unexpected error: ', error);
        message = 'unexpected error';
      }
      setErrorMessage(message);
    }
  }

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
      navigate(fromRef.current, { replace: true });
    }
  }, [user]);

  return (
    <>
      <h2
        css={css`
          text-align: center;
          font-weight: 700;
        `}
      >
        로그인
      </h2>
      <Formik
        initialValues={{ email: '', password: '', confirm: '', nickname: '' }}
        validationSchema={userFormSchema}
        onSubmit={(userInfo, { setSubmitting }) => {
          loginUser(userInfo);
          setSubmitting(false);
        }}
      >
        <Form
          css={css`
            min-width: 300px;
          `}
        >
          <TextField
            type="text"
            label="이메일"
            name="email"
            placeholder="ex) abc123@gmail.com"
          />
          <TextField
            type="password"
            label="비밀번호"
            name="password"
            placeholder="비밀번호를 입력하세요"
          />
          <button
            type="submit"
            css={css`
              width: 100%;
              padding: 10px 20px;
              margin: 10px 0;
              background: #333;
              color: #fff;
              border-radius: 10px;
              cursor: pointer;
            `}
          >
            로그인
          </button>
        </Form>
      </Formik>
      {errorMessage && (
        <Alert
          message={errorMessage}
          css={css`
            text-align: center;
            font-weight: 700;
            margin: 10px 0;
          `}
          type="error"
        />
      )}
      <Link
        to="/register"
        css={css`
          display: block;
          text-align: right;
        `}
      >
        아직 회원이 아니신가요?
      </Link>
    </>
  );
};

export default LoginForm;
