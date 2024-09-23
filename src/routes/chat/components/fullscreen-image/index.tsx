import { Image, Modal } from "react-native";
import { useStyle } from "../../../../ui/hooks";
import { Layout } from "../../../../ui/components";
import { FullscreenImageProps } from "./model";
import STRINGS from "../../strings";

export default function FullscreenImage({
  imageUrl,
  onClose,
  ...props
}: FullscreenImageProps) {
  const styles = useStyle(() => ({
    image: {
      width: "100%",
      height: "100%",
    },
  }));

  return (
    <Modal animationType="slide" onRequestClose={onClose} {...props}>
      <Layout
        header={{
          title: STRINGS.IMAGE,
          rightIcon: "cross",
          onRightPress: onClose,
          leftIcon: "none",
        }}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </Layout>
    </Modal>
  );
}
