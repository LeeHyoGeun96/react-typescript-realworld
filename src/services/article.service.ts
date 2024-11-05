import {
  CreateArticleDTO,
  CreateArticleRequestParams,
  CreateArticleResponse,
  GetUniqueArticleDTO,
  GetUniqueArticleRequestParams,
  GetUniqueArticleResponse,
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
    return apiClient.get<GetUniqueArticleResponse, GetUniqueArticleDTO>(
      `/articles/${slug}`,
      {
        headers,
      },
    );
  },
};
