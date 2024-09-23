import { ModalProps } from "react-native";

export type FullscreenImageProps = ModalProps & {
  onClose: () => void;
  imageUrl: string;
};
