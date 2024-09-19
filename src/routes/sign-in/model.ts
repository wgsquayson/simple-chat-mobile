import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "..";

export type SignInProps = NativeStackScreenProps<StackParamList, "SignIn">;

export type TemplateProps = {
  onSignIn: () => void;
};
