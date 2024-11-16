import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  Link,
  NavLink,
  useMatch,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {profileQueryOptions} from '../queryOptions/profileQueryOptions';
import {useBoundStore} from '../store';

import {profileService} from '../services/profile.service';
import {ProfileType} from '../types/global';
import NetworkError from '../errors/NetworkError';
import ReactPaginate from 'react-paginate';
import {articleQueryOptions} from '../queryOptions/articleQueryOptions';
import {usePaginationParams} from '../hooks/usePaginationParams';
import ArticleList from '../components/ArticleList';
import {useFavoriteMutations} from '../hooks/useFavoriteMutations';
import {QUERY_KEYS} from '../queryOptions/constants/queryKeys';

interface ProfilePageProps {}

const ITEMS_PER_PAGE = 10;

const ProfilePage = ({}: ProfilePageProps) => {
  const token = useBoundStore((state) => state.token);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {username} = useParams();
  const favoritesMatch = useMatch(`profile/${username}/favorites`);
  const {currentState, setPage} = usePaginationParams(ITEMS_PER_PAGE);

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
    ? useFavoriteMutations({
        queryKey: QUERY_KEYS.articles.all({
          ...currentState,
          token: token ?? undefined,
          author: favoritesMatch ? undefined : username,
          favorited: favoritesMatch ? username : undefined,
        }),
        token,
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

  const handlePageClick = (event: {selected: number}) => {
    setPage(event.selected);
  };

  const {articles, articlesCount} = articlesQuery.data || {
    articles: [],
    articlesCount: 0,
  };

  const pageCount = Math.ceil(articlesCount / ITEMS_PER_PAGE);
  const currentPage = Math.floor(currentState.offset / ITEMS_PER_PAGE);

  const loggedInUser = useBoundStore((state) => state.user);
  const isSameUser = loggedInUser?.username === username;

  const {mutate: followUser} = useMutation({
    mutationFn: () =>
      profileService.followUser({
        username: username!,
        token: token!,
      }),
    onMutate: async () => {
      const previousProfile = queryClient.getQueryData(['profile', username]);

      queryClient.setQueryData(['profile', username], (old: ProfileType) => ({
        ...old,
        isFollowing: true,
      }));

      return {previousProfile};
    },
    onError: (_, __, context) => {
      // 에러 발생시 이전 데이터로 롤백
      if (context?.previousProfile) {
        queryClient.setQueryData(
          ['profile', username],
          context.previousProfile,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['profile', username]});
    },
  });

  const {mutate: unfollowUser} = useMutation({
    mutationFn: () =>
      profileService.unfollowUser({
        username: username!,
        token: token!,
      }),
    onMutate: async () => {
      const previousProfile = queryClient.getQueryData(['profile', username]);

      queryClient.setQueryData(['profile', username], (old: ProfileType) => ({
        ...old,
        isFollowing: false,
      }));

      return {previousProfile};
    },
    onError: (_, __, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(
          ['profile', username],
          context.previousProfile,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['profile', username]});
    },
  });

  if (!username || !token) {
    throw new NetworkError({code: 401, message: 'Unauthorized'});
  }

  const handleFollowUser = () => {
    followUser();
  };

  const handleUnfollowUser = () => {
    unfollowUser();
  };

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img
                src={uesrData?.profile.image ?? ''}
                className="user-img"
                alt={`${uesrData?.profile.username ?? ''} profile`}
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
