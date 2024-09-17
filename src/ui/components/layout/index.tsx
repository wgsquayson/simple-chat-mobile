import { PropsWithChildren } from "react";
import useStyle from "../../hooks/use-style";
import { KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";

export default function Layout({ children }: PropsWithChildren) {
  const styles = useStyle((theme) => ({
    container: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.colors.background.primary,
      paddingTop: 56,
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
    </KeyboardAvoidingView>
  );
}
