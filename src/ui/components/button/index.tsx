import { Text, TouchableOpacity } from "react-native";
import { useStyle } from "../../hooks";
import { ButtonProps } from "./model";

export default function Button({ label, ...props }: ButtonProps) {
  const styles = useStyle((theme) => ({
    buttonText: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.sml,
      fontWeight: 800,
      textDecorationLine: "underline",
    },
  }));

  return (
    <TouchableOpacity {...props}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}
