// In App.js in a new project

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Chats from "./chats";
import Chat from "./chat";
import SignIn from "./sign-in";

export type StackParamList = {
  SignIn: undefined;
  Chats: undefined;
  Chat: {
    chatId: string;
  };
};

const Stack = createNativeStackNavigator<StackParamList>();

function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="SignIn"
      >
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Chats" component={Chats} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
