import { useEffect } from "react";
import { useAuthContext } from "../../contexts/auth";
import { SignInProps } from "./model";
import Template from "./template";

export default function SignIn({ navigation }: SignInProps) {
  const { user, signIn } = useAuthContext();

  async function _signIn() {
    await signIn();
  }

  useEffect(() => {
    if (user) navigation.replace("Chats");
  }, [user]);

  return <Template onSignIn={_signIn} />;
}
