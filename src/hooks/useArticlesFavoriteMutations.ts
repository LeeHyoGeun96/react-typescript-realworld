import {useMutation, useQueryClient} from '@tanstack/react-query';
import {articleService} from '../services/article.service';
import {ArticleType} from '../types/articleTypes';
import {QUERY_KEYS} from '../queryOptions/constants/queryKeys';

type ArticlesQueryKey = ReturnType<typeof QUERY_KEYS.articles.all>;
type FeedQueryKey = ReturnType<typeof QUERY_KEYS.articles.feed>;

type ArticleQueryKeyType = ArticlesQueryKey | FeedQueryKey;

interface useArticlesFavoriteMutationsProps {
  token: string;
  queryKey: ArticleQueryKeyType;
}

export const useArticlesFavoriteMutations = ({
  token,
  queryKey,
}: useArticlesFavoriteMutationsProps) => {
  const queryClient = useQueryClient();

  const favoriteArticle = useMutation({
    mutationFn: (slug: string) => articleService.favoriteArticle({slug, token}),
    onMutate: async (slug) => {
      // 이전 쿼리 데이터 캐시
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => ({
        ...old,
        articles: old.articles.map((article: ArticleType) =>
          article.slug === slug
            ? {
                ...article,
                favorited: true,
                favoritesCount: article.favoritesCount + 1,
              }
            : article,
        ),
      }));

      return {previousData};
    },
    onError: (_, __, context) => {
      // 에러시 롤백
      queryClient.setQueryData(queryKey, context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['articles']});
    },
  });

  const unfavoriteArticle = useMutation({
    mutationFn: (slug: string) =>
      articleService.unfavoriteArticle({slug, token}),
    onMutate: async (slug) => {
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => ({
        ...old,
        articles: old.articles.map((article: ArticleType) =>
          article.slug === slug
            ? {
                ...article,
                favorited: false,
                favoritesCount: article.favoritesCount - 1,
              }
            : article,
        ),
      }));

      return {previousData};
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['articles']});
    },
  });

  return {
    favoriteArticle,
    unfavoriteArticle,
    isPending: favoriteArticle.isPending || unfavoriteArticle.isPending,
  };
};
