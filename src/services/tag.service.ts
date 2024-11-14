import {GetTagsRequestParams, GetTagsResponse} from '../types/tagTypes';
import {apiClient} from '../util/api';

export const tagService = {
  getTags: ({token}: GetTagsRequestParams) => {
    const headers = token ? {Authorization: `Bearer ${token}`} : {};
    return apiClient.get<GetTagsResponse, void>('/tags', {headers});
  },
};
