import {StrictMode, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from 'react-router-dom';

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
import RootPage, {loader as rootLoader} from './routes/root.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ErrorLayout from './components/ErrorLayout.tsx';
import {action as deleteArticleAction} from './routes/deleteArticle';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {ErrorBoundary} from './components/ErrorBoundary.tsx';

const queryClient = new QueryClient({
  defaultOptions: {},
});

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorLayout />,
    element: (
      <>
        <RootPage />
        <ScrollRestoration
          getKey={(location, _) => {
            return location.key;
          }}
        />
      </>
    ),
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
        element: (
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        ), // 추가: 모든 editor 경로에 대해 인증 체크
        action: editorAction(queryClient),
        children: [
          {
            index: true,
            element: <EditorPage />,
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
            path: '',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <ProfilePage />
              </Suspense>
            ),
          },
          {
            path: 'favorites',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <ProfilePage />
              </Suspense>
            ),
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
        <ReactQueryDevtools buttonPosition="bottom-right" />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
