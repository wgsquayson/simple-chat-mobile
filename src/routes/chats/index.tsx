import { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/auth";
import { ChatsProps, ChatSummary } from "./model";
import Template from "./template";
import firestore from "@react-native-firebase/firestore";

export default function Chats({ navigation }: ChatsProps) {
  const { user, signOut } = useAuthContext();

  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [loading, setLoading] = useState(false);

  function handleEnterChat(chatId: string) {
    navigation.navigate("Chat", {
      chatId,
    });
  }

  async function getUserChatSummaries() {
    if (!user?.id) return [];
    setLoading(true);

    try {
      const chatsSnapshot = await firestore()
        .collection("chatSummaries")
        .where("participantIds", "array-contains", user.id)
        .get();

      const chatSummaries: ChatSummary[] = chatsSnapshot.docs.map((doc) => ({
        id: doc.id,
        lastMessage: doc.data().lastMessage,
        participantIds: doc.data().participantIds,
        participants: doc.data().participants,
      }));

      setChats(chatSummaries);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserChatSummaries();
  }, []);

  if (!user) {
    signOut();

    return null;
  }

  return (
    <Template
      loading={loading}
      chats={chats}
      onSignOut={signOut}
      user={user}
      onEnterChat={handleEnterChat}
    />
  );
}
