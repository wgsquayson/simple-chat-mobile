export type User = {
  id: string;
  name: string | null;
  email: string;
};

export type AuthContextValue = {
  user?: User;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};
