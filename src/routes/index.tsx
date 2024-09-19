import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Chats from "./chats";
import Chat from "./chat";
import SignIn from "./sign-in";
import AuthContext, { useAuthContext } from "../contexts/auth";

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

  if (loading) return null;

  const initialRouteName: keyof StackParamList = user ? "Chats" : "SignIn";

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={initialRouteName}
      >
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Chats" component={Chats} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
