export const QUERY_KEYS = {
  articles: {
    root: ['articles'] as const,
    all: (params?: {
      offset: number;
      limit: number;
      tag?: string;
      author?: string;
      favorited?: string;
      token?: string;
    }) => {
      return [
        'articles',

        {
          tab: 'global',
          ...(params?.offset && {offset: params.offset}),
          ...(params?.limit && {limit: params.limit}),
          ...(params?.tag && {tag: params.tag}),
          ...(params?.author && {author: params.author}),
          ...(params?.favorited && {favorited: params.favorited}),
        },
        params?.token,
      ] as const;
    },
    feed: (params: {offset?: number; limit?: number; token?: string}) => {
      return [
        'articles',

        {
          tab: 'personal' as const,
          ...(params?.offset && {offset: params.offset}),
          ...(params?.limit && {limit: params.limit}),
        },
        params.token,
      ] as const;
    },
  },
  article: {
    detail: (slug: string, token?: string) =>
      token
        ? ['articles', 'article', slug, token]
        : (['articles', slug] as const),
    comments: (slug: string, token?: string) =>
      token
        ? ['articles', 'comments', slug, token]
        : (['articles', 'comments', slug] as const),
  },
  profile: {
    root: ['profile'] as const,
    getProfile: ({username, token}: {username: string; token?: string}) =>
      token ? ['profile', username, token] : ['profile', username],
  },
} as const;
