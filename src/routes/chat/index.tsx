import { useEffect, useState } from "react";
import { ChatProps, Message } from "./model";
import Template from "./template";
import firestore from "@react-native-firebase/firestore";
import { User } from "../../contexts/auth/model";
import { useAuthContext } from "../../contexts/auth";

export default function Chat({ navigation, route }: ChatProps) {
  const chatId = route.params.chatId;

  const { user } = useAuthContext();

  const [participants, setParticipants] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("chats")
      .doc(chatId)
      .onSnapshot(
        (documentSnapshot) => {
          if (documentSnapshot.exists) {
            const chatData = documentSnapshot.data();
            setParticipants(chatData?.participants);
            setMessages(chatData?.messages);
          }
          setLoading(false);
        },
        (error) => {
          // show error
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [chatId]);

  async function updateReadMessage() {
    const chatSummaryRef = firestore().collection("chatSummaries").doc(chatId);
    await chatSummaryRef.update({
      "lastMessage.read": true,
    });
  }

  useEffect(() => {
    updateReadMessage();
  }, [messages]);

  if (!user) {
    //show error
    return null;
  }

  async function sendMessage({ text }: Pick<Message, "text">) {
    try {
      const newMessage = {
        id: firestore()
          .collection("chats")
          .doc(chatId)
          .collection("messages")
          .doc().id,
        text: text,
        senderId: user?.id,
        timestamp: new Date(),
      };

      const chatRef = firestore().collection("chats").doc(chatId);
      await chatRef.update({
        messages: firestore.FieldValue.arrayUnion(newMessage),
      });

      const chatSummaryRef = firestore()
        .collection("chatSummaries")
        .doc(chatId);
      await chatSummaryRef.update({
        lastMessage: {
          read: false,
          senderId: user?.id,
          text,
          timestamp: firestore.FieldValue.serverTimestamp(),
        },
      });
    } catch (error) {
      // show error
    }
  }

  return (
    <Template
      chat={{ participants, messages }}
      user={user}
      loading={loading}
      onSendMessage={sendMessage}
      onGoBack={navigation.goBack}
    />
  );
}
