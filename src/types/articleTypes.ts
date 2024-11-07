export interface Article {
  title: string;
  slug: string;
  body: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  tagList: string[];
  favoritesCount: number;
  favorited: boolean; // 항상 포함 (미인증시 false)
  author: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean; // 항상 포함 (미인증시 false)
  };
}

export interface AuthenticatedArticle extends Article {
  favorited: boolean;
  author: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  };
}

export interface GetUniqueArticleRequestParams {
  slug: string;
  token?: string;
}

export type GetUniqueArticleDTO = Omit<GetUniqueArticleRequestParams, 'token'>;

export interface GetUniqueArticleResponse {
  article: Article;
}

export interface ArticleFormType {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

export interface CreateArticleRequestParams {
  article: ArticleFormType;
  token: string;
}

export type CreateArticleDTO = Omit<CreateArticleRequestParams, 'token'>;

export interface CreateArticleResponse {
  article: Article;
}

export interface UpdateArticleRequestParams {
  slug: string;
  article: ArticleFormType;
  token: string;
}

export type UpdateArticleDTO = Omit<
  UpdateArticleRequestParams,
  'token' | 'slug'
>;

export interface UpdateArticleResponse {
  article: Article;
}

export interface DeleteArticleRequestParams {
  slug: string;
  token: string;
}
