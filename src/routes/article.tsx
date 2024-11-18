import {QueryClient, useSuspenseQuery} from '@tanstack/react-query';
import {useBoundStore} from '../store';
import NetworkError from '../errors/NetworkError';
import {articleQueryOptions} from '../queryOptions/articleQueryOptions';
import {
  Form,
  Link,
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from 'react-router-dom';
import {checkSameUser} from '../util/checkSameUser';
import TagList from '../components/TagList';
import Comments from '../components/Comments';
import {QUERY_KEYS} from '../queryOptions/constants/queryKeys';
import useFollowMutations from '../hooks/useFollowMutations';
import {profileQueryOptions} from '../queryOptions/profileQueryOptions';
import {useArticleFavoriteMutations} from '../hooks/useArticleFavoriteMutations';

export const loader =
  (queryClient: QueryClient) =>
  async ({params}: LoaderFunctionArgs) => {
    const {slug} = params;
    const token = useBoundStore.getState().token;
    let articleResponse = null;
    if (!slug) {
      return new NetworkError({code: 400, message: 'slug가 필요합니다.'});
    }

    try {
      if (token) {
        articleResponse = await queryClient.ensureQueryData(
          articleQueryOptions.getArticle({slug, token}),
        );
        await queryClient.ensureQueryData(
          profileQueryOptions.getProfile({
            username: articleResponse.article.author.username,
            token,
          }),
        );
      } else {
        await queryClient.ensureQueryData(
          articleQueryOptions.getArticle({slug}),
        );
      }

      return {token, slug};
    } catch (error) {
      if (NetworkError.isNetworkError(error)) {
        return error;
      }
      throw error;
    }
  };

interface ArticlePageProps {}

const ArticlePage = ({}: ArticlePageProps) => {
  const loaderData = useLoaderData() as {
    token: string | null;
    slug: string;
  };

  const articleQuery = useSuspenseQuery(
    articleQueryOptions.getArticle({
      slug: loaderData.slug,
      token: loaderData.token ?? undefined,
    }),
  );

  const loggedInUser = useBoundStore((state) => state.user);
  const navigate = useNavigate();

  const {article} = articleQuery.data;

  const profileQuery = useSuspenseQuery({
    ...profileQueryOptions.getProfile({
      username: article.author.username,
      token: loaderData.token ?? undefined,
    }),
  });

  const {data: profileData} = profileQuery;

  const followMutations = loaderData.token
    ? useFollowMutations({
        queryKey: QUERY_KEYS.profile.getProfile({
          username: article.author.username,
          token: loaderData.token,
        }),
        token: loaderData.token,
        username: article.author.username,
      })
    : null;

  const favoriteMutations = loaderData.token
    ? useArticleFavoriteMutations({
        queryKey: QUERY_KEYS.article.detail(article.slug, loaderData.token),
        token: loaderData.token,
        slug: article.slug,
      })
    : null;

  const handleFollow = () => {
    if (!followMutations) {
      const confirm = window.confirm(
        '로그인이 필요합니다 로그인 하시겠습니까?',
      );
      if (confirm) {
        return navigate('/login');
      }
      return;
    }
    followMutations.followMutation.mutate();
  };

  const handleUnfollow = () => {
    if (!followMutations) {
      const confirm = window.confirm(
        '로그인이 필요합니다 로그인 하시겠습니까?',
      );
      if (confirm) {
        return navigate('/login');
      }
      return;
    }
    followMutations.unfollowMutation.mutate();
  };

  const handleFavorite = () => {
    if (!favoriteMutations) {
      const confirm = window.confirm(
        '로그인이 필요합니다 로그인 하시겠습니까?',
      );
      if (confirm) {
        return navigate('/login');
      }
      return;
    }
    favoriteMutations.favoriteArticle.mutate();
  };

  const handleUnfavorite = () => {
    if (!favoriteMutations) {
      const confirm = window.confirm(
        '로그인이 필요합니다 로그인 하시겠습니까?',
      );
      if (confirm) {
        return navigate('/login');
      }
      return;
    }
    favoriteMutations.unfavoriteArticle.mutate();
  };

  let isSameUser = false;

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
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={article.favorited ? handleUnfavorite : handleFavorite}
              disabled={favoriteMutations?.isPending || false}
            >
              <i className="ion-heart"></i>
              &nbsp; {article.favorited
                ? 'Unfavorite Post'
                : 'Favorite Post'}{' '}
              <span className="counter">{article.favoritesCount}</span>
            </button>
            &nbsp;&nbsp;
            {isSameUser ? null : (
              <>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={followMutations?.isPending || false}
                  onClick={
                    profileData?.profile.following
                      ? handleUnfollow
                      : handleFollow
                  }
                >
                  <i className="ion-plus-round"></i>
                  &nbsp;{' '}
                  {profileData?.profile.following ? 'Unfollow' : 'Follow'}{' '}
                  {article.author.username}
                </button>
                &nbsp;&nbsp;
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

        <Comments slug={article.slug} />
      </div>
    </div>
  );
};

export default ArticlePage;
