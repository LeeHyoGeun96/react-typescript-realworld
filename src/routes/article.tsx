import {QueryClient} from '@tanstack/react-query';
import {useBoundStore} from '../store';
import NetworkError from '../errors/NetworkError';
import {articleQueryOptions} from '../queryOptions/articleQueryOptions';
import {Form, Link, LoaderFunctionArgs, useLoaderData} from 'react-router-dom';
import {ErrorDisplay} from '../components/ErrorDisplay';
import {GetUniqueArticleResponse} from '../types/articleTypes';
import {checkSameUser} from '../util/checkSameUser';
import TagList from '../components/TagList';

export const loader =
  (queryClient: QueryClient) =>
  async ({params}: LoaderFunctionArgs) => {
    const {slug} = params;
    const token = useBoundStore.getState().token;
    let response = null;

    if (!slug) {
      return new NetworkError({code: 400, message: 'slug가 필요합니다.'});
    }

    try {
      if (token) {
        response = await queryClient.fetchQuery(
          articleQueryOptions.getArticle({slug, token}),
        );
      } else {
        response = await queryClient.fetchQuery(
          articleQueryOptions.getArticle({slug}),
        );
      }

      return response;
    } catch (error) {
      if (NetworkError.isNetworkError(error)) {
        return error;
      }
      throw error;
    }
  };

interface ArticlePageProps {}

const ArticlePage = ({}: ArticlePageProps) => {
  const loaderData = useLoaderData() as NetworkError | GetUniqueArticleResponse;
  const loggedInUser = useBoundStore((state) => state.user);
  let isSameUser = false;

  if (NetworkError.isNetworkError(loaderData)) {
    return <ErrorDisplay errors={loaderData} />;
  }

  const {article} = loaderData;

  if (loggedInUser) {
    isSameUser = checkSameUser({
      loggedInUser: loggedInUser,
      responseUser: article,
    });
  }

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>

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
            {isSameUser ? null : (
              <>
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="ion-plus-round"></i>
                  &nbsp; Follow {article.author.username}
                </button>
                &nbsp;&nbsp;
                <button className="btn btn-sm btn-outline-primary">
                  <i className="ion-heart"></i>
                  &nbsp; Favorite Post <span className="counter">(29)</span>
                </button>
              </>
            )}
            {isSameUser ? (
              <>
                <Link
                  to={`/editor/${article.slug}`}
                  className="btn btn-sm btn-outline-secondary"
                >
                  <i className="ion-edit"></i> Edit Article
                </Link>
                &nbsp;&nbsp;
                <Form
                  method="post"
                  action={`/deleteArticle/${article.slug}`}
                  style={{display: 'inline-block'}}
                >
                  <button
                    className="btn btn-sm btn-outline-danger"
                    type="submit"
                  >
                    <i className="ion-trash-a"></i> Delete Article
                  </button>
                </Form>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>{article.body}</p>
            <TagList tags={article.tagList} />
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <form className="card comment-form">
              <div className="card-block">
                <textarea
                  className="form-control"
                  placeholder="Write a comment..."
                  rows={3}
                ></textarea>
              </div>
              <div className="card-footer">
                <img
                  src="http://i.imgur.com/Qr71crq.jpg"
                  className="comment-author-img"
                />
                <button className="btn btn-sm btn-primary">Post Comment</button>
              </div>
            </form>

            <div className="card">
              <div className="card-block">
                <p className="card-text">
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
              <div className="card-footer">
                <a href="/profile/author" className="comment-author">
                  <img
                    src="http://i.imgur.com/Qr71crq.jpg"
                    className="comment-author-img"
                  />
                </a>
                &nbsp;
                <a href="/profile/jacob-schmidt" className="comment-author">
                  Jacob Schmidt
                </a>
                <span className="date-posted">Dec 29th</span>
              </div>
            </div>

            <div className="card">
              <div className="card-block">
                <p className="card-text">
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
              <div className="card-footer">
                <a href="/profile/author" className="comment-author">
                  <img
                    src="http://i.imgur.com/Qr71crq.jpg"
                    className="comment-author-img"
                  />
                </a>
                &nbsp;
                <a href="/profile/jacob-schmidt" className="comment-author">
                  Jacob Schmidt
                </a>
                <span className="date-posted">Dec 29th</span>
                <span className="mod-options">
                  <i className="ion-trash-a"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
