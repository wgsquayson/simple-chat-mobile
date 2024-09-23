import { Text, View } from "react-native";
import { Button, Layout } from "../../ui/components";
import { useStyle } from "../../ui/hooks";
import { TemplateProps } from "./model";
import STRINGS from "./strings";

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
  }));

  return (
    <Layout>
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.greeting}>{STRINGS.GREETINGS}</Text>
          <Text style={styles.title}>{STRINGS.TITLE}</Text>
        </View>
        <Button label={STRINGS.GOOGLE_SIGN_IN} onPress={onSignIn} />
      </View>
    </Layout>
  );
}
