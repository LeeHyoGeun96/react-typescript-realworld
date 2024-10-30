import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useBoundStore } from '../store';
import { authService } from '../services/auth.service';
import NetworkError from '../errors/NetworkError';

interface SettingsPageProps {}

const SettingsPage = ({}: SettingsPageProps) => {
  const user = useBoundStore.getState().user;
  const updateUserMutation = useMutation({
    mutationFn: ({ data, token }: { data: UpdateUserRequest; token: string }) =>
      authService.updateUser(data, token),
    onSuccess: (data) => {
      useBoundStore.getState().login(data.user, data.user.token);
      window.alert('User updated successfully');
    },
    onError: (error) => {
      if (NetworkError.isNetworkError(error)) {
        if (error.code === 422 || error.code === 403) {
          return (
            error.errors || { 'email or password': ['Invalid credentials'] }
          );
        }
      }
      throw error;
    },
  });
  const navigate = useNavigate();
  const { mutate: updateUser, error, isPending } = updateUserMutation;

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
      data: { user: data },
      token: token,
    });
  };

  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await queryClient.invalidateQueries({ queryKey: ['auth'] });
    useBoundStore.getState().logout();
    navigate('/', { replace: true });
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            <ul className="error-messages">
              {error &&
                Object.entries(error).map(([key, value]) => (
                  <li key={key}>{value.join(', ')}</li>
                ))}
            </ul>

            <form onSubmit={handleSubmit}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    defaultValue={user?.image || ''}
                    name="image"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    defaultValue={user?.username || ''}
                    name="username"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    rows={8}
                    placeholder="Short bio about you"
                    defaultValue={user?.bio || ''}
                    name="bio"
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    defaultValue={user?.email || ''}
                    name="email"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="New Password"
                    name="password"
                  />
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right">
                  Update Settings
                </button>
              </fieldset>
            </form>
            <hr />

            <button
              className="btn btn-outline-danger"
              type="submit"
              onClick={handleLogout}
            >
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
