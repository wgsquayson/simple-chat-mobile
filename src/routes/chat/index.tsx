import { useEffect, useState } from "react";
import { ChatProps, Message } from "./model";
import Template from "./template";
import firestore from "@react-native-firebase/firestore";
import { User } from "../../contexts/auth/model";
import { useAuthContext } from "../../contexts/auth";
import { showErrorToast } from "../../utils";
import useImageUpload from "./hooks/use-image-upload";
import STRINGS from "./strings";

export default function Chat({ navigation, route }: ChatProps) {
  const chatId = route.params.chatId;

  const { user } = useAuthContext();
  const { openImageUploadOptions, loading: sendingImage } = useImageUpload(
    user!.id,
    chatId
  );

  const [participants, setParticipants] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

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
        () => {
          showErrorToast({
            text2: STRINGS.ERRORS.UPDATE_MESSAGES.DESCRIPTION,
          });
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
    showErrorToast();
    return null;
  }

  async function sendMessage({ text }: Pick<Message, "text">) {
    setSendingMessage(true);
    setHasError(false);
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
      setHasError(true);

      showErrorToast({
        text1: STRINGS.ERRORS.SEND_MESSAGE.TITLE,
        text2: STRINGS.ERRORS.SEND_MESSAGE.DESCRIPTION,
      });
    } finally {
      setSendingMessage(false);
    }
  }

  return (
    <Template
      chat={{ participants, messages }}
      user={user}
      loading={loading}
      onSendMessage={sendMessage}
      onGoBack={navigation.goBack}
      hasError={hasError}
      sendingMessage={sendingMessage}
      onPressCamera={openImageUploadOptions}
      sendingImage={sendingImage}
    />
  );
}
