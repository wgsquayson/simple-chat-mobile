import { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/auth";
import { ChatsProps, ChatSummary } from "./model";
import Template from "./template";
import firestore from "@react-native-firebase/firestore";
import CreateChat from "./components/create-chat";
import { User } from "../../contexts/auth/model";

export default function Chats({ navigation }: ChatsProps) {
  const { user, signOut } = useAuthContext();

  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("chatSummaries")
      .where("participantIds", "array-contains", user?.id)
      .onSnapshot(
        (chatsSnapshot) => {
          if (chatsSnapshot.docs) {
            const chatSummaries: ChatSummary[] = chatsSnapshot.docs.map(
              (doc) => ({
                id: doc.id,
                lastMessage: doc.data().lastMessage,
                participantIds: doc.data().participantIds,
                participants: doc.data().participants,
              })
            );

            setChats(chatSummaries);
          }
          setLoading(false);
        },
        (error) => {
          // show error
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [user?.id]);

  if (!user) {
    signOut();

    return null;
  }

  function handleEnterChat(chatId: string) {
    navigation.navigate("Chat", {
      chatId,
    });
  }

  async function handleCreateChat(email: string) {
    setCreatingChat(true);

    //show error
    if (email === user?.email) return;

    try {
      const response = await firestore()
        .collection("users")
        .where("email", "==", email)
        .get();

      //show error
      if (!response.docs[0].exists) return;

      const participant = response.docs[0].data();

      const participants: User[] = [
        user!,
        {
          id: participant.id,
          name: participant.name,
          email: participant.email,
        },
      ];

      const participantIds = [user!.id, participant.id];

      const newChatRef = await firestore().collection("chats").add({
        participants,
        messages: [],
      });

      const chatId = newChatRef.id;

      await firestore()
        .collection("chatSummaries")
        .doc(chatId)
        .set({
          chatId,
          participants,
          participantIds,
          lastMessage: {
            read: false,
            sentByMe: false,
            text: "",
            timestamp: firestore.FieldValue.serverTimestamp(),
          },
        });

      navigation.navigate("Chat", { chatId });
    } catch (error) {
    } finally {
      setCreatingChat(false);
    }
  }

  return (
    <>
      <Template
        loading={loading}
        chats={chats}
        onSignOut={signOut}
        user={user}
        onEnterChat={handleEnterChat}
        onCreateChat={() => setModalVisible(true)}
      />
      <CreateChat
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleCreateChat}
        loading={creatingChat}
      />
    </>
  );
}
