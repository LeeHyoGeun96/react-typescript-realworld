import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {articleQueryOptions} from '../queryOptions/articleQueryOptions';
import {useBoundStore} from '../store';
import {articleService} from '../services/article.service';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import {Comment, GetCommentsByArticleResponse} from '../types/articleTypes';

const Comments = ({slug}: {slug: string}) => {
  const [commentText, setCommentText] = useState('');
  const {token} = useBoundStore((state) => state);
  const {data, isPending, error} = useQuery(
    articleQueryOptions.getComments({slug, token: token ?? undefined}),
  );
  const queryClient = useQueryClient();
  const loggedInUser = useBoundStore((state) => state.user);

  const addCommentMutation = token
    ? useMutation({
        mutationFn: () =>
          articleService.addComment({
            slug,
            comment: commentText,
            token,
          }),

        onMutate: async () => {
          await queryClient.cancelQueries({
            queryKey: ['comments', slug, token],
          });

          const newComment = {
            id: Date.now(), // 임시 ID
            body: commentText,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: {
              username: useBoundStore.getState().user?.username ?? '',
              image: useBoundStore.getState().user?.image ?? '',
            },
          };

          const previousComments = queryClient.getQueryData([
            'comments',
            slug,
            token,
          ]);

          queryClient.setQueryData(
            ['comments', slug, token],
            (old: GetCommentsByArticleResponse) => ({
              comments: [...(old?.comments ?? []), newComment],
            }),
          );

          return {previousComments};
        },
        onError: (_, __, context) => {
          // 에러 발생시 이전 상태로 롤백
          queryClient.setQueryData(
            ['comments', slug, token],
            context?.previousComments,
          );

          window.alert('댓글 작성에 실패했습니다.');
        },

        onSuccess: () => {
          setCommentText('');
        },
        onSettled: () => {
          // 서버 데이터와 동기화
          queryClient.invalidateQueries({queryKey: ['comments']});
        },
      })
    : null;

  const deleteCommentMutation = token
    ? useMutation({
        mutationFn: (id: number) =>
          articleService.deleteComment({slug, id, token}),
        onMutate: async (commentId) => {
          await queryClient.cancelQueries({
            queryKey: ['comments', slug, token],
          });

          const previousComments = queryClient.getQueryData([
            'comments',
            slug,
            token,
          ]);

          queryClient.setQueryData(
            ['comments', slug, token],
            (old: GetCommentsByArticleResponse) => ({
              comments: (old?.comments ?? []).filter(
                (comment: Comment) => comment.id !== commentId,
              ),
            }),
          );

          return {previousComments};
        },
        onError: (_, __, context) => {
          queryClient.setQueryData(
            ['comments', slug, token],
            context?.previousComments,
          );
          window.alert('댓글 삭제에 실패했습니다.');
        },
        onSettled: () => {
          queryClient.invalidateQueries({queryKey: ['comments']});
        },
      })
    : null;

  const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (commentText.trim() === '' || !addCommentMutation) {
      return;
    }
    addCommentMutation.mutate();
  };

  const handleCommentTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setCommentText(e.target.value);
  };

  const handleDeleteComment = (
    e: React.FormEvent<HTMLFormElement>,
    id: number,
  ) => {
    e.preventDefault();
    if (!deleteCommentMutation) {
      return;
    }
    deleteCommentMutation.mutate(id);
  };

  if (isPending) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>Error loading comments</div>;
  }

  if (!data) {
    return null;
  }

  const comments = data.comments;

  return (
    <div className="row">
      <div className="col-xs-12 col-md-8 offset-md-2">
        <form className="card comment-form" onSubmit={handleAddComment}>
          <div className="card-block">
            <textarea
              className="form-control"
              placeholder="Write a comment..."
              value={commentText}
              onChange={handleCommentTextChange}
              rows={3}
            ></textarea>
          </div>
          <div className="card-footer">
            <button
              className="btn btn-sm btn-primary"
              disabled={
                addCommentMutation?.isPending || commentText.trim().length === 0
              }
              type="submit"
            >
              {addCommentMutation?.isPending ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>

        {comments.map((comment) => (
          <div key={comment.id} className="card">
            <div className="card-block">
              <p className="card-text">{comment.body}</p>
            </div>
            <div className="card-footer">
              <Link
                to={`/profile/${comment.author.username}`}
                className="comment-author"
              >
                <img
                  src={comment.author.image ?? ''}
                  className="comment-author-img"
                />
              </Link>
              &nbsp;
              <Link
                to={`/profile/${comment.author.username}`}
                className="comment-author"
              >
                {comment.author.username}
              </Link>
              <span className="date-posted">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
              {loggedInUser?.username === comment.author.username ? (
                <form onSubmit={(e) => handleDeleteComment(e, comment.id)}>
                  <button
                    className="mod-options"
                    type="submit"
                    disabled={deleteCommentMutation?.isPending}
                  >
                    <i className="ion-trash-a"></i>
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
