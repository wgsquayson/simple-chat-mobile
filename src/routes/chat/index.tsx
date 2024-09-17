import { ChatProps } from "./model";
import Template from "./template";

export default function Chat({ navigation, route }: ChatProps) {
  return <Template onGoBack={navigation.goBack} />;
}
