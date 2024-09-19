import { useAuthContext } from "../../contexts/auth";
import { ChatsProps } from "./model";
import Template from "./template";

export default function Chats({ navigation }: ChatsProps) {
  const { user, signOut } = useAuthContext();

  function handleEnterChat(chatId: string) {
    navigation.navigate("Chat", {
      chatId,
    });
  }

  function _signOut() {
    signOut();
    navigation.replace("SignIn");
  }

  if (!user) {
    _signOut();

    return null;
  }

  return (
    <Template onSignOut={_signOut} user={user} onEnterChat={handleEnterChat} />
  );
}
