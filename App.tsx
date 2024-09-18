import { SafeAreaProvider } from "react-native-safe-area-context";
import Routes from "./src/routes";
import { StatusBar } from "expo-status-bar";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure();

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <SafeAreaProvider>
        <Routes />
      </SafeAreaProvider>
    </>
  );
}
