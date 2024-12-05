import {keepPreviousData} from '@tanstack/react-query';
import {articleService} from '../services/article.service';
import {
  ArticlesQueryRequestParams,
  FeedQueryRequestParams,
  GetCommentsByArticleRequestParams,
  GetUniqueArticleRequestParams,
} from '../types/articleTypes';
import {QUERY_KEYS} from './constants/queryKeys';
import {setReactQueryTime} from '../util/setReactQueryTime';

export const articleQueryOptions = {
  getArticle: ({slug, token}: GetUniqueArticleRequestParams) => ({
    queryKey: QUERY_KEYS.article.detail(slug, token),
    queryFn: () => articleService.getUniqueArticle({slug, token}),
    staleTime: setReactQueryTime('5/0'),
    gcTime: setReactQueryTime('10/0'),
  }),

  getComments: ({slug, token}: GetCommentsByArticleRequestParams) => ({
    queryKey: QUERY_KEYS.article.comments(slug, token),
    queryFn: () => articleService.getComments({slug, token}),
    staleTime: setReactQueryTime('0/30'),
    gcTime: setReactQueryTime('1/0'),
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
    staleTime: setReactQueryTime('1/0'),
    gcTime: setReactQueryTime('5/0'),
  }),

  getFeed: ({offset, limit, token}: FeedQueryRequestParams) => ({
    queryKey: QUERY_KEYS.articles.feed({offset, limit, token}),
    queryFn: () => articleService.getFeed({offset, limit, token}),
    placeholderData: keepPreviousData,
    staleTime: setReactQueryTime('5/0'),
    gcTime: setReactQueryTime('10/0'),
  }),
};
