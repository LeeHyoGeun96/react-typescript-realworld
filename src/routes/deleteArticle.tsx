import {ActionFunctionArgs, redirect} from 'react-router-dom';
import {QueryClient} from '@tanstack/react-query';
import {useUserStore} from '../store/userStore';
import NetworkError from '../errors/NetworkError';
import {articleService} from '../services/article.service';

export const action =
  (queryClient: QueryClient) =>
  async ({params}: ActionFunctionArgs) => {
    const {slug} = params;
    const {token} = useUserStore();

    if (!slug) {
      throw new NetworkError({code: 400, message: 'slug가 필요합니다.'});
    }

    if (!token) {
      throw new NetworkError({code: 401, message: '인증이 필요합니다.'});
    }

    const isConfirmed = window.confirm(
      '정말로 삭제하시겠습니까? \n 삭제된 게시물은 복구할 수 없습니다.',
    );
    if (!isConfirmed) return redirect(`/article/${slug}`);

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
