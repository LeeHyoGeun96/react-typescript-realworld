import {
  CreateArticleDTO,
  CreateArticleRequestParams,
  CreateArticleResponse,
  DeleteArticleRequestParams,
  GetUniqueArticleRequestParams,
  GetUniqueArticleResponse,
  UpdateArticleDTO,
  UpdateArticleRequestParams,
  UpdateArticleResponse,
} from '../types/articleTypes';
import { apiClient } from '../util/api';

export const articleService = {
  createArticle: ({ article, token }: CreateArticleRequestParams) => {
    return apiClient.post<CreateArticleResponse, CreateArticleDTO>(
      '/articles',
      { article },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },

  getUniqueArticle: ({ slug, token }: GetUniqueArticleRequestParams) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return apiClient.get<GetUniqueArticleResponse, void>(`/articles/${slug}`, {
      headers,
    });
  },

  updateArticle: ({ slug, article, token }: UpdateArticleRequestParams) => {
    return apiClient.put<UpdateArticleResponse, UpdateArticleDTO>(
      `/articles/${slug}`,
      { article },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },

  deleteArticle: ({ slug, token }: DeleteArticleRequestParams) => {
    return apiClient.delete<void, void>(`/articles/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
