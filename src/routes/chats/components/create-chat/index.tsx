import { Modal, Text, TextInput, TouchableOpacity } from "react-native";
import { useStyle } from "../../../../ui/hooks";
import { Button, Layout, Row } from "../../../../ui/components";
import Entypo from "@expo/vector-icons/Entypo";
import { CreateChatProps } from "./model";
import { useState } from "react";

export default function CreateChat({
  onConfirm,
  onClose,
  loading,
  ...props
}: CreateChatProps) {
  const [email, setEmail] = useState("");

  const styles = useStyle((theme) => ({
    pageTitle: {
      color: theme.colors.text.primary,
      fontSize: theme.fontSizes.md,
      fontWeight: 700,
    },
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

  return (
    <Modal animationType="slide" {...props}>
      <Layout
        footer={
          <Row justifyContent="center" marginBottom={styles.theme.spacing.sml}>
            <Button
              label="Confirm"
              onPress={() => onConfirm(email)}
              loading={loading}
            />
          </Row>
        }
      >
        <Row
          justifyContent="space-between"
          marginBottom={styles.theme.spacing.sml}
        >
          <Text style={styles.pageTitle}>Create a chat</Text>
          <TouchableOpacity>
            <Entypo
              name="cross"
              size={24}
              color={styles.theme.colors.icon.primary}
              onPress={_onClose}
            />
          </TouchableOpacity>
        </Row>
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
    </Modal>
  );
}
