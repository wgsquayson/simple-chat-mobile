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
} from "@react-native-google-signin/google-signin";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { showErrorToast } from "../../utils";
import STRINGS from "./strings";

const AuthContext = createContext<AuthContextValue>({
  signIn: () => new Promise(() => {}),
  signOut: () => new Promise(() => {}),
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>();

  async function signIn() {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response) && response.data) {
        const googleCredential = auth.GoogleAuthProvider.credential(
          response.data.idToken
        );

        const { user } = await auth().signInWithCredential(googleCredential);

        const userDoc = await firestore()
          .collection("users")
          .doc(user.uid)
          .get();

        if (!userDoc.exists) {
          await firestore().collection("users").doc(user.uid).set({
            id: user.uid,
            name: user.displayName,
            email: user.email,
            createdAt: new Date(),
          });
        }

        setUser({
          id: user.uid,
          name: user.displayName,
          email: user.email ?? "",
        });
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            showErrorToast({
              text2: STRINGS.ERRORS.SIGN_IN_IN_PROGRESS,
            });
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            showErrorToast({
              text2: STRINGS.ERRORS.PLAY_SERVICES,
            });
            break;
          default:
            showErrorToast();
        }
      } else {
        showErrorToast();
      }
    }
  }

  async function signOut() {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      setUser(undefined);
    } catch (error) {
      showErrorToast();
    }
  }

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    if (user) {
      setUser({
        id: user.uid,
        email: user.email,
        name: user.displayName,
      });
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    return () => subscriber();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
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
