import {
  FlatList,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { Layout } from "../../ui/components";
import { useStyle } from "../../ui/hooks";
import Entypo from "@expo/vector-icons/Entypo";
import { TemplateProps } from "./model";

type Chat = {
  id: string;
  recipient: string;
  lastMessage: {
    text: string;
    date: string;
    read: boolean;
    sentByMe: boolean;
  };
};

const chats: Chat[] = [
  {
    id: "1",
    recipient: "Mark",
    lastMessage: {
      date: "17/09 - 11:07",
      text: "Hey, how you doing? I know we had our differences in the past but i would really like to",
      read: false,
      sentByMe: false,
    },
  },
  {
    id: "2",
    recipient: "Anna",
    lastMessage: {
      date: "15/09 - 11:10",
      text: "No",
      read: true,
      sentByMe: true,
    },
  },
  {
    id: "3",
    recipient: "Joseph",
    lastMessage: {
      date: "10/09 - 11:07",
      text: "Sure!",
      read: false,
      sentByMe: true,
    },
  },
];

export default function ({ onEnterChat }: TemplateProps) {
  const styles = useStyle((theme) => {
    const lastMessage: TextStyle = {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.sml,
    };

    return {
      header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: theme.spacing.sml,
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
        height: 1,
        width: "100%",
        backgroundColor: "white",
        marginVertical: theme.spacing.xs,
        opacity: 0.4,
      },
    };
  });

  return (
    <Layout>
      <>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>SimpleChat</Text>
          <TouchableOpacity>
            <Entypo
              name="plus"
              size={24}
              color={styles.theme.colors.icon.primary}
            />
          </TouchableOpacity>
        </View>
      </>
      <FlatList
        ItemSeparatorComponent={() => (
          <>
            <View style={styles.divider} />
          </>
        )}
        ListEmptyComponent={
          <>
            <Text style={styles.lastMessage}>
              No chats found. Touch the + icon to start a new chat.
            </Text>
          </>
        }
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const shouldHighlight =
            !item.lastMessage.sentByMe && !item.lastMessage.read;

          return (
            <TouchableOpacity
              style={styles.chat}
              onPress={() => onEnterChat(item.id)}
            >
              <View style={styles.chatInfo}>
                <Text style={styles.recipientName}>{item.recipient}</Text>

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

                <Text style={styles.date}>{item.lastMessage.date}</Text>
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
