import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContextValue, User } from "./model";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
  User as GoogleUser,
} from "@react-native-google-signin/google-signin";

const AuthContext = createContext<AuthContextValue>({
  signIn: () => new Promise(() => {}),
  signOut: () => new Promise(() => {}),
  loading: false,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(false);

  function updateUser(user: GoogleUser["user"]) {
    setUser({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  }

  async function signIn() {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response) && response.data) {
        updateUser(response.data.user);
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  }

  async function signOut() {
    try {
      await GoogleSignin.signOut();
      setUser(undefined);
    } catch (error) {}
  }

  async function checkForSignedInUser() {
    setLoading(true);

    const hasPreviousSignIn = GoogleSignin.hasPreviousSignIn();
    const response = GoogleSignin.getCurrentUser();

    if (hasPreviousSignIn && response?.user) {
      updateUser(response.user);
      setLoading(false);
      return;
    }

    try {
      const { data } = await GoogleSignin.signInSilently();
      if (data) updateUser(data.user);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkForSignedInUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}

export default AuthContext;
