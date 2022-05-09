export interface SuccessResponse {
  readonly success: true;
  readonly message: string;
}

export interface FailureResponse {
  readonly success: false;
  readonly message: string;
}

export interface LoginInfo {
  email: string;
  password: string;
}

export interface RegisterInfo extends LoginInfo {
  confirm: string;
  nickname: string;
}

interface CommonInfo {
  readonly id: number;
  readonly createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface PostInfo extends CommonInfo {
  title: string;
  contents: string;
  views: number;
  UserId: number;
  recommenders: { readonly id: number }[];
}

export interface UserInfo extends CommonInfo {
  email: string;
  nickname: string;
}

export interface CommentInfo extends CommonInfo {
  comment: string;
  UserId: number;
  User: UserInfo;
  likers: { readonly id: number }[];
  dislikers: { readonly id: number }[];
  replies?: CommentInfo[];
}

export interface FileInfo extends CommonInfo {
  fileUrl: string;
  PostId: number;
}

export interface FullPostInfo extends PostInfo {
  User: UserInfo;
  Comments: CommentInfo[];
  Files: FileInfo[];
}

export interface PostState {
  isLoading: boolean;
  isError: FailureResponse | null;
  count: number;
  posts: FullPostInfo[];
  post: FullPostInfo | null;
  newPost: PostInfo | null;
}

export type PostAction =
  | { type: 'WRITE_POST' }
  | { type: 'WRITE_POST_SUCCESS'; post: PostInfo }
  | { type: 'WRITE_POST_FAILURE'; error: FailureResponse }
  | { type: 'GET_POSTS' }
  | { type: 'GET_POSTS_SUCCESS'; posts: FullPostInfo[]; count: number }
  | { type: 'GET_POSTS_FAILURE'; error: FailureResponse }
  | { type: 'GET_POST' }
  | { type: 'GET_POST_SUCCESS'; post: FullPostInfo }
  | { type: 'GET_POST_FAILURE'; error: FailureResponse }
  | { type: 'EDIT_POST' }
  | { type: 'EDIT_POST_SUCCESS'; post: PostInfo }
  | { type: 'EDIT_POST_FAILURE'; error: FailureResponse }
  | { type: 'REMOVE_POST' }
  | { type: 'REMOVE_POST_SUCCESS' }
  | { type: 'REMOVE_POST_FAILURE'; error: FailureResponse }
  | { type: 'SEARCH_POST' }
  | { type: 'SEARCH_POST_SUCCESS'; posts: FullPostInfo[]; count: number }
  | { type: 'SEARCH_POST_FAILURE'; error: FailureResponse };

export type SearchType = 'all' | 'title' | 'contents' | 'writer';

export interface Params {
  page?: string;
  search_type?: SearchType;
  keyword?: string;
}
