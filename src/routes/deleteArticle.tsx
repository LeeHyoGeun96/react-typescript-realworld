import {ActionFunctionArgs, redirect} from 'react-router-dom';
import {QueryClient} from '@tanstack/react-query';
import {useBoundStore} from '../store';
import NetworkError from '../errors/NetworkError';
import {articleService} from '../services/article.service';

export const action =
  (queryClient: QueryClient) =>
  async ({params}: ActionFunctionArgs) => {
    const {slug} = params;
    const token = useBoundStore.getState().token;

    if (!slug) {
      throw new NetworkError({code: 400, message: 'slug가 필요합니다.'});
    }

    if (!token) {
      throw new NetworkError({code: 401, message: '인증이 필요합니다.'});
    }

    try {
      await articleService.deleteArticle({slug, token});

      queryClient.invalidateQueries({queryKey: ['articles', 'article']});
      return redirect('/');
    } catch (error) {
      if (NetworkError.isNetworkError(error)) {
        return error;
      }
      throw error;
    }
  };
