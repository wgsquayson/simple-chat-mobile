import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "..";

export type ChatsProps = NativeStackScreenProps<StackParamList, "Chats">;

export type TemplateProps = {
  onEnterChat: (chatId: string) => void;
};
