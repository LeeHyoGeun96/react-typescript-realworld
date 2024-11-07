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
} from 'react-router-dom';
import {articleService} from '../services/article.service';
import {useBoundStore} from '../store';
import NetworkError from '../errors/NetworkError';
import {articleQueryOptions} from '../queryOptions/articleQueryOptions';
import {ErrorDisplay} from '../components/ErrorDisplay';
import {Article} from '../types/articleTypes';

export const loader =
  (queryClient: QueryClient) =>
  async ({params}: LoaderFunctionArgs) => {
    if (!params.slug) {
      return {
        article: null,
        error: new NetworkError({code: 404, message: 'slug가 필요합니다.'}),
      };
    }

    const token = useBoundStore.getState().token;

    if (!token) {
      return {
        article: null,
        error: new NetworkError({code: 401, message: '로그인이 필요합니다.'}),
      };
    }

    try {
      const response = await queryClient.fetchQuery(
        articleQueryOptions.getArticle({slug: params.slug, token}),
      );
      return {article: response, error: null};
    } catch (error) {
      if (NetworkError.isNetworkError(error)) {
        return {article: null, error};
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
  const loaderData = useLoaderData() as {
    article?: Article;
    error?: NetworkError;
  } | null;
  const {tags, addTag, removeTag} = useTagInput(loaderData?.article?.tagList);
  const actionError = useActionData() as NetworkError;

  const error = actionError || loaderData?.error;

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ErrorDisplay errors={error} />

            <Form method="post">
              <fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    defaultValue={loaderData?.article?.title}
                    name="title"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    defaultValue={loaderData?.article?.description}
                    name="description"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                    defaultValue={loaderData?.article?.body}
                    name="body"
                  ></textarea>
                </fieldset>
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
                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="submit"
                >
                  Publish Article
                </button>
              </fieldset>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
