import { localServer } from '@api/default';
import {
  CommentInfo,
  FullPostInfo,
  Params,
  PostInfo,
  SuccessResponse,
} from '@typings/db';

interface WritePostResponse extends SuccessResponse {
  readonly post: PostInfo;
}

interface GetPostResponse extends SuccessResponse {
  readonly post: FullPostInfo;
}

interface GetPostsResponse extends SuccessResponse {
  readonly posts: FullPostInfo[];
  readonly count: number;
}

interface AddCommentResponse extends SuccessResponse {
  readonly comment: CommentInfo;
}

interface RemoveCommentResponse extends SuccessResponse {
  readonly deletedAt: string;
}

const postAPI = {
  writePost: (post: FormData) =>
    localServer.post<WritePostResponse>('/posts', post),
  getPosts: (page: string) =>
    localServer.get<GetPostsResponse>('/posts', { params: { page } }),
  getPost: (id: string) => localServer.get<GetPostResponse>(`/posts/${id}`),
  editPost: (id: string, post: FormData) =>
    localServer.patch<WritePostResponse>(`/posts/${id}`, post),
  removePost: (id: string) =>
    localServer.delete<SuccessResponse>(`/posts/${id}`),
  recommendPost: (id: string) =>
    localServer.post<SuccessResponse>(`/posts/${id}/recommend`),
  unrecommendPost: (id: string) =>
    localServer.delete<SuccessResponse>(`/posts/${id}/recommend`),
  searchPost: (value: Params) =>
    localServer.get<GetPostsResponse>('/posts/search', {
      params: {
        page: value.page,
        search_type: value.search_type,
        keyword: value.keyword,
      },
    }),

  addComment: (id: string | number, comment: string) =>
    localServer.post<AddCommentResponse>(`/posts/${id}/comment`, { comment }),
  removeComment: (id: number) =>
    localServer.delete<RemoveCommentResponse>(`/posts/${id}/comment`),
  addReplyComment: (id: string | number, comment: string) =>
    localServer.post<AddCommentResponse>(`/posts/comment/${id}/reply`, {
      comment,
    }),
  removeReplyComment: (id: number) =>
    localServer.delete<RemoveCommentResponse>(`/posts/comment/${id}/reply`),
  addLikeComment: (id: number) =>
    localServer.post<SuccessResponse>(`/posts/comment/${id}/like`),
  addDislikeComment: (id: number) =>
    localServer.post<SuccessResponse>(`/posts/comment/${id}/dislike`),
  removeLikeComment: (id: number) =>
    localServer.delete<SuccessResponse>(`/posts/comment/${id}/like`),
  removeDislikeComment: (id: number) =>
    localServer.delete<SuccessResponse>(`/posts/comment/${id}/dislike`),

  removeFile: (id: number) =>
    localServer.delete<SuccessResponse>(`/posts/${id}/file`),
  incrementViews: (id: number) =>
    localServer.post<SuccessResponse>(`/posts/${id}/views`),
};

export default postAPI;
