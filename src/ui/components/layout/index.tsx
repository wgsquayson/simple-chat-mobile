import { PropsWithChildren } from "react";
import useStyle from "../../hooks/use-style";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from "react-native";
import { LayoutProps } from "./model";

export default function Layout({ children, footer }: LayoutProps) {
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
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>{children}</View>
        {footer}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
