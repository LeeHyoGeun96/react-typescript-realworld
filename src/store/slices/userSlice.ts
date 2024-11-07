import {create, StateCreator} from 'zustand';

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

export interface UserSlice extends State, Actions {}

export const useUserStore = create<UserSlice>((set) => ({
  ...initialState,
  login: (user, token) => set({isLoggedIn: true, user, token}),
  logout: () => set({...initialState}),
}));

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (
  set,
) => ({
  ...initialState,
  login: (user, token) => set({isLoggedIn: true, user, token}),
  logout: () => set({...initialState}),
});
