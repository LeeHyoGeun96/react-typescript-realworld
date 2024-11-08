import {
  CreateArticleDTO,
  CreateArticleRequestParams,
  CreateArticleResponse,
  DeleteArticleRequestParams,
  GetCommentsByArticleResponse,
  GetUniqueArticleRequestParams,
  GetUniqueArticleResponse,
  UpdateArticleDTO,
  UpdateArticleRequestParams,
  UpdateArticleResponse,
  GetCommentsByArticleRequestParams,
  AddCommentRequestParams,
  AddCommentDTO,
  AddCommentResponse,
  DeleteCommentRequestParams,
} from '../types/articleTypes';
import {apiClient} from '../util/api';

export const articleService = {
  createArticle: ({article, token}: CreateArticleRequestParams) => {
    return apiClient.post<CreateArticleResponse, CreateArticleDTO>(
      '/articles',
      {article},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },

  getUniqueArticle: ({slug, token}: GetUniqueArticleRequestParams) => {
    const headers = token ? {Authorization: `Bearer ${token}`} : {};
    return apiClient.get<GetUniqueArticleResponse, void>(`/articles/${slug}`, {
      headers,
    });
  },

  updateArticle: ({slug, article, token}: UpdateArticleRequestParams) => {
    return apiClient.put<UpdateArticleResponse, UpdateArticleDTO>(
      `/articles/${slug}`,
      {article},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },

  deleteArticle: ({slug, token}: DeleteArticleRequestParams) => {
    return apiClient.delete<void, void>(`/articles/${slug}`, {
      headers: {Authorization: `Bearer ${token}`},
    });
  },

  getComments: ({slug, token}: GetCommentsByArticleRequestParams) => {
    const headers = token ? {Authorization: `Bearer ${token}`} : {};
    return apiClient.get<GetCommentsByArticleResponse, void>(
      `/articles/${slug}/comments`,
      {
        headers,
      },
    );
  },

  addComment: ({slug, comment, token}: AddCommentRequestParams) => {
    return apiClient.post<AddCommentResponse, AddCommentDTO>(
      `/articles/${slug}/comments`,
      {comment: {body: comment}},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },

  deleteComment: ({slug, id, token}: DeleteCommentRequestParams) => {
    return apiClient.delete<void, void>(`/articles/${slug}/comments/${id}`, {
      headers: {Authorization: `Bearer ${token}`},
    });
  },
};
