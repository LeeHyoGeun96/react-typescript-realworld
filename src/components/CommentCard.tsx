import {Link} from 'react-router-dom';
import {Comment} from '../types/articleTypes';

interface CommentCardProps {
  comment: Comment;
  onDelete?: (e: React.MouseEvent) => void;
  isDeletePending?: boolean;
  canModify?: boolean;
}

const CommentCard = ({
  comment,
  onDelete,
  isDeletePending,
  canModify,
}: CommentCardProps) => {
  return (
    <div className="card">
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
            alt={comment.author.username}
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
        {canModify && (
          <div className="mod-options">
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={onDelete}
              disabled={isDeletePending}
            >
              <i className="ion-trash-a"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
