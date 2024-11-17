import {useMutation, useQueryClient} from '@tanstack/react-query';
import {QUERY_KEYS} from '../queryOptions/constants/queryKeys';
import {profileService} from '../services/profile.service';
import {ProfileType} from '../types/global';

type ProfileQueryKey = ReturnType<typeof QUERY_KEYS.profile.getProfile>;

interface UseFollowMutationsParams {
  token: string;
  queryKey: ProfileQueryKey;
  username: string;
}

const useFollowMutations = ({
  token,
  queryKey,
  username,
}: UseFollowMutationsParams) => {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: () =>
      profileService.followUser({
        username: username!,
        token: token!,
      }),
    onMutate: async () => {
      const previousProfile = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: ProfileType) => ({
        ...old,
        isFollowing: true,
      }));

      return {previousProfile};
    },
    onError: (_, __, context) => {
      // 에러 발생시 이전 데이터로 롤백
      if (context?.previousProfile) {
        queryClient.setQueryData(queryKey, context.previousProfile);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['profile']});
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () =>
      profileService.unfollowUser({
        username: username!,
        token: token!,
      }),
    onMutate: async () => {
      const previousProfile = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: ProfileType) => ({
        ...old,
        isFollowing: false,
      }));

      return {previousProfile};
    },
    onError: (_, __, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(queryKey, context.previousProfile);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['profile']});
    },
  });

  return {
    followMutation,
    unfollowMutation,
    isPending: followMutation.isPending || unfollowMutation.isPending,
  };
};

export default useFollowMutations;
