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
import {useArticlesFavoriteMutations} from '../hooks/useArticlesFavoriteMutations';
import {QUERY_KEYS} from '../queryOptions/constants/queryKeys';
import {useNavigate} from 'react-router-dom';

interface PagenatedAticlesProps {}

const ITEMS_PER_PAGE = 10;

const PagenatedAticles = ({}: PagenatedAticlesProps) => {
  const navigate = useNavigate();
  const isLoggedIn = useBoundStore((state) => state.isLoggedIn);
  const token = useBoundStore((state) => state.token);
  const {currentState, setOffset, setFilter} =
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
    ? useArticlesFavoriteMutations({
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
    return (
      <div className="p-4 text-center text-gray-600 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  if (articlesQuery.isError || tagsQuery.isError) {
    throw articlesQuery.error || tagsQuery.error;
  }

  const isFetching = articlesQuery.isFetching;

  const pageCount = Math.ceil(articlesCount / ITEMS_PER_PAGE);
  const currentPage = Math.floor(currentState.offset / ITEMS_PER_PAGE);

  const handlePageClick = (event: {selected: number}) => {
    setOffset(event.selected);
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 태그 사이드바를 위한 더미 div */}
        <div className="hidden lg:block lg:w-64"></div>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 max-w-3xl mx-auto w-full">
          <FeedToggle
            params={{tab: currentState.tab, tag: currentState.tag}}
            isLoggedIn={isLoggedIn}
            onTabChange={handleTabChange}
            disabled={isFetching}
          />

          {isFetching && (
            <div className="p-4 text-center text-gray-600 dark:text-gray-400">
              Loading...
            </div>
          )}

          <ArticleList
            articles={articles}
            favoriteArticle={handleFavoriteArticle}
            unfavoriteArticle={handleUnfavoriteArticle}
            isPending={favoriteMutations?.isPending || false}
          />

          <div className="mt-8">
            <ReactPaginate
              pageCount={pageCount}
              onPageChange={handlePageClick}
              forcePage={currentPage}
              containerClassName="flex justify-center gap-2"
              pageClassName="rounded-md"
              pageLinkClassName="block px-3 py-2 btn-outline- active:bg-brand-primary text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
              activeClassName="!bg-brand-primary"
              activeLinkClassName="!text-white hover:!bg-brand-primary"
              previousLabel=""
              nextLabel=""
              previousClassName="hidden"
              nextClassName="hidden"
              disabledClassName="opacity-50"
              disabledLinkClassName="cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700"
            />
          </div>
        </div>

        {/* 태그 사이드바 */}
        <div className="lg:w-64 w-full ">
          <div className="lg:sticky lg:top-4">
            <SelectTag tags={tags} onTagClick={handleTagClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagenatedAticles;
