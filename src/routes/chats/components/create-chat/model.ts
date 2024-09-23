import { ModalProps } from "react-native";

export type CreateChatProps = ModalProps & {
  onClose: () => void;
  onConfirm: (email: string) => void;
  loading: boolean;
};
