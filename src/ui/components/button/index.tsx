import { Text, TouchableOpacity } from "react-native";
import { useStyle } from "../../hooks";
import { ButtonProps } from "./model";

export default function Button({ label, loading, ...props }: ButtonProps) {
  const styles = useStyle((theme) => ({
    buttonText: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.sml,
      fontWeight: 800,
      textDecorationLine: "underline",
    },
    buttonLoading: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.sml,
      fontWeight: 800,
    },
    touchable: {
      opacity: props.disabled || loading ? 0.4 : 1,
    },
  }));

  if (loading) {
    return <Text style={styles.buttonLoading}>Wait...</Text>;
  }

  return (
    <TouchableOpacity {...props} style={styles.touchable}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}
