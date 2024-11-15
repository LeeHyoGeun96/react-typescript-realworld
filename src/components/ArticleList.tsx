import {Link} from 'react-router-dom';
import {Article} from '../types/articleTypes';

interface ArticleListProps {
  articles: Article[];
}

const ArticleList = ({articles}: ArticleListProps) => {
  if (articles.length === 0) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <div className="article-preview">
      {articles.map((article) => (
        <>
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
            <button className="btn btn-outline-primary btn-sm pull-xs-right">
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
        </>
      ))}
    </div>
  );
};

export default ArticleList;
