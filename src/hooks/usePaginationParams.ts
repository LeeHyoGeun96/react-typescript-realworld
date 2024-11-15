import {useSearchParams} from 'react-router-dom';

interface PaginationState {
  page: number;
  tab?: string;
  tag?: string;
  author?: string;
}

interface PaginationResult extends PaginationState {
  offset: number;
  limit: number;
}

export const usePaginationParams = (itemsPerPage: number = 10) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updatePaginationState = (updates: Partial<PaginationState>) => {
    const newParams = new URLSearchParams(searchParams);

    if (updates.page !== undefined) {
      newParams.set('offset', (updates.page * itemsPerPage).toString());
    }

    ['tab', 'tag', 'author'].forEach((key) => {
      const value = updates[key as keyof PaginationState];
      if (value !== undefined) {
        newParams.set(key, String(value));
      } else if (updates.hasOwnProperty(key)) {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams);
  };

  // 현재 상태는 필요할 때마다 직접 계산
  const currentState: PaginationResult = {
    page: Math.floor(Number(searchParams.get('offset') || 0) / itemsPerPage),
    tab: searchParams.get('tab') || 'global',
    tag: searchParams.get('tag') || undefined,
    author: searchParams.get('author') || undefined,
    offset: Math.floor(Number(searchParams.get('offset') || 0)),
    limit: itemsPerPage,
  };

  return {
    currentState,
    setPage: (page: number) => updatePaginationState({page}),
    setFilter: (filter: Omit<PaginationState, 'page'>) =>
      updatePaginationState({...filter, page: 0}),
  };
};
