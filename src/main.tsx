import {StrictMode, Suspense, lazy} from 'react';
import {createRoot} from 'react-dom/client';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from 'react-router-dom';
import './index.css';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ErrorLayout from './components/ErrorLayout.tsx';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {ErrorBoundary} from './components/ErrorBoundary.tsx';
import RootPage, {loader as rootLoader} from './routes/root.tsx';
import IndexPage from './routes/home.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

// Lazy load components
const LoginPage = lazy(() => import('./routes/login.tsx'));
const RegisterPage = lazy(() => import('./routes/register.tsx'));
const SettingsPage = lazy(() => import('./routes/settings.tsx'));
const EditorPage = lazy(() => import('./routes/editor.tsx'));
const ArticlePage = lazy(() => import('./routes/article.tsx'));
const ProfilePage = lazy(() => import('./routes/profile.tsx'));

const queryClient = new QueryClient({
  defaultOptions: {},
});

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorLayout />,
    element: (
      <>
        <RootPage />
        <ScrollRestoration
          getKey={(location) => {
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
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LoginPage />
          </Suspense>
        ),
        action: async (args) => {
          const {action} = await import('./routes/login.tsx');
          return action(queryClient)(args);
        },
      },
      {
        path: '/register',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <RegisterPage />
          </Suspense>
        ),
        action: async (args) => {
          const {action} = await import('./routes/register.tsx');
          return action(queryClient)(args);
        },
      },
      {
        path: '/settings',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <SettingsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/editor',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Outlet />
            </Suspense>
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <EditorPage />,
            action: async (args) => {
              const {action} = await import('./routes/editor.tsx');
              return action(queryClient)(args);
            },
          },
          {
            path: ':slug',
            element: <EditorPage />,
            loader: async (args) => {
              const {loader} = await import('./routes/editor.tsx');
              return loader(queryClient)(args);
            },
            action: async (args) => {
              const {action} = await import('./routes/editor.tsx');
              return action(queryClient)(args);
            },
          },
        ],
      },
      {
        path: '/article/:slug',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ArticlePage />
          </Suspense>
        ),
        loader: async (args) => {
          const {loader} = await import('./routes/article.tsx');
          return loader(queryClient)(args);
        },
      },
      {
        path: '/deleteArticle/:slug',
        action: async (args) => {
          const {action} = await import('./routes/deleteArticle');
          return action(queryClient)(args);
        },
      },
      {
        path: '/profile/:username/*',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProfilePage />
          </Suspense>
        ),
      },
    ],
  },
]);

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools buttonPosition="bottom-right" />
          )}
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
}
