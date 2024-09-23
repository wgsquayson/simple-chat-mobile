import { SafeAreaProvider } from "react-native-safe-area-context";
import Routes from "./src/routes";
import { StatusBar } from "expo-status-bar";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { AuthProvider } from "./src/contexts/auth";

GoogleSignin.configure({
  webClientId:
    "16868091198-68tnm7joroqktgl773gtskh5hh0lmrhb.apps.googleusercontent.com",
});

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthProvider>
        <SafeAreaProvider>
          <Routes />
        </SafeAreaProvider>
      </AuthProvider>
    </>
  );
}
