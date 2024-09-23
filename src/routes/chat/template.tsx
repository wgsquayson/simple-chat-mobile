import { FullscreenLoading, Layout } from "../../ui/components";
import Entypo from "@expo/vector-icons/Entypo";
import { useStyle } from "../../ui/hooks";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { TemplateProps } from "./model";
import { useRef, useState } from "react";
import { formatDate, showErrorToast } from "../../utils";

export default function ({
  onGoBack,
  chat,
  user,
  loading,
  hasError,
  sendingMessage,
  onSendMessage,
}: TemplateProps) {
  const flatlistRef = useRef<FlatList>(null);

  const [message, setMessage] = useState("");

  const styles = useStyle((theme) => {
    const messageBubble: ViewStyle = {
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing.sml,
      borderRadius: theme.spacing.xs,
      maxWidth: "80%",
      flex: 0,
      gap: theme.spacing.xxs,
    };

    return {
      header: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sml,
        marginBottom: theme.spacing.sml,
      },
      headerText: {
        color: theme.colors.text.primary,
        fontWeight: 600,
        fontSize: theme.fontSizes.md,
      },
      messageBubbleReceiver: {
        ...messageBubble,
        alignSelf: "flex-start",
      },
      messageBubbleSender: {
        ...messageBubble,
        alignSelf: "flex-end",
      },
      messageText: {
        color: theme.colors.text.secondary,
        fontSize: theme.fontSizes.sml,
      },
      date: {
        color: theme.colors.text.secondary,
        fontSize: theme.fontSizes.xs,
        alignSelf: "flex-end",
      },
      inputContainer: {
        borderWidth: 3,
        borderColor: theme.colors.border.primary,
        padding: theme.spacing.xs,
        borderRadius: theme.spacing.xs,
        gap: theme.spacing.sml,
        marginVertical: theme.spacing.sml,
        flexDirection: "row",
      },
      input: {
        color: theme.colors.text.primary,
        fontSize: theme.fontSizes.sml,
        flex: 1,
      },
      infoText: {
        color: theme.colors.text.primary,
        fontSize: theme.fontSizes.sml,
      },
      sendButton: {
        opacity: message ? 1 : 0.4,
      },
    };
  });

  if (loading) return <FullscreenLoading />;

  const receiver = chat.participants.find(
    (participant) => participant.id !== user.id
  );

  if (!receiver) {
    showErrorToast();
    onGoBack();
    return null;
  }

  async function handleSendMessage() {
    await onSendMessage({ text: message });

    if (!hasError) {
      setMessage("");
    }
  }

  return (
    <Layout>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack}>
          <Entypo
            name="chevron-left"
            size={24}
            color={styles.theme.colors.text.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>{receiver.name}</Text>
      </View>
      <FlatList
        ref={flatlistRef}
        inverted
        ListEmptyComponent={
          <Text style={styles.infoText}>No messages yet.</Text>
        }
        showsVerticalScrollIndicator={false}
        data={[...chat.messages].reverse()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSentMessage = item.senderId === user.id;

          return (
            <>
              <View
                style={
                  isSentMessage
                    ? styles.messageBubbleSender
                    : styles.messageBubbleReceiver
                }
              >
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.date}>
                  {formatDate(item.timestamp.seconds)}
                </Text>
              </View>
              <View style={{ height: styles.theme.spacing.xxs }} />
            </>
          );
        }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity
          disabled={!message || sendingMessage}
          style={styles.sendButton}
          onPress={handleSendMessage}
        >
          <Entypo
            name="paper-plane"
            size={24}
            color={styles.theme.colors.icon.primary}
          />
        </TouchableOpacity>
      </View>
    </Layout>
  );
}
