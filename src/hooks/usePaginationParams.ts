import {useSearchParams} from 'react-router-dom';

interface PaginationState {
  tag?: string;
  author?: string;
  tab: 'personal' | 'global';
  offset: number;
  limit: number;
}

export const usePaginationParams = (itemsPerPage: number = 10) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updatePaginationState = (updates: Partial<PaginationState>) => {
    const newParams = new URLSearchParams(searchParams);

    if (updates.offset !== undefined) {
      // 페이지가 0 이상인지 확인
      const validPage = Math.max(0, updates.offset);
      newParams.set('offset', (validPage * itemsPerPage).toString());
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
  const currentState: PaginationState = {
    tab: (searchParams.get('tab') as 'personal' | 'global') || 'global',
    tag: searchParams.get('tag') || undefined,
    author: searchParams.get('author') || undefined,
    offset: Math.max(0, Number(searchParams.get('offset') || 0)),
    limit: itemsPerPage,
  };

  return {
    currentState,
    setOffset: (offset: number) => updatePaginationState({offset}),
    setFilter: (filter: Omit<PaginationState, 'offset'>) =>
      updatePaginationState({...filter, offset: 0}),
  };
};
