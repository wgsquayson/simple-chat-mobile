import { FullscreenLoading, Layout } from "../../ui/components";
import Entypo from "@expo/vector-icons/Entypo";
import { useStyle } from "../../ui/hooks";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { TemplateProps } from "./model";
import { useEffect, useRef, useState } from "react";
import { formatDate, showErrorToast } from "../../utils";
import FullscreenImage from "./components/fullscreen-image";
import STRINGS from "./strings";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

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
    <>
      <Layout
        header={{
          title: receiver.name,
          rightIcon: "camera",
          onRightPress: onPressCamera,
          leftIcon: "chevron-left",
          onLeftPress: onGoBack,
        }}
        footer={
          <>
            {sendingImage ? (
              <Text
                style={[
                  styles.infoText,
                  { marginTop: styles.theme.spacing.sml },
                ]}
              >
                {STRINGS.SENDING_IMAGE}
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
          </>
        }
      >
        <FlatList
          ref={flatlistRef}
          inverted
          ListEmptyComponent={
            <Text style={styles.infoText}>{STRINGS.NO_MESSAGES}</Text>
          }
          showsVerticalScrollIndicator={false}
          data={[...chat.messages].reverse()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSentMessage = item.senderId === user.id;

            function onPressImage() {
              setSelectedImageUrl(item.imageUrl);
              setModalVisible(true);
            }

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
                    <Pressable onPress={onPressImage}>
                      <Image
                        style={styles.image}
                        source={{ uri: item.imageUrl }}
                        resizeMode="cover"
                      />
                    </Pressable>
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
      </Layout>
      <FullscreenImage
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        imageUrl={selectedImageUrl}
      />
    </>
  );
}
