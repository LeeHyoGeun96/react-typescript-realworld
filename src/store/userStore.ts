import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';

export interface CurrentUserType {
  username: string | null;
  email: string | null;
  bio: string | null;
  image: string | null;
}

interface State {
  isLoggedIn: boolean;
  user: CurrentUserType | null;
  token: string | null;
}

interface Actions {
  login: (user: CurrentUserType, token: string) => void;
  logout: () => void;
}

const initialState: State = {
  isLoggedIn: false,
  user: null,
  token: null,
};

export const useUserStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      ...initialState,
      login: (user, token) => set({isLoggedIn: true, user, token}),
      logout: () => set({...initialState}),
    })),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
);
