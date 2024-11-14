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

// 요청 파라미터 타입
export interface GetCommentsByArticleRequestParams {
  slug: string;
  token?: string;
}

// 댓글 작성자 타입
export interface CommentAuthor {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
}

// 댓글 타입
export interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: CommentAuthor;
}

// API 응답 타입
export interface GetCommentsByArticleResponse {
  comments: Comment[];
}

// 요청 타입
export interface AddCommentDTO {
  comment: {
    body: string;
  };
}

// 응답 타입
export interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  };
}

export interface AddCommentResponse {
  comment: Comment;
}

// 서비스 함수 파라미터 타입
export interface AddCommentRequestParams {
  comment: string;
  slug: string;
  token: string;
}

export type DeleteCommentRequestParams = {
  slug: string;
  id: number;
  token: string;
};

export type ArticlesQueryRequestParams = {
  token?: string;
  tag?: string;
  author?: string;
  favorited?: string;
  offset: number;
  limit: number;
};

export interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

export interface FeedQueryRequestParams {
  offset: number;
  limit: number;
  token: string;
}

export interface FeedQueryResponse {
  articles: Article[];
  articlesCount: number;
}
