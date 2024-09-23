import { Image, Modal, Text, TouchableOpacity } from "react-native";
import { useStyle } from "../../../../ui/hooks";
import { Layout, Row } from "../../../../ui/components";
import Entypo from "@expo/vector-icons/Entypo";
import { FullscreenImageProps } from "./model";

export default function FullscreenImage({
  imageUrl,
  onClose,
  ...props
}: FullscreenImageProps) {
  const styles = useStyle((theme) => ({
    pageTitle: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.md,
      fontWeight: 700,
    },
    image: {
      width: "100%",
      height: "100%",
    },
  }));

  return (
    <Modal animationType="slide" onRequestClose={onClose} {...props}>
      <Layout>
        <Row
          justifyContent="space-between"
          marginBottom={styles.theme.spacing.sml}
        >
          <Text style={styles.pageTitle}>Image</Text>
          <TouchableOpacity>
            <Entypo
              name="cross"
              size={24}
              color={styles.theme.colors.icon.primary}
              onPress={onClose}
            />
          </TouchableOpacity>
        </Row>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </Layout>
    </Modal>
  );
}
