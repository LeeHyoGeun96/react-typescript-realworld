import { create } from 'zustand';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { immer } from 'zustand/middleware/immer';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useBoundStore = create<UserSlice>()(
  persist(
    immer((...args) => ({
      ...createUserSlice(...args),
    })),
    {
      name: 'user',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
      }),
    },
  ),
);
