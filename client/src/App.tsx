import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import AppLayout from '@components/AppLayout';
import FormContainer from '@components/FormContainer';
import Home from '@pages/Home';
import LoginForm from '@pages/LoginForm';
import PostList from '@pages/PostList';
import RegisterForm from '@pages/RegisterForm';
import Authentication from '@components/Authentication';
import WritePost from '@pages/WritePost';
import ViewPost from '@pages/ViewPost';
import '@styles/index.css';

const App = (): React.ReactElement => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="board">
          <Route path="posts" element={<PostList />} />
          <Route path="post">
            <Route path=":id" element={<ViewPost />} />
          </Route>
          <Route
            path="write"
            element={
              <Authentication>
                <WritePost />
              </Authentication>
            }
          />
          <Route
            path="edit/:id"
            element={
              <Authentication>
                <WritePost />
              </Authentication>
            }
          />
        </Route>
        <Route element={<FormContainer />}>
          <Route path="register" element={<RegisterForm />} />
          <Route path="login" element={<LoginForm />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
