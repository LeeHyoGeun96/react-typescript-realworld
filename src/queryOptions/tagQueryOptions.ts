import {queryOptions} from '@tanstack/react-query';
import {GetTagsRequestParams} from '../types/tagTypes';
import {tagService} from '../services/tag.service';

export const tagQueryOptions = {
  getTags: ({token}: GetTagsRequestParams) =>
    queryOptions({
      queryKey: token ? ['tags', token] : ['tags'],
      queryFn: () => tagService.getTags({token}),
    }),
};
