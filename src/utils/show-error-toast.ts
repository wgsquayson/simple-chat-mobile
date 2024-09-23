import Toast, {
  BaseToastProps,
  ToastConfigParams,
} from "react-native-toast-message";

export default function showToast(
  props?: Partial<ToastConfigParams<BaseToastProps>>
) {
  Toast.show({
    text1: props?.text1 ?? "Something went wrong",
    text2:
      props?.text2 ??
      "An error happened while processing your request. Try again.",
  });
}
