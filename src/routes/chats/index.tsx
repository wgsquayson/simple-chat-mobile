import { ChatsProps } from "./model";
import Template from "./template";

export default function Chats({ navigation }: ChatsProps) {
  function handleEnterChat(chatId: string) {
    navigation.navigate("Chat", {
      chatId,
    });
  }

  return <Template onEnterChat={handleEnterChat} />;
}
