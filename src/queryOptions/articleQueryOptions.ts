import {keepPreviousData} from '@tanstack/react-query';
import {articleService} from '../services/article.service';
import {
  ArticlesQueryRequestParams,
  FeedQueryRequestParams,
  GetCommentsByArticleRequestParams,
  GetUniqueArticleRequestParams,
} from '../types/articleTypes';
import {QUERY_KEYS} from './constants/queryKeys';

export const articleQueryOptions = {
  getArticle: ({slug, token}: GetUniqueArticleRequestParams) => ({
    queryKey: QUERY_KEYS.article.detail(slug, token),
    queryFn: () => articleService.getUniqueArticle({slug, token}),
  }),

  getComments: ({slug, token}: GetCommentsByArticleRequestParams) => ({
    queryKey: QUERY_KEYS.article.comments(slug, token),
    queryFn: () => articleService.getComments({slug, token}),
  }),

  getArticles: ({
    offset,
    limit,
    tag,
    author,
    favorited,
    token,
  }: ArticlesQueryRequestParams) => ({
    queryKey: QUERY_KEYS.articles.all({
      offset,
      limit,
      tag,
      author,
      favorited,
      token,
    }),

    queryFn: () =>
      articleService.getArticles({
        offset,
        limit,
        tag,
        author,
        favorited,
        token,
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  }),

  getFeed: ({offset, limit, token}: FeedQueryRequestParams) => ({
    queryKey: QUERY_KEYS.articles.feed({offset, limit, token}),
    queryFn: () => articleService.getFeed({offset, limit, token}),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  }),
};
