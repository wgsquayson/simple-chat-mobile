import { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/auth";
import { ChatsProps, ChatSummary } from "./model";
import Template from "./template";
import firestore from "@react-native-firebase/firestore";
import CreateChat from "./components/create-chat";
import { User } from "../../contexts/auth/model";
import { showErrorToast, validateEmail } from "../../utils";

const FAIL_TO_FETCH_ERROR =
  "An error happened while trying to retrieve your chats. Pull to refresh the page.";

export default function Chats({ navigation }: ChatsProps) {
  const { user, signOut } = useAuthContext();

  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);
  const [refetching, setRefetching] = useState(false);

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
        () => {
          showErrorToast({
            text2: FAIL_TO_FETCH_ERROR,
          });
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
    if (!validateEmail(email)) {
      return showErrorToast({
        text1: "Invalid e-mail.",
        text2: "Try again with a valid e-mail.",
      });
    }

    if (email === user?.email)
      return showErrorToast({
        text1: "Do not use your own e-mail",
        text2: "You can't talk with yourself, lol",
      });

    setCreatingChat(true);

    try {
      const response = await firestore()
        .collection("users")
        .where("email", "==", email)
        .get();

      if (!response?.docs[0]?.exists) {
        setCreatingChat(false);

        return showErrorToast({
          text1: "User not found",
          text2: "This user is not in our database yet. Invite them!",
        });
      }

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
            senderId: user?.id,
            text: "",
            timestamp: firestore.FieldValue.serverTimestamp(),
          },
        });

      navigation.navigate("Chat", { chatId });
    } catch (error) {
      showErrorToast();
    } finally {
      setCreatingChat(false);
    }
  }

  async function refetchMessages() {
    setRefetching(true);
    try {
      const snapshot = await firestore()
        .collection("chatSummaries")
        .where("participantIds", "array-contains", user?.id)
        .get();

      const chatSummaries: ChatSummary[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        lastMessage: doc.data().lastMessage,
        participantIds: doc.data().participantIds,
        participants: doc.data().participants,
      }));

      setChats(chatSummaries);
    } catch (error) {
      showErrorToast({
        text2: FAIL_TO_FETCH_ERROR,
      });
    } finally {
      setRefetching(false);
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
        refetching={refetching}
        onRefetch={refetchMessages}
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
