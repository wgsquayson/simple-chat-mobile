import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "..";
import { User } from "../../contexts/auth/model";

export type ChatsProps = NativeStackScreenProps<StackParamList, "Chats">;

export type TemplateProps = {
  onEnterChat: (chatId: string) => void;
  user: User;
  onSignOut: () => void;
};
