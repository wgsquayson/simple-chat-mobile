import { Modal, TextInput } from "react-native";
import { useStyle } from "../../../../ui/hooks";
import { Button, Layout, Row } from "../../../../ui/components";
import { CreateChatProps } from "./model";
import { useState } from "react";
import Toast from "react-native-toast-message";

export default function CreateChat({
  onConfirm,
  onClose,
  loading,
  ...props
}: CreateChatProps) {
  const [email, setEmail] = useState("");

  const styles = useStyle((theme) => ({
    input: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.sml,
      borderBottomWidth: 1,
      borderBlockColor: theme.colors.border.primary,
      paddingVertical: theme.spacing.sml,
    },
  }));

  function _onClose() {
    setEmail("");
    onClose();
  }

  async function onSubmit() {
    await onConfirm(email);
    setEmail("");
  }

  return (
    <Modal animationType="slide" onRequestClose={_onClose} {...props}>
      <Layout
        header={{
          leftIcon: "none",
          title: "Create a chat",
          rightIcon: "cross",
          onRightPress: _onClose,
        }}
        footer={
          <Row justifyContent="center" marginBottom={styles.theme.spacing.sml}>
            <Button
              label="Confirm"
              onPress={onSubmit}
              loading={loading}
              disabled={!email}
            />
          </Row>
        }
      >
        <TextInput
          style={styles.input}
          placeholder="Type a Gmail"
          placeholderTextColor={styles.theme.colors.text.primaryDarker}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoFocus
          autoCapitalize="none"
        />
      </Layout>
      <Toast type="error" position="top" autoHide />
    </Modal>
  );
}
