import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Chats from "./chats";
import Chat from "./chat";
import SignIn from "./sign-in";
import { useAuthContext } from "../contexts/auth";
import { FullscreenLoading } from "../ui/components";

export type StackParamList = {
  SignIn: undefined;
  Chats: undefined;
  Chat: {
    chatId: string;
  };
};

const Stack = createNativeStackNavigator<StackParamList>();

function Routes() {
  const { user, loading } = useAuthContext();

  if (loading) return <FullscreenLoading />;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={user ? "Chats" : "SignIn"}
      >
        {user ? (
          <>
            <Stack.Screen name="Chats" component={Chats} />
            <Stack.Screen name="Chat" component={Chat} />
          </>
        ) : (
          <Stack.Screen name="SignIn" component={SignIn} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
