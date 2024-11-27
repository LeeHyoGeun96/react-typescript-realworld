import {Link} from 'react-router-dom';
import {ArticleType} from '../types/articleTypes';
import Avatar from './Avatar';

interface ArticleListProps {
  articles: ArticleType[];
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
    return (
      <div className="text-center text-gray-500 py-4">데이터가 없습니다.</div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {articles.map((article) => (
        <div key={article.slug} className="py-6">
          <div className="flex items-center mb-4">
            <Link
              to={`/profile/${article.author.username}`}
              className="flex-shrink-0"
            >
              <Avatar
                username={article.author.username || ''}
                image={article.author.image}
                size="md"
                className="mr-1"
              />
            </Link>
            <div className="ml-3 flex-grow">
              <Link
                to={`/profile/${article.author.username}`}
                className="text-brand-primary hover:text-brand-secondary font-medium"
              >
                {article.author.username}
              </Link>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {new Date(article.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              className={`ml-4 px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors
                ${
                  article.favorited
                    ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                    : 'border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white'
                }`}
              type="button"
              disabled={isPending}
              onClick={() =>
                article.favorited
                  ? unfavoriteArticle(article.slug)
                  : favoriteArticle(article.slug)
              }
            >
              <i className="ion-heart"></i>
              <span>{article.favoritesCount}</span>
            </button>
          </div>
          <Link
            to={`/article/${article.slug}`}
            className="block hover:no-underline group"
          >
            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-brand-primary">
              {article.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {article.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-brand-primary text-sm">Read more...</span>
              <ul className="flex flex-wrap gap-2">
                {article.tagList.map((tag) => (
                  <li
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
