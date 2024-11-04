import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { profileQueryOptions } from '../queryOptions/profileQueryOptions';
import NetworkError from '../errors/NetworkError';
import { useBoundStore } from '../store';

import { useEffect, useState } from 'react';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { profileService } from '../services/profile.service';
import { ProfileType } from '../types/global';

interface ProfilePageProps {}

const ProfilePage = ({}: ProfilePageProps) => {
  const token = useBoundStore((state) => state.token);
  const queryClient = useQueryClient();
  const [error, setError] = useState<NetworkError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const username = useParams().username;

  const {
    data,
    isFetching: isGetProfileFetching,
    error: getProfileError,
  } = useQuery({
    ...profileQueryOptions.getProfile({
      username: username!,
      token: token ?? undefined,
    }),
    enabled: !!username && !!token,
  });

  const {
    mutate: followUser,
    error: followUserError,
    isPending: isFollowUserPending,
  } = useMutation({
    mutationFn: () =>
      profileService.followUser({
        username: username!,
        token: token!,
      }),
    onMutate: async () => {
      // 이전 쿼리 데이터 백업
      const previousProfile = queryClient.getQueryData(['profile', username]);

      // 낙관적으로 프로필 업데이트
      queryClient.setQueryData(['profile', username], (old: ProfileType) => ({
        ...old,
        isFollowing: true, // 팔로우 상태로 변경
      }));

      // 롤백을 위해 이전 데이터 반환
      return { previousProfile };
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
      // mutation 완료 후 프로필 데이터 갱신
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
    },
  });

  const {
    mutate: unfollowUser,
    error: unfollowUserError,
    isPending: isUnfollowUserPending,
  } = useMutation({
    mutationFn: () =>
      profileService.unfollowUser({
        username: username!,
        token: token!,
      }),
    onMutate: async () => {
      // 이전 쿼리 데이터 백업
      const previousProfile = queryClient.getQueryData(['profile', username]);

      // 낙관적으로 프로필 업데이트
      queryClient.setQueryData(['profile', username], (old: ProfileType) => ({
        ...old,
        isFollowing: false, // 언팔로우 상태로 변경
      }));

      // 롤백을 위해 이전 데이터 반환
      return { previousProfile };
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
      // mutation 완료 후 프로필 데이터 갱신
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
    },
  });

  useEffect(() => {
    setError(getProfileError || followUserError || unfollowUserError);
  }, [getProfileError, followUserError, unfollowUserError]);

  useEffect(() => {
    setIsLoading(
      isGetProfileFetching || isFollowUserPending || isUnfollowUserPending,
    );
  }, [isGetProfileFetching, isFollowUserPending, isUnfollowUserPending]);

  if (!username || !token) {
    return null;
  }

  if (error) {
    return <ErrorDisplay errors={error} />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
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
                src={data?.profile.image ?? ''}
                className="user-img"
                alt={`${data?.profile.username ?? ''} profile`}
              />
              <h4>{data?.profile.username ?? ''}</h4>
              <p>{data?.profile.bio ?? ''}</p>
              {data?.profile.isCurrentUser ? (
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
                    data?.profile.following
                      ? handleUnfollowUser
                      : handleFollowUser
                  }
                >
                  <i className="ion-plus-round"></i>
                  &nbsp; {data?.profile.following ? 'Unfollow' : 'Follow'}{' '}
                  {data?.profile.username}
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
                  <a className="nav-link active" href="">
                    My Articles
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="">
                    Favorited Articles
                  </a>
                </li>
              </ul>
            </div>

            <div className="article-preview">
              <div className="article-meta">
                <a href="/profile/eric-simons">
                  <img src="http://i.imgur.com/Qr71crq.jpg" />
                </a>
                <div className="info">
                  <a href="/profile/eric-simons" className="author">
                    Eric Simons
                  </a>
                  <span className="date">January 20th</span>
                </div>
                <button className="btn btn-outline-primary btn-sm pull-xs-right">
                  <i className="ion-heart"></i> 29
                </button>
              </div>
              <a
                href="/article/how-to-buil-webapps-that-scale"
                className="preview-link"
              >
                <h1>How to build webapps that scale</h1>
                <p>This is the description for the post.</p>
                <span>Read more...</span>
                <ul className="tag-list">
                  <li className="tag-default tag-pill tag-outline">
                    realworld
                  </li>
                  <li className="tag-default tag-pill tag-outline">
                    implementations
                  </li>
                </ul>
              </a>
            </div>

            <div className="article-preview">
              <div className="article-meta">
                <a href="/profile/albert-pai">
                  <img src="http://i.imgur.com/N4VcUeJ.jpg" />
                </a>
                <div className="info">
                  <a href="/profile/albert-pai" className="author">
                    Albert Pai
                  </a>
                  <span className="date">January 20th</span>
                </div>
                <button className="btn btn-outline-primary btn-sm pull-xs-right">
                  <i className="ion-heart"></i> 32
                </button>
              </div>
              <a href="/article/the-song-you" className="preview-link">
                <h1>
                  The song you won't ever stop singing. No matter how hard you
                  try.
                </h1>
                <p>This is the description for the post.</p>
                <span>Read more...</span>
                <ul className="tag-list">
                  <li className="tag-default tag-pill tag-outline">Music</li>
                  <li className="tag-default tag-pill tag-outline">Song</li>
                </ul>
              </a>
            </div>

            <ul className="pagination">
              <li className="page-item active">
                <a className="page-link" href="">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="">
                  2
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
