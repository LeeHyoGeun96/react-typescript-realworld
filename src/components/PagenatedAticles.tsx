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
import {useFavoriteMutations} from '../hooks/useFavoriteMutations';
import {QUERY_KEYS} from '../queryOptions/constants/queryKeys';
import {useNavigate} from 'react-router-dom';

interface PagenatedAticlesProps {}

const ITEMS_PER_PAGE = 10;

const PagenatedAticles = ({}: PagenatedAticlesProps) => {
  const navigate = useNavigate();
  const isLoggedIn = useBoundStore((state) => state.isLoggedIn);
  const token = useBoundStore((state) => state.token);
  const {currentState, setPage, setFilter} =
    usePaginationParams(ITEMS_PER_PAGE);

  const getFeedQueryOption =
    currentState.tab === 'personal' && token
      ? articleQueryOptions.getFeed({
          ...currentState,
          token: token,
        })
      : articleQueryOptions.getArticles({
          ...currentState,
          token: token ?? undefined,
        });

  const getTagsQueryOption = tagQueryOptions.getTags({
    token: token ?? undefined,
  });

  const articlesQuery = useQuery<ArticlesResponse, NetworkError>(
    getFeedQueryOption,
  );

  const favoriteMutations = token
    ? useFavoriteMutations({
        queryKey:
          currentState.tab === 'personal' && token
            ? QUERY_KEYS.articles.feed({
                ...currentState,
                token,
              })
            : QUERY_KEYS.articles.all({
                ...currentState,
                token,
              }),
        token,
      })
    : null;

  const handleFavoriteArticle = (slug: string) => {
    if (!favoriteMutations) {
      const isConfirmed = window.confirm(
        '로그인이 필요합니다. \n 로그인 하러 가시겠습니까?',
      );
      if (!isConfirmed) return;
      return navigate('/login');
    }
    favoriteMutations.favoriteArticle.mutate(slug);
  };

  const handleUnfavoriteArticle = (slug: string) => {
    if (!favoriteMutations) {
      const isConfirmed = window.confirm(
        '로그인이 필요합니다. \n 로그인 하러 가시겠습니까?',
      );
      if (!isConfirmed) return;
      return navigate('/login');
    }
    favoriteMutations.unfavoriteArticle.mutate(slug);
  };

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
    setFilter({
      ...currentState,
      tag,
    });
  };

  const handleTabChange = (tab: 'global' | 'personal') => {
    setFilter({
      ...currentState,
      tab,
    });
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

          <ArticleList
            articles={articles}
            favoriteArticle={handleFavoriteArticle}
            unfavoriteArticle={handleUnfavoriteArticle}
            isPending={favoriteMutations?.isPending || false}
          />

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
