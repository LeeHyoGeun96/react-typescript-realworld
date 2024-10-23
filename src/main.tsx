import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import IndexPage from './routes/home.tsx';
import LoginPage from './routes/login.tsx';
import RegisterPage from './routes/register.tsx';
import SettingsPage from './routes/settings.tsx';
import EditorPage from './routes/editor.tsx';
import ArticlePage from './routes/article.tsx';
import ProfilePage from './routes/profile.tsx';
import UserPosts from './components/UserPosts.tsx';
import UserFavorites from './components/UserFavorites.tsx';
import RootPage from './routes/root.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        index: true,
        element: <IndexPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
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
    <RouterProvider router={router} />
  </StrictMode>,
);
