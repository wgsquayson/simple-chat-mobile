import useStyle from "../../hooks/use-style";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LayoutProps } from "./model";
import Row from "../row";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";

export default function Layout({ children, footer, header }: LayoutProps) {
  const styles = useStyle((theme) => ({
    container: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.colors.background.primary,
      paddingTop: 56,
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    headerText: {
      color: theme.colors.text.primary,
      fontWeight: 600,
      fontSize: theme.fontSizes.md,
    },
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {header ? (
          <>
            <Row
              justifyContent="space-between"
              marginBottom={styles.theme.spacing.sml}
            >
              <Row gap={styles.theme.spacing.sml}>
                {header.leftIcon === "none" ? null : (
                  <TouchableOpacity>
                    <Entypo
                      name={header.leftIcon}
                      size={24}
                      color={styles.theme.colors.icon.primary}
                      onPress={header.onLeftPress}
                    />
                  </TouchableOpacity>
                )}
                {header.title ? (
                  <Text style={styles.headerText}>{header.title}</Text>
                ) : null}
              </Row>
              {header?.rightIcon ? (
                <TouchableOpacity>
                  <Entypo
                    name={header.rightIcon}
                    size={24}
                    color={styles.theme.colors.icon.primary}
                    onPress={header.onRightPress}
                  />
                </TouchableOpacity>
              ) : null}
            </Row>
          </>
        ) : null}
        <View style={{ flex: 1 }}>{children}</View>
        {footer}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
