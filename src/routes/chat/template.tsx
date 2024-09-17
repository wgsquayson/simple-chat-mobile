import { Layout } from "../../ui/components";
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

type Chat = {
  id: string;
  participants: {
    id: string;
    name: string;
  }[];
  messages: {
    id: string;
    text: string;
    date: string;
    senderId: string;
  }[];
};

const currentUser = {
  id: "1",
  name: "Will",
};

const chat: Chat = {
  id: "1",
  participants: [
    {
      id: "1",
      name: "Will",
    },
    {
      id: "2",
      name: "Mark",
    },
  ],
  messages: [
    {
      id: "1",
      date: "17/09 - 17:38",
      senderId: "2",
      text: "Hey, how you doing? I know we had our differences in the past but i would really like to settle all of it",
    },
    {
      id: "2",
      date: "17/09 - 17:40",
      senderId: "1",
      text: "Hello man, let's work it out.",
    },
  ],
};

export default function ({ onGoBack }: TemplateProps) {
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
    };
  });

  const receiver = chat.participants.find(
    (participant) => participant.id !== currentUser.id
  );

  if (!receiver) {
    // display error
    return null;
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
        ItemSeparatorComponent={() => (
          <>
            <View style={{ height: styles.theme.spacing.xxs }} />
          </>
        )}
        showsVerticalScrollIndicator={false}
        data={chat.messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSentMessage = item.senderId === currentUser.id;

          return (
            <View
              style={
                isSentMessage
                  ? styles.messageBubbleSender
                  : styles.messageBubbleReceiver
              }
            >
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          );
        }}
      />
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} />
        <TouchableOpacity>
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
