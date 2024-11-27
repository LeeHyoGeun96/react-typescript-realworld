import {useMutation, useQueryClient} from '@tanstack/react-query';
import {articleService} from '../services/article.service';
import {GetCommentsByArticleResponse, Comment} from '../types/articleTypes';
import {useUserStore} from '../store/userStore';
import {QUERY_KEYS} from '../queryOptions/constants/queryKeys';

interface UseCommentMutationsParams {
  token: string;
  slug: string;
}

const useCommentMutations = ({token, slug}: UseCommentMutationsParams) => {
  const queryClient = useQueryClient();
  const queryKey = QUERY_KEYS.article.comments(slug, token);
  const {user: loggedInUser} = useUserStore();

  const addCommentMutation = useMutation({
    mutationFn: (commentText: string) =>
      articleService.addComment({
        slug,
        comment: commentText,
        token,
      }),
    onMutate: async (commentText) => {
      await queryClient.cancelQueries({queryKey});

      const newComment = {
        id: Date.now(),
        body: commentText,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          username: loggedInUser?.username ?? '',
          image: loggedInUser?.image ?? '',
        },
      };

      const previousComments = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(
        queryKey,
        (old: GetCommentsByArticleResponse) => ({
          comments: [...(old?.comments ?? []), newComment],
        }),
      );

      return {previousComments};
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context?.previousComments);
      window.alert('댓글 작성에 실패했습니다.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['articles']});
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (id: number) => articleService.deleteComment({slug, id, token}),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({queryKey});

      const previousComments = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(
        queryKey,
        (old: GetCommentsByArticleResponse) => ({
          comments: (old?.comments ?? []).filter(
            (comment: Comment) => comment.id !== commentId,
          ),
        }),
      );

      return {previousComments};
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context?.previousComments);
      window.alert('댓글 삭제에 실패했습니다.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['articles']});
    },
  });

  return {
    addCommentMutation,
    deleteCommentMutation,
    isPending: addCommentMutation.isPending || deleteCommentMutation.isPending,
  };
};

export default useCommentMutations;
