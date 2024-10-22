import { create } from 'zustand';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { immer } from 'zustand/middleware/immer';

export const useBoundStore = create<UserSlice>()(
  immer((...args) => ({
    ...createUserSlice(...args),
  })),
);
