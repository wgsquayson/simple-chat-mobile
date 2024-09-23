import { TouchableOpacityProps } from "react-native";

export type ButtonProps = TouchableOpacityProps & {
  label: string;
  loading?: boolean;
};
