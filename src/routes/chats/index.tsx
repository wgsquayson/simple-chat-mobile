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

  if (!user) {
    signOut();

    return null;
  }

  return (
    <Template onSignOut={signOut} user={user} onEnterChat={handleEnterChat} />
  );
}
