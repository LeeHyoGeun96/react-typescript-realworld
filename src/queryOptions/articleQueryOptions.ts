import {articleService} from '../services/article.service';
import {GetUniqueArticleRequestParams} from '../types/articleTypes';

export const articleQueryOptions = {
  getArticle: ({slug, token}: GetUniqueArticleRequestParams) => ({
    queryKey: ['article', slug, token],
    queryFn: () => articleService.getUniqueArticle({slug, token}),
  }),
};
