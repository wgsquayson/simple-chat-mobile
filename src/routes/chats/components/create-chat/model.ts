import { ModalProps } from "react-native";

export type CreateChatProps = ModalProps & {
  onClose: () => void;
  onConfirm: (email: string) => Promise<void>;
  loading: boolean;
};
