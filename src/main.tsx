import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import IndexPage from './routes/home.tsx';
import LoginPage, { action as loginAction } from './routes/login.tsx';
import RegisterPage, { action as registerAction } from './routes/register.tsx';
import SettingsPage from './routes/settings.tsx';
import EditorPage from './routes/editor.tsx';
import ArticlePage from './routes/article.tsx';
import ProfilePage from './routes/profile.tsx';
import UserPosts from './components/UserPosts.tsx';
import UserFavorites from './components/UserFavorites.tsx';
import RootPage from './routes/root.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorPage from './routes/error.tsx';

const queryClient = new QueryClient({
  defaultOptions: {},
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    errorElement: <ErrorPage />,
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
            <EditorPage />
          </ProtectedRoute>
        ),
        children: [
          {
            path: ':slug',
            element: <EditorPage />,
          },
        ],
      },
      {
        path: '/article/:slug',
        element: <ArticlePage />,
      },
      {
        path: '/profile/@:username',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
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
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
