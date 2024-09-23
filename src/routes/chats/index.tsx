import { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/auth";
import { ChatsProps, ChatSummary } from "./model";
import Template from "./template";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import CreateChat from "./components/create-chat";
import { User } from "../../contexts/auth/model";
import { showErrorToast, validateEmail } from "../../utils";
import STRINGS from "./strings";

export default function Chats({ navigation }: ChatsProps) {
  const { user, signOut } = useAuthContext();

  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);
  const [refetching, setRefetching] = useState(false);

  function formatAndSetChats(
    chatDocs: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[]
  ) {
    const chatSummaries: ChatSummary[] = chatDocs.map((doc) => ({
      id: doc.id,
      lastMessage: doc.data().lastMessage,
      participantIds: doc.data().participantIds,
      participants: doc.data().participants,
    }));

    const sortedChats = chatSummaries.sort(
      (a, b) =>
        b.lastMessage.timestamp?.seconds - a.lastMessage.timestamp?.seconds
    );

    setChats(sortedChats);
  }

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("chatSummaries")
      .where("participantIds", "array-contains", user?.id)
      .onSnapshot(
        (chatsSnapshot) => {
          if (chatsSnapshot.docs) {
            formatAndSetChats(chatsSnapshot.docs);
          }
          setLoading(false);
        },
        () => {
          showErrorToast({
            text2: STRINGS.ERRORS.FETCH.DESCRIPTION,
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

  function checkForExistingChats(participantId: string) {
    const chatSearch = chats.find((chat) =>
      chat.participantIds.includes(participantId)
    );
    return chatSearch?.id;
  }

  async function handleCreateChat(email: string) {
    if (!validateEmail(email)) {
      return showErrorToast({
        text1: STRINGS.ERRORS.INVALID_EMAIL.TITLE,
        text2: STRINGS.ERRORS.INVALID_EMAIL.DESCRIPTION,
      });
    }

    if (email === user?.email)
      return showErrorToast({
        text1: STRINGS.ERRORS.SAME_EMAIL.TITLE,
        text2: STRINGS.ERRORS.SAME_EMAIL.DESCRIPTION,
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
          text1: STRINGS.ERRORS.USER_NOT_FOUND.TITLE,
          text2: STRINGS.ERRORS.USER_NOT_FOUND.DESCRIPTION,
        });
      }

      const participant = response.docs[0].data();

      const existingChat = checkForExistingChats(participant.id);

      if (existingChat) {
        setModalVisible(false);
        return handleEnterChat(existingChat);
      }

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

      setModalVisible(false);

      handleEnterChat(chatId);
    } catch (error) {
      showErrorToast({
        text2: STRINGS.ERRORS.CREATE_CHAT.DESCRIPTION,
      });
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

      formatAndSetChats(snapshot.docs);
    } catch (error) {
      showErrorToast({
        text2: STRINGS.ERRORS.FETCH.DESCRIPTION,
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
