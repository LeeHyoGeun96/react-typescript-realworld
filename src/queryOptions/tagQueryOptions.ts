import {queryOptions} from '@tanstack/react-query';
import {GetTagsRequestParams} from '../types/tagTypes';
import {tagService} from '../services/tag.service';
import {setReactQueryTime} from '../util/setReactQueryTime';

export const tagQueryOptions = {
  getTags: ({token}: GetTagsRequestParams) =>
    queryOptions({
      queryKey: token ? ['tags', token] : ['tags'],
      queryFn: () => tagService.getTags({token}),
      staleTime: setReactQueryTime('30/0'),
      gcTime: setReactQueryTime('60/0'),
    }),
};
