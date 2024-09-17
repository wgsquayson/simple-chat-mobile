import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "..";

export type ChatProps = NativeStackScreenProps<StackParamList, "Chat">;

export type TemplateProps = {
  onGoBack: () => void;
};
