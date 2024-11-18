import {Link} from 'react-router-dom';
import {Article} from '../types/articleTypes';

interface ArticleListProps {
  articles: Article[];
  favoriteArticle: (slug: string) => void;
  unfavoriteArticle: (slug: string) => void;
  isPending: boolean;
}

const ArticleList = ({
  articles,
  favoriteArticle,
  unfavoriteArticle,
  isPending,
}: ArticleListProps) => {
  if (articles.length === 0) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <div className="article-preview">
      {articles.map((article) => (
        <div key={article.slug}>
          <div className="article-meta">
            <Link to={`/profile/${article.author.username}`}>
              <img src={article.author.image || ''} />
            </Link>
            <div className="info">
              <Link
                to={`/profile/${article.author.username}`}
                className="author"
              >
                {article.author.username}
              </Link>
              <span className="date">
                {new Date(article.createdAt).toLocaleDateString()}
              </span>
            </div>
            <button
              className={`btn btn-sm pull-xs-right ${
                article.favorited ? 'btn-primary' : 'btn-outline-primary'
              }`}
              type="button"
              disabled={isPending}
              onClick={() =>
                article.favorited
                  ? unfavoriteArticle(article.slug)
                  : favoriteArticle(article.slug)
              }
            >
              <i className="ion-heart"></i> {article.favoritesCount}
            </button>
          </div>
          <Link to={`/article/${article.slug}`} className="preview-link">
            <h1>{article.title}</h1>
            <p>{article.description}</p>
            <span>Read more...</span>
            <ul className="tag-list">
              {article.tagList.map((tag) => (
                <li className="tag-default tag-pill tag-outline">{tag}</li>
              ))}
            </ul>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
