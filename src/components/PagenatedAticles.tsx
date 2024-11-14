import {useQuery} from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import {
  LoaderFunctionArgs,
  useLoaderData,
  useSearchParams,
} from 'react-router-dom';
import {articleQueryOptions} from '../queryOptions/articleQueryOptions';
import {useBoundStore} from '../store';
import NetworkError from '../errors/NetworkError';
import SelectTag from './SelectTag';
import {tagQueryOptions} from '../queryOptions/tagQueryOptions';
import ArticleList from './ArticleList';
import FeedToggle from './FeedToggle';
import {ArticlesResponse} from '../types/articleTypes';

export const loader = async ({request}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const params = {
    tab: searchParams.get('tab') || 'global',
    offset: Number(searchParams.get('offset')) || 0,
    limit: Number(searchParams.get('limit')) || 10,
    tag: searchParams.get('tag') || undefined,
    author: searchParams.get('author') || undefined,
    token: useBoundStore.getState().token,
  };

  // personal feed인데 token이 없는 경우 처리
  if (params.tab === 'personal' && !params.token) {
    throw new NetworkError({code: 401, message: 'Unauthorized'});
  }

  return params;
};

interface PagenatedAticlesProps {}

const ITEMS_PER_PAGE = 10;

const PagenatedAticles = ({}: PagenatedAticlesProps) => {
  const isLoggedIn = useBoundStore((state) => state.isLoggedIn);
  const params = useLoaderData() as {
    offset: number;
    limit: number;
    tag: string | undefined;
    author: string | undefined;
    tab: string;
    token: string | undefined;
  };
  const [_, setSearchParams] = useSearchParams();

  const getFeedQueryOption =
    'personal' === params.tab && params.token
      ? articleQueryOptions.getFeed({
          offset: params.offset,
          limit: params.limit,
          token: params.token,
        })
      : articleQueryOptions.getArticles(params);

  const getTagsQueryOption = tagQueryOptions.getTags(params);

  const articlesQuery = useQuery<ArticlesResponse, NetworkError>(
    getFeedQueryOption,
  );
  const {articles, articlesCount} = articlesQuery.data || {
    articles: [],
    articlesCount: 0,
  };

  const tagsQuery = useQuery(getTagsQueryOption);
  const tags = tagsQuery.data?.tags || [];

  if (articlesQuery.isLoading) {
    return <div className="article-preview">Loading...</div>;
  }

  if (articlesQuery.isError || tagsQuery.isError) {
    throw articlesQuery.error || tagsQuery.error;
  }

  const isFetching = articlesQuery.isFetching;

  const pageCount = Math.ceil(articlesCount / ITEMS_PER_PAGE);
  const currentPage = Math.floor(params.offset / ITEMS_PER_PAGE);

  const handlePageClick = (event: {selected: number}) => {
    setSearchParams((prev) => ({
      ...Object.fromEntries(prev.entries()),
      offset: (event.selected * ITEMS_PER_PAGE).toString(),
    }));
  };

  const handleTagClick = (tag: string) => {
    setSearchParams((prev) => ({
      ...Object.fromEntries(prev.entries()),
      tab: 'tag',
      tag,
      offset: '0',
    }));
  };

  return (
    <div className="container page">
      <div className="row">
        <div className="col-md-9">
          <FeedToggle params={params} isLoggedIn={isLoggedIn} />

          {isFetching ? (
            <div className="article-preview">Updating...</div>
          ) : null}

          <ArticleList articles={articles} />

          <ReactPaginate
            pageCount={pageCount}
            onPageChange={handlePageClick}
            forcePage={currentPage}
            containerClassName="pagination"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            activeClassName="active"
            previousLabel=""
            previousClassName="previous disabled"
            nextClassName="previous disabled"
            nextLabel=""
          />

          <SelectTag tags={tags} onTagClick={handleTagClick} />
        </div>
      </div>
    </div>
  );
};

export default PagenatedAticles;
