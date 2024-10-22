import { create, StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface State {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

interface Actions {
  login: (user: User, token: string) => void;
  logout: () => void;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const initialState: State = {
  isLoggedIn: false,
  user: null,
  token: null,
};

export interface UserSlice extends State, Actions {}

export const useUserStore = create<UserSlice>()(
  immer((set) => ({
    ...initialState,
    login: (user, token) => set({ isLoggedIn: true, user, token }),
    logout: () => set({ ...initialState }),
  })),
);

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (
  set,
) => ({
  ...initialState,
  login: (user, token) => set({ isLoggedIn: true, user, token }),
  logout: () => set({ ...initialState }),
});
