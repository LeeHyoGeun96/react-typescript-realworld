import {useQuery} from '@tanstack/react-query';
import {articleQueryOptions} from '../queryOptions/articleQueryOptions';
import {useBoundStore} from '../store';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import useCommentMutations from '../hooks/useCommentMutations';
import CommentForm from './CommentForm';
import CommentCard from './CommentCard';

const Comments = ({slug}: {slug: string}) => {
  const [commentText, setCommentText] = useState('');
  const {token} = useBoundStore((state) => state);
  const navigate = useNavigate();
  const {data, isPending: isCommentsPending} = useQuery(
    articleQueryOptions.getComments({slug, token: token ?? undefined}),
  );
  const loggedInUser = useBoundStore((state) => state.user);
  const commentMutations = token
    ? useCommentMutations({
        token,
        slug,
      })
    : null;

  const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!commentMutations) {
      const answer = window.confirm('로그인이 필요합니다.');
      if (answer) {
        navigate('/login');
      }
      return;
    }
    if (commentText.trim() === '') {
      return;
    }
    commentMutations.addCommentMutation.mutate(commentText);
    setCommentText('');
  };

  const handleDeleteComment = (id: number) => {
    if (!commentMutations) {
      const answer = window.confirm('로그인이 필요합니다.');
      if (answer) {
        navigate('/login');
      }
      return;
    }
    commentMutations.deleteCommentMutation.mutate(id);
  };

  if (isCommentsPending) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="row">
      <div className="col-xs-12 col-md-8 offset-md-2">
        <CommentForm
          commentText={commentText}
          onCommentChange={(e) => setCommentText(e.target.value)}
          onSubmit={handleAddComment}
          isPending={commentMutations?.addCommentMutation.isPending}
        />

        {data.comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onDelete={() => handleDeleteComment(comment.id)}
            isDeletePending={commentMutations?.isPending}
            canModify={loggedInUser?.username === comment.author.username}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
