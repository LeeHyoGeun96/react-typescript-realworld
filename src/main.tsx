import {StrictMode, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import './index.css';
import IndexPage from './routes/home.tsx';
import LoginPage, {action as loginAction} from './routes/login.tsx';
import RegisterPage, {action as registerAction} from './routes/register.tsx';
import SettingsPage from './routes/settings.tsx';
import EditorPage, {
  action as editorAction,
  loader as editorLoader,
} from './routes/editor.tsx';
import ArticlePage, {loader as articleLoader} from './routes/article.tsx';
import ProfilePage from './routes/profile.tsx';
import UserPosts from './components/UserPosts.tsx';
import UserFavorites from './components/UserFavorites.tsx';
import RootPage, {loader as rootLoader} from './routes/root.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ErrorPage from './routes/error.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import {action as deleteArticleAction} from './routes/deleteArticle';

const queryClient = new QueryClient({
  defaultOptions: {},
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    errorElement: <ErrorPage />,
    loader: rootLoader(queryClient),
    children: [
      {
        index: true,
        element: <IndexPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
        action: loginAction(queryClient),
      },
      {
        path: '/register',
        element: <RegisterPage />,
        action: registerAction(queryClient),
      },
      {
        path: '/settings',
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },

      {
        path: '/editor',

        action: editorAction(queryClient),
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            ),
            action: editorAction(queryClient),
          },
          {
            path: ':slug',
            element: <EditorPage />,
            loader: editorLoader(queryClient),
            action: editorAction(queryClient),
          },
        ],
      },
      {
        path: '/article/:slug',
        element: <ArticlePage />,
        loader: articleLoader(queryClient),
      },
      {
        path: '/deleteArticle/:slug',
        action: deleteArticleAction(queryClient),
      },
      {
        path: '/profile/:username',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProfilePage />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: <UserPosts />,
          },
          {
            path: 'favorites',
            element: <UserFavorites />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
