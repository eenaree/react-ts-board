import * as React from 'react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, Button, Input } from 'antd';
import { InputRef } from 'antd/lib/input';
import { SearchType } from '@typings/db';

const PostSearch = (): React.ReactElement => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [keyword, setKeyword] = useState<string>('');
  const onChangeSearchType = (value: SearchType) => setSearchType(value);
  const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setKeyword(e.target.value);

  const searchInputRef = useRef<InputRef>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!keyword) {
      alert('검색어를 입력하세요');
      if (!searchInputRef.current) return;
      searchInputRef.current.focus();
      return;
    }

    navigate({
      pathname: '/board/posts',
      search: `?page=1&search_type=${searchType}&keyword=${keyword}`,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <Select defaultValue="all" onChange={onChangeSearchType}>
        <Select.Option value="all">전체</Select.Option>
        <Select.Option value="title">제목</Select.Option>
        <Select.Option value="contents">내용</Select.Option>
        <Select.Option value="writer">작성자</Select.Option>
      </Select>
      <Input
        ref={searchInputRef}
        value={keyword}
        onChange={onChangeKeyword}
        style={{ width: '30%' }}
      />
      <Button htmlType="submit">검색</Button>
    </form>
  );
};

export default PostSearch;
