import { create } from 'zustand';

interface AdminState {
  isAdmin: boolean;
  adminKey: string;
  setAdminKey: (key: string) => void;
  checkAdmin: () => boolean;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  isAdmin: false,
  adminKey: '',
  setAdminKey: (key: string) => {
    const isValid = key === 'UmaDineshAgrahari';
    set({ adminKey: key, isAdmin: isValid });
  },
  checkAdmin: () => get().isAdmin,
}));