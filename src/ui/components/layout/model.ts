import { PropsWithChildren } from "react";
import { Entypo } from "@expo/vector-icons";

export type LayoutProps = PropsWithChildren & {
  footer?: React.ReactElement;
  header?: {
    title?: string | null;
    leftIcon?: keyof (typeof Entypo)["glyphMap"] | "none";
    onLeftPress?: () => void;
    rightIcon?: keyof (typeof Entypo)["glyphMap"];
    onRightPress?: () => void;
  };
};
