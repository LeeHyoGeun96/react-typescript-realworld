import {keepPreviousData} from '@tanstack/react-query';
import {articleService} from '../services/article.service';
import {
  ArticlesQueryRequestParams,
  FeedQueryRequestParams,
  GetCommentsByArticleRequestParams,
  GetUniqueArticleRequestParams,
} from '../types/articleTypes';

export const articleQueryOptions = {
  getArticle: ({slug, token}: GetUniqueArticleRequestParams) => ({
    queryKey: token ? ['article', slug, token] : ['article', slug],
    queryFn: () => articleService.getUniqueArticle({slug, token}),
  }),

  getComments: ({slug, token}: GetCommentsByArticleRequestParams) => ({
    queryKey: token ? ['comments', slug, token] : ['comments', slug],
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
    queryKey: [
      'articles',
      'article',
      {
        tab: 'global' as const,
        ...(offset && {offset}),
        ...(limit && {limit}),
        ...(tag && {tag}),
        ...(author && {author}),
        ...(favorited && {favorited}),
      },
    ],

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
    queryKey: [
      'articles',
      'article',
      {
        tab: 'personal' as const,
        ...(offset && {offset}),
        ...(limit && {limit}),
      },
      token,
    ] as const,
    queryFn: () => articleService.getFeed({offset, limit, token}),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  }),
};
