import {articleService} from '../services/article.service';
import {
  GetCommentsByArticleRequestParams,
  GetUniqueArticleRequestParams,
} from '../types/articleTypes';

export const articleQueryOptions = {
  getArticle: ({slug, token}: GetUniqueArticleRequestParams) => ({
    queryKey: ['article', slug, token],
    queryFn: () => articleService.getUniqueArticle({slug, token}),
  }),

  getComments: ({slug, token}: GetCommentsByArticleRequestParams) => ({
    queryKey: ['comments', slug, token],
    queryFn: () => articleService.getComments({slug, token}),
  }),
};
