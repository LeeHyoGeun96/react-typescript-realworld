import {useQuery} from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import {articleQueryOptions} from '../queryOptions/articleQueryOptions';
import {useBoundStore} from '../store';
import NetworkError from '../errors/NetworkError';
import SelectTag from './SelectTag';
import {tagQueryOptions} from '../queryOptions/tagQueryOptions';
import ArticleList from './ArticleList';
import FeedToggle from './FeedToggle';
import {ArticlesResponse} from '../types/articleTypes';
import {usePaginationParams} from '../hooks/usePaginationParams';

interface PagenatedAticlesProps {}

const ITEMS_PER_PAGE = 10;

const PagenatedAticles = ({}: PagenatedAticlesProps) => {
  const isLoggedIn = useBoundStore((state) => state.isLoggedIn);
  const token = useBoundStore((state) => state.token);
  const {currentState, setPage, setFilter} =
    usePaginationParams(ITEMS_PER_PAGE);

  const getFeedQueryOption =
    currentState.tab === 'personal' && token
      ? articleQueryOptions.getFeed({
          offset: currentState.offset,
          limit: ITEMS_PER_PAGE,
          token: token,
        })
      : articleQueryOptions.getArticles(currentState);

  const getTagsQueryOption = tagQueryOptions.getTags({
    token: token ?? undefined,
  });

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
  const currentPage = Math.floor(currentState.offset / ITEMS_PER_PAGE);

  const handlePageClick = (event: {selected: number}) => {
    setPage(event.selected);
  };

  const handleTagClick = (tag: string) => {
    setFilter({tag});
  };

  const handleTabChange = (tab: string) => {
    setFilter({tab});
  };

  return (
    <div className="container page">
      <div className="row">
        <div className="col-md-9">
          <FeedToggle
            params={{tab: currentState.tab, tag: currentState.tag}}
            isLoggedIn={isLoggedIn}
            onTabChange={handleTabChange}
            disabled={isFetching}
          />

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
            previousClassName="disabled"
            nextClassName="disabled"
            nextLabel=""
          />

          <SelectTag tags={tags} onTagClick={handleTagClick} />
        </div>
      </div>
    </div>
  );
};

export default PagenatedAticles;
