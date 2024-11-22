import {QueryClient} from '@tanstack/react-query';
import TagInput from '../components/TagForm';
import {useTagInput} from '../hooks/useTagInput';
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  redirect,
  useActionData,
  useLoaderData,
  useParams,
  useSubmit,
} from 'react-router-dom';
import {articleService} from '../services/article.service';
import {useBoundStore} from '../store';
import NetworkError from '../errors/NetworkError';
import {articleQueryOptions} from '../queryOptions/articleQueryOptions';
import {ErrorDisplay} from '../components/ErrorDisplay';
import {Article} from '../types/articleTypes';
import {deepEqual} from '../util/deepEqual';
import {useEffect, useState} from 'react';

export const loader =
  (queryClient: QueryClient) =>
  async ({params}: LoaderFunctionArgs) => {
    if (!params.slug) {
      return new NetworkError({code: 404, message: 'slug가 필요합니다.'});
    }

    const token = useBoundStore.getState().token;

    if (!token) {
      return new NetworkError({code: 401, message: '로그인이 필요합니다.'});
    }

    try {
      const response = await queryClient.fetchQuery(
        articleQueryOptions.getArticle({slug: params.slug, token}),
      );

      const article = response.article;

      if (Object.keys(article.author).length === 0) {
        return new NetworkError({
          code: 404,
          message: '게시글을 찾을 수 없습니다.',
        });
      }

      return article;
    } catch (error) {
      if (NetworkError.isNetworkError(error)) {
        return error;
      }
      throw error;
    }
  };

export const action =
  (queryClient: QueryClient) =>
  async ({request, params}: ActionFunctionArgs) => {
    const formData = await request.formData();

    const articleData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      body: formData.get('body') as string,
      tagList: JSON.parse(formData.get('tagList') as string),
    };
    console.log(articleData);
    const token = useBoundStore.getState().token;

    if (!token) {
      return new NetworkError({code: 401, message: '로그인이 필요합니다.'});
    }

    try {
      if (params.slug) {
        // 수정
        const response = await articleService.updateArticle({
          slug: params.slug,
          article: articleData,
          token,
        });
        await queryClient.invalidateQueries({queryKey: ['articles']});
        return redirect(`/article/${response.article.slug}`);
      } else {
        // 생성
        const response = await articleService.createArticle({
          article: articleData,
          token,
        });
        await queryClient.invalidateQueries({queryKey: ['articles']});
        return redirect(`/article/${response.article.slug}`);
      }
    } catch (error) {
      if (NetworkError.isNetworkError(error)) {
        return error;
      }
      throw error;
    }
  };

interface EditorPageProps {}

const EditorPage = ({}: EditorPageProps) => {
  const {slug} = useParams();
  const loaderData = slug ? (useLoaderData() as Article) : null;
  const actionData = useActionData() as NetworkError | undefined;
  const [error, setError] = useState<NetworkError | undefined>(undefined);
  const submit = useSubmit();

  useEffect(() => {
    const loaderError = NetworkError.isNetworkError(loaderData)
      ? loaderData
      : undefined;
    setError(actionData || loaderError);
  }, [actionData, loaderData]);

  const article = loaderData || {
    title: '',
    description: '',
    body: '',
    tagList: [],
  };

  const {tags, addTag, removeTag} = useTagInput(article.tagList);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const articleData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      body: formData.get('body') as string,
      tagList: JSON.parse(formData.get('tagList') as string),
    };

    const isNotChanged = deepEqual(articleData, loaderData, [
      'title',
      'description',
      'body',
      'tagList',
    ]);

    if (isNotChanged) {
      console.log('변경사항이 있어야 합니다');
      return;
    }

    submit(formData, {
      method: 'post',
    });
  };

  return (
    <main className="bg-white dark:bg-gray-900 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="sr-only">글 {slug ? '수정' : '작성'}</h2>
          {error && <ErrorDisplay errors={error} />}

          <Form method="post" onSubmit={handleSubmit} className="space-y-6">
            <fieldset>
              <legend className="sr-only">글 정보 입력</legend>

              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="sr-only">
                    제목
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="w-full px-4 py-3 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    placeholder="Article Title"
                    defaultValue={article.title}
                    name="title"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="sr-only">
                    설명
                  </label>
                  <input
                    id="description"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    placeholder="What's this article about?"
                    defaultValue={article.description}
                    name="description"
                  />
                </div>

                <div>
                  <label htmlFor="body" className="sr-only">
                    본문
                  </label>
                  <textarea
                    id="body"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white min-h-[200px]"
                    placeholder="Write your article (in markdown)"
                    defaultValue={article.body}
                    name="body"
                  />
                </div>

                <TagInput
                  tags={tags}
                  onAddTag={addTag}
                  onRemoveTag={removeTag}
                />

                <input
                  type="hidden"
                  name="tagList"
                  value={JSON.stringify(tags)}
                />
              </div>

              <div className="mt-6 text-right">
                <button
                  className="px-6 py-2 text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 transition-colors"
                  type="submit"
                >
                  Publish Article
                </button>
              </div>
            </fieldset>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default EditorPage;
