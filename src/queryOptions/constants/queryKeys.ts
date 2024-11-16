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
        'article',
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
        'article',
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
      token ? ['article', slug, token] : (['article', slug] as const),
    comments: (slug: string, token?: string) =>
      token ? ['comments', slug, token] : (['comments', slug] as const),
  },
} as const;
