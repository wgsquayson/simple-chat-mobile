import { FullscreenLoading, Layout, Row } from "../../ui/components";
import Entypo from "@expo/vector-icons/Entypo";
import { useStyle } from "../../ui/hooks";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { TemplateProps } from "./model";
import { useEffect, useRef, useState } from "react";
import { formatDate, showErrorToast } from "../../utils";

export default function ({
  onGoBack,
  chat,
  user,
  loading,
  hasError,
  sendingMessage,
  onSendMessage,
  onPressCamera,
  sendingImage,
}: TemplateProps) {
  const flatlistRef = useRef<FlatList>(null);

  const [message, setMessage] = useState("");
  const [lastMessage, setLastMessage] = useState("");

  const styles = useStyle((theme) => {
    const messageBubble: ViewStyle = {
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing.xs,
      borderRadius: theme.spacing.xs,
      maxWidth: "80%",
      flex: 0,
      gap: theme.spacing.xxs,
    };

    return {
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
      image: {
        width: Dimensions.get("window").width / 1.5,
        height: Dimensions.get("window").height / 3,
        borderRadius: theme.spacing.xs,
      },
    };
  });

  useEffect(() => {
    if (hasError) {
      setMessage(lastMessage);
    }
  }, [hasError, lastMessage]);

  if (loading) return <FullscreenLoading />;

  const receiver = chat.participants.find(
    (participant) => participant.id !== user.id
  );

  if (!receiver) {
    showErrorToast();
    onGoBack();
    return null;
  }

  function handleSendMessage() {
    setLastMessage(message);
    onSendMessage({ text: message });
    setMessage("");
  }

  return (
    <Layout>
      <Row
        marginBottom={styles.theme.spacing.sml}
        justifyContent="space-between"
      >
        <Row gap={styles.theme.spacing.sml}>
          <TouchableOpacity onPress={onGoBack}>
            <Entypo
              name="chevron-left"
              size={24}
              color={styles.theme.colors.text.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>{receiver.name}</Text>
        </Row>
        <TouchableOpacity onPress={onPressCamera}>
          <Entypo
            name="camera"
            size={24}
            color={styles.theme.colors.text.primary}
          />
        </TouchableOpacity>
      </Row>
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
                {item.imageUrl ? (
                  <Image
                    style={styles.image}
                    source={{ uri: item.imageUrl }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.messageText}>{item.text}</Text>
                )}
                <Text style={styles.date}>
                  {formatDate(item.timestamp.seconds)}
                </Text>
              </View>
              <View style={{ height: styles.theme.spacing.xxs }} />
            </>
          );
        }}
      />
      {sendingImage ? (
        <Text
          style={[styles.infoText, { marginTop: styles.theme.spacing.sml }]}
        >
          Sending image...
        </Text>
      ) : null}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity
          disabled={!message || sendingMessage || sendingImage}
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
