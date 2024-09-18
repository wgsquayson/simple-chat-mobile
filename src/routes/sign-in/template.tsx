import { Text, TouchableOpacity, View } from "react-native";
import { Layout } from "../../ui/components";
import { useStyle } from "../../ui/hooks";
import { TemplateProps } from "./model";

export default function ({ onSignIn }: TemplateProps) {
  const styles = useStyle((theme) => ({
    container: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      gap: theme.spacing.md,
    },
    greeting: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.sml,
    },
    title: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.xl,
      fontWeight: 200,
    },
    buttonText: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.sml,
      fontWeight: 800,
      textDecorationLine: "underline",
    },
  }));

  return (
    <Layout>
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.greeting}>Welcome to</Text>
          <Text style={styles.title}>SimpleChat</Text>
        </View>
        <TouchableOpacity onPress={onSignIn}>
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}
