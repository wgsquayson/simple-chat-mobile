import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "..";
import { User } from "../../contexts/auth/model";

export type ChatProps = NativeStackScreenProps<StackParamList, "Chat">;

export type TemplateProps = {
  onGoBack: () => void;
  chat: Chat;
  user: User;
  loading: boolean;
  onSendMessage: (params: Pick<Message, "text">) => Promise<void>;
};

export type Message = {
  id: string;
  text: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  senderId: string;
};

export type Chat = {
  participants: User[];
  messages: Message[];
};
