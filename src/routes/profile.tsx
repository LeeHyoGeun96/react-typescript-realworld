import {useSuspenseQuery} from '@tanstack/react-query';
import {
  Link,
  NavLink,
  useMatch,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {profileQueryOptions} from '../queryOptions/profileQueryOptions';
import {useBoundStore} from '../store';
import NetworkError from '../errors/NetworkError';
import ReactPaginate from 'react-paginate';
import {articleQueryOptions} from '../queryOptions/articleQueryOptions';
import {usePaginationParams} from '../hooks/usePaginationParams';
import ArticleList from '../components/ArticleList';
import {useArticlesFavoriteMutations} from '../hooks/useArticlesFavoriteMutations';
import {QUERY_KEYS} from '../queryOptions/constants/queryKeys';
import useFollowMutations from '../hooks/useFollowMutations';
import Avatar from '../components/Avatar';

interface ProfilePageProps {}

const ITEMS_PER_PAGE = 10;

const ProfilePage = ({}: ProfilePageProps) => {
  const token = useBoundStore((state) => state.token);
  const navigate = useNavigate();

  const {username} = useParams();
  const favoritesMatch = useMatch(`profile/${username}/favorites`);
  const {currentState, setOffset} = usePaginationParams(ITEMS_PER_PAGE);

  const {data: uesrData} = useSuspenseQuery({
    ...profileQueryOptions.getProfile({
      username: username!,
      token: token ?? undefined,
    }),
  });

  const articlesQuery = useSuspenseQuery({
    ...articleQueryOptions.getArticles({
      ...currentState,
      token: token ?? undefined,
      author: !!favoritesMatch ? undefined : username,
      favorited: !!favoritesMatch ? username : undefined,
    }),
  });

  const favoriteMutations = token
    ? useArticlesFavoriteMutations({
        queryKey: QUERY_KEYS.articles.all({
          ...currentState,
          token: token ?? undefined,
          author: favoritesMatch ? undefined : username,
          favorited: favoritesMatch ? username : undefined,
        }),
        token,
      })
    : null;

  const followMutations =
    token && username
      ? useFollowMutations({
          queryKey: QUERY_KEYS.profile.getProfile({
            username,
            token,
          }),
          token,
          username,
        })
      : null;

  const handleFavoriteArticle = (slug: string) => {
    if (!favoriteMutations) {
      const isConfirmed = window.confirm(
        '로그인이 필요합니다. \n 로그인 하러 가시겠습니까?',
      );
      if (!isConfirmed) return;
      return navigate('/login');
    }
    favoriteMutations.favoriteArticle.mutate(slug);
  };

  const handleUnfavoriteArticle = (slug: string) => {
    if (!favoriteMutations) {
      const isConfirmed = window.confirm(
        '로그인이 필요합니다. \n 로그인 하러 가시겠습니까?',
      );
      if (!isConfirmed) return;
      return navigate('/login');
    }
    favoriteMutations.unfavoriteArticle.mutate(slug);
  };

  const handleFollowUser = () => {
    if (!followMutations) {
      const isConfirmed = window.confirm(
        '로그인이 필요합니다. \n 로그인 하러 가시겠습니까?',
      );
      if (!isConfirmed) return;
      return navigate('/login');
    }
    followMutations.followMutation.mutate();
  };

  const handleUnfollowUser = () => {
    if (!followMutations) {
      const isConfirmed = window.confirm(
        '로그인이 필요합니다. \n 로그인 하러 가시겠습니까?',
      );
      if (!isConfirmed) return;
      return navigate('/login');
    }
    followMutations.unfollowMutation.mutate();
  };

  const handlePageClick = (event: {selected: number}) => {
    setOffset(event.selected);
  };

  const {articles, articlesCount} = articlesQuery.data || {
    articles: [],
    articlesCount: 0,
  };

  const pageCount = Math.ceil(articlesCount / ITEMS_PER_PAGE);
  const currentPage = Math.floor(currentState.offset / ITEMS_PER_PAGE);

  const loggedInUser = useBoundStore((state) => state.user);
  const isSameUser = loggedInUser?.username === username;

  if (!username || !token) {
    throw new NetworkError({code: 401, message: 'Unauthorized'});
  }

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <Avatar
                username={uesrData?.profile.username || ''}
                image={uesrData?.profile.image}
                size="lg"
                className="mb-1"
              />
              <h4>{uesrData?.profile.username ?? ''}</h4>
              <p>{uesrData?.profile.bio ?? ''}</p>
              {uesrData?.profile.isCurrentUser ? (
                <Link
                  to="/settings"
                  className="btn btn-sm btn-outline-secondary action-btn"
                >
                  <i className="ion-gear-a"></i>
                  &nbsp; Edit Profile Settings
                </Link>
              ) : (
                <button
                  className="btn btn-sm btn-outline-secondary action-btn"
                  disabled={followMutations?.isPending}
                  onClick={
                    uesrData?.profile.following
                      ? handleUnfollowUser
                      : handleFollowUser
                  }
                >
                  <i className="ion-plus-round"></i>
                  &nbsp; {uesrData?.profile.following
                    ? 'Unfollow'
                    : 'Follow'}{' '}
                  {uesrData?.profile.username}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <NavLink
                    to={`/profile/${username}`}
                    className={({isActive}) =>
                      isActive ? 'nav-link active' : 'nav-link'
                    }
                    end
                  >
                    {isSameUser ? 'My' : `${uesrData?.profile.username}'s`}{' '}
                    Articles
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to={`/profile/${username}/favorites`}
                    className={({isActive}) =>
                      isActive ? 'nav-link active' : 'nav-link'
                    }
                  >
                    {isSameUser ? 'My' : `${uesrData?.profile.username}'s`}{' '}
                    Favorited Articles
                  </NavLink>
                </li>
              </ul>
            </div>

            <ArticleList
              articles={articles}
              favoriteArticle={handleFavoriteArticle}
              unfavoriteArticle={handleUnfavoriteArticle}
              isPending={articlesQuery.isFetching}
            />

            <ReactPaginate
              pageCount={pageCount}
              onPageChange={handlePageClick}
              forcePage={currentPage}
              containerClassName="pagination"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              activeClassName="active"
              previousLabel=""
              previousClassName="disabled"
              nextClassName="disabled"
              nextLabel=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
