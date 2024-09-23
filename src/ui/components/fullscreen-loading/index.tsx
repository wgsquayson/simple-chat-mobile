import { ActivityIndicator, View } from "react-native";
import { useStyle } from "../../hooks";
import Layout from "../layout";

export default function FullscreenLoading() {
  const styles = useStyle(() => ({
    container: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
  }));

  return (
    <Layout>
      <View style={styles.container}>
        <ActivityIndicator
          animating
          size="large"
          color={styles.theme.colors.icon.primary}
        />
      </View>
    </Layout>
  );
}
