import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import {useBoundStore} from '../store';
import {authService} from '../services/auth.service';
import NetworkError from '../errors/NetworkError';
import {UpdateUserRequest} from '../types/authTypes';
import {ErrorDisplay} from '../components/ErrorDisplay';
import LoadingIndicator from '../components/LoadingIndicator';
import {Input} from '../components/Input';

interface SettingsPageProps {}

const SettingsPage = ({}: SettingsPageProps) => {
  const user = useBoundStore.getState().user;
  const updateUserMutation = useMutation({
    mutationFn: ({data, token}: {data: UpdateUserRequest; token: string}) =>
      authService.updateUser(data, token),
    onSuccess: (data) => {
      useBoundStore.getState().login(data.user, data.user.token);
      window.alert('User updated successfully');
    },
    onError: (error) => {
      if (NetworkError.isNetworkError(error)) {
        return error;
      }
      throw error;
    },
  });
  const navigate = useNavigate();
  const {mutate: updateUser, error: errors, isPending} = updateUserMutation;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const token = useBoundStore.getState().token;
    if (!token) {
      return;
    }
    const data = Object.fromEntries(
      formData.entries(),
    ) as UpdateUserRequest['user'];

    if (!user) {
      return;
    }

    const hasChanges =
      data.email !== user.email ||
      data.username !== user.username ||
      data.bio !== user.bio ||
      data.image !== user.image;

    if (!hasChanges) {
      window.alert('변경된 내용이 없습니다.');
      return;
    }

    updateUser({
      data: {user: data},
      token: token,
    });
  };

  const queryClient = useQueryClient();

  const handleLogout = async () => {
    useBoundStore.getState().logout();
    await queryClient.invalidateQueries({queryKey: ['auth']});
    navigate('/', {replace: true});
  };

  if (isPending) {
    return (
      <div
        role="alert"
        className="flex justify-center items-center min-h-screen"
      >
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <main className="py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-5xl text-center text-gray-800 dark:text-gray-100 mb-8">
            Your Settings
          </h2>

          <ErrorDisplay errors={errors} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="form-group">
                <label htmlFor="image" className="sr-only">
                  Profile Picture URL
                </label>
                <Input
                  id="image"
                  type="text"
                  placeholder="URL of profile picture"
                  defaultValue={user?.image || ''}
                  name="image"
                />
              </div>

              <div className="form-group">
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Your Name"
                  defaultValue={user?.username || ''}
                  name="username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio" className="sr-only">
                  Bio
                </label>
                <Input
                  id="bio"
                  isTextArea
                  placeholder="Short bio about you"
                  defaultValue={user?.bio || ''}
                  name="bio"
                  className="min-h-[200px]"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  defaultValue={user?.email || ''}
                  name="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="sr-only">
                  New Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="New Password"
                  name="password"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 dark:bg-green-600 
                  text-white rounded-lg 
                  hover:bg-green-600 dark:hover:bg-green-700 
                  focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 
                  focus:ring-offset-2 dark:focus:ring-offset-gray-800 
                  transition-colors"
              >
                Update Settings
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              className="w-full px-6 py-2 text-red-500 dark:text-red-400 
                border border-red-500 dark:border-red-400 rounded-lg 
                hover:bg-red-50 dark:hover:bg-red-900/20 
                focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 
                focus:ring-offset-2 dark:focus:ring-offset-gray-800 
                transition-colors"
              type="button"
              onClick={handleLogout}
            >
              Or click here to logout
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SettingsPage;
