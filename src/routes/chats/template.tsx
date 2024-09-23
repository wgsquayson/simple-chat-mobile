import {
  FlatList,
  RefreshControl,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Layout, Row } from "../../ui/components";
import { useStyle } from "../../ui/hooks";
import Entypo from "@expo/vector-icons/Entypo";
import { TemplateProps } from "./model";
import { formatDate } from "../../utils";

export default function ({
  onEnterChat,
  user,
  chats,
  loading,
  onSignOut,
  onCreateChat,
  refetching,
  onRefetch,
}: TemplateProps) {
  const styles = useStyle((theme) => {
    const lastMessage: TextStyle = {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.sml,
    };

    return {
      header: {
        marginBottom: theme.spacing.md,
        gap: theme.spacing.xxs,
      },
      pageTitle: {
        color: theme.colors.text.primary,
        fontSize: theme.fontSizes.lg,
        fontWeight: 200,
      },
      chat: {
        flexDirection: "row",
        gap: theme.spacing.sml,
        alignItems: "center",
        justifyContent: "space-between",
      },
      chatInfo: { gap: theme.spacing.xxxs, flex: 1 },
      recipientName: {
        color: theme.colors.text.primary,
        fontSize: theme.fontSizes.md,
        fontWeight: 600,
      },
      lastMessage,
      lastMessageBold: {
        ...lastMessage,
        fontWeight: 700,
      },
      date: {
        color: theme.colors.text.primary,
        fontSize: theme.fontSizes.xs,
      },
      divider: {
        height: 2,
        width: "100%",
        backgroundColor: theme.colors.border.primary,
        marginVertical: theme.spacing.xs,
      },
    };
  });

  return (
    <Layout>
      <View style={styles.header}>
        <Row justifyContent="space-between">
          <Text style={styles.pageTitle}>SimpleChat</Text>
          <TouchableOpacity onPress={onCreateChat}>
            <Entypo
              name="plus"
              size={24}
              color={styles.theme.colors.icon.primary}
            />
          </TouchableOpacity>
        </Row>
        <Text style={styles.lastMessage}>Hello, {user.name}!</Text>
        <Button label="Sign out" onPress={onSignOut} />
      </View>
      <FlatList
        ItemSeparatorComponent={() => (
          <>
            <View style={styles.divider} />
          </>
        )}
        ListEmptyComponent={
          <>
            <Text style={styles.lastMessage}>
              {loading
                ? "Loading..."
                : "No chats found. Touch the + icon to start a new chat."}
            </Text>
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={refetching}
            onRefresh={onRefetch}
            tintColor={styles.theme.colors.icon.primary}
          />
        }
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const recipient = item.participants.find(
            (participant) => participant.id !== user.id
          );

          const shouldHighlight =
            item.lastMessage.senderId !== user.id && !item.lastMessage.read;

          const timestamp = item.lastMessage?.timestamp?.seconds;

          return (
            <TouchableOpacity
              style={styles.chat}
              onPress={() => onEnterChat(item.id)}
            >
              <View style={styles.chatInfo}>
                <Text style={styles.recipientName}>{recipient?.name}</Text>
                {item.lastMessage.text ? (
                  <Text
                    style={
                      shouldHighlight
                        ? styles.lastMessageBold
                        : styles.lastMessage
                    }
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.lastMessage.text}
                  </Text>
                ) : null}
                {timestamp ? (
                  <Text style={styles.date}>
                    {formatDate(item.lastMessage.timestamp.seconds)}
                  </Text>
                ) : null}
              </View>
              <Entypo
                name="chevron-small-right"
                size={24}
                color={styles.theme.colors.text.primary}
              />
            </TouchableOpacity>
          );
        }}
      />
    </Layout>
  );
}
