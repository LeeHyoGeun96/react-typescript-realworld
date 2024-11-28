import {useMutation, useQueryClient} from '@tanstack/react-query';
import {articleService} from '../services/article.service';
import {GetUniqueArticleResponse} from '../types/articleTypes';
import {QUERY_KEYS} from '../queryOptions/constants/queryKeys';

type ArticleQueryKey = ReturnType<typeof QUERY_KEYS.article.detail>;

interface useArticleFavoriteMutationsProps {
  token: string;
  queryKey: ArticleQueryKey;
  slug: string;
}

export const useArticleFavoriteMutations = ({
  token,
  queryKey,
  slug,
}: useArticleFavoriteMutationsProps) => {
  const queryClient = useQueryClient();

  const favoriteArticle = useMutation({
    mutationFn: () => articleService.favoriteArticle({slug, token}),
    onMutate: async () => {
      const previousData =
        queryClient.getQueryData<GetUniqueArticleResponse>(queryKey);

      queryClient.setQueryData<GetUniqueArticleResponse>(queryKey, (old) => {
        if (!old) return previousData;

        return {
          ...old,
          article: {
            ...old.article,
            favorited: true,
            favoritesCount: old.article.favoritesCount + 1,
          },
        };
      });

      return {previousData};
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['articles', 'article']});
    },
  });

  const unfavoriteArticle = useMutation({
    mutationFn: () => articleService.unfavoriteArticle({slug, token}),
    onMutate: async () => {
      const previousData =
        queryClient.getQueryData<GetUniqueArticleResponse>(queryKey);

      queryClient.setQueryData<GetUniqueArticleResponse>(queryKey, (old) => {
        if (!old) return previousData;

        return {
          ...old,
          article: {
            ...old.article,
            favorited: false,
            favoritesCount: old.article.favoritesCount - 1,
          },
        };
      });

      return {previousData};
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['articles', 'article']});
    },
  });

  return {
    favoriteArticle,
    unfavoriteArticle,
    isPending: favoriteArticle.isPending || unfavoriteArticle.isPending,
  };
};
