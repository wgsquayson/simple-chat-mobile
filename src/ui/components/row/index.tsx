import { View } from "react-native";
import { useStyle } from "../../hooks";
import { RowProps } from "./model";

export default function Row({ children, ...props }: RowProps) {
  const styles = useStyle(() => ({
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      ...props,
    },
  }));

  return <View style={styles.row}>{children}</View>;
}
